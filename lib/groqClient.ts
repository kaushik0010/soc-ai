import Groq from "groq-sdk";
import type { ChatCompletionMessageParam, ChatCompletionTool } from "groq-sdk/resources/chat/completions";
import { IncidentSchema, Incident } from "@/types/incident"; // Import Zod schema and type

// Initialize Groq client
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// --- CRITICAL TYPING & FUNCTION ---

export interface GroqTriageResult {
  success: boolean;
  incident: Incident | null;
  error?: string;
  rawOutput?: string;
}

const MAX_RETRIES = 2; // Allow one initial try + one retry for stability

/**
 * Triage Agent: Takes raw log data and uses Groq's Structured Output (via Tool Definition)
 * to return a complete Incident object.
 */
export async function groqTriageAndStructure(logText: string, pastContext: string = ""): Promise<GroqTriageResult> {
  // Define available flow IDs for the agent to include in suggestedActions
  const AVAILABLE_KESTRA_FLOWS = {
    BLOCK_IP: "socai.remediation.block-ip",
    DISABLE_USER: "socai.remediation.disable-user",
    CREATE_TICKET: "socai.remediation.create-ticket-jira",
  };

  // 1. Define the System Prompt
  const systemPrompt = `You are the SOC-AI Triage Agent. Your task is critical: analyze the provided security log and contextual information. You MUST cluster this log into a complete, structured Incident object, strictly following the JSON schema provided by the 'triage_incident' tool.
  
  Focus on:
  - Severity: Assign a valid enum value (Low, Medium, High, Critical, Informational).
  - Suggested Actions: Provide actionable steps based on the findings.
  
  --- CRITICAL CONSTRAINTS ---
  1. actionId: MUST be a universally unique identifier (UUID).
  2. Action Type: The 'type' field MUST be one of the exact strings: 'block_ip', 'disable_user', 'isolate_host', or 'create_ticket'.
  3. Kestra Flow IDs: You MUST populate the 'kestraFlowId' field with the correct flow ID from this list:
     - 'block_ip' action uses flow ID: "${AVAILABLE_KESTRA_FLOWS.BLOCK_IP}"
     - 'disable_user' action uses flow ID: "${AVAILABLE_KESTRA_FLOWS.DISABLE_USER}"
     - 'create_ticket' action uses flow ID: "${AVAILABLE_KESTRA_FLOWS.CREATE_TICKET}"
  ---------------------------
  `;

  // 2. Define the User Prompt
  const userPrompt = `Raw Security Log to Analyze:
    ---
    ${logText}
    ---
    ${pastContext ? `Past Incident Context: ${pastContext}` : ''}
    `;

  // 3. Define the Tool (Structured Output)
  const triageTool: ChatCompletionTool = {
    type: "function",
    function: {
      name: "triage_incident",
      description: "Creates a complete, structured incident object from raw security log data.",
      parameters: IncidentSchema as unknown as Record<string, any>, // Zod to JSON Schema
    },
  };

  let lastError: any = null;

  // START RETRY LOOP
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [triageTool],
        temperature: 0.1,
      });

      // 4. Extract and Validate the JSON response (Robust retrieval)
      let jsonString: string;
      const toolCall = completion.choices[0]?.message?.tool_calls?.[0];

      if (toolCall) {
        jsonString = toolCall.function.arguments;
      } else if (completion.choices[0]?.message?.content) {
        jsonString = completion.choices[0].message.content;
      } else {
        throw new Error("Groq returned no content or tool call for triage.");
      }

      const parsedJson = JSON.parse(jsonString);

      // CLEANUP: Remove fields the LLM should not populate but insists on generating
      if (parsedJson.logEntryIds) {
        delete parsedJson.logEntryIds;
      }
      if (parsedJson.status === undefined) {
        parsedJson.status = 'New';
      }

      // Zod validation acts as the final guardrail
      const validatedIncident = IncidentSchema.parse(parsedJson);

      // SUCCESS: Break the loop and return
      return {
        success: true,
        incident: validatedIncident,
        rawOutput: jsonString,
      };

    } catch (error: any) {
      lastError = error;

      // Check for the specific recoverable tool_use_failed or Zod error
      const isRecoverableError =
        (error?.status === 400 && error?.message?.includes("tool_use_failed")) ||
        (error instanceof Error && error.name === "ZodError");

      if (!isRecoverableError || attempt === MAX_RETRIES - 1) {
        // If it's a non-recoverable error, or the last attempt, exit.
        break;
      }

      console.warn(`Groq Triage: Attempt ${attempt + 1} failed. Retrying...`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retrying
    }
  }
  // END RETRY LOOP

  console.error("Groq Triage Error: All attempts failed.", lastError);
  return {
    success: false,
    incident: null,
    error: lastError?.message || "Unknown Groq error during structured triage.",
  };
}