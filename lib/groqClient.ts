// lib/groqClient.ts
import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

// Initialize Groq client
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// Typings for results
export interface GroqSummaryResult {
  success: boolean;
  summary: string;
  error?: string;
}

export interface GroqClassificationResult {
  success: boolean;
  classification: string;
  error?: string;
}

// --- Summarize ---
export async function groqSummarize(text: string): Promise<GroqSummaryResult> {
  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: "You are SOC-AI. Summarize logs into a concise, insight-rich explanation.",
      },
      {
        role: "user",
        content: text,
      },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
    });

    return {
      success: true,
      summary: completion.choices[0]?.message?.content || "",
    };
  } catch (error: any) {
    console.error("Groq summarize error:", error);
    return {
      success: false,
      summary: "",
      error: error?.message || "Unknown error",
    };
  }
}

// --- Classify ---
export async function groqClassify(logText: string): Promise<GroqClassificationResult> {
  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You are SOC-AI. Classify logs into: benign, suspicious, malicious, credential_access, or network_intrusion.",
      },
      {
        role: "user",
        content: logText,
      },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
    });

    return {
      success: true,
      classification: completion.choices[0]?.message?.content || "",
    };
  } catch (error: any) {
    console.error("Groq classify error:", error);
    return {
      success: false,
      classification: "",
      error: error?.message || "Unknown error",
    };
  }
}
