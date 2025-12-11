import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

export interface KestraFlowExecution {
  flowId: string;
  executionId: string; // NEW: Added execution ID
  executedAt: Date;
  payloadReceived: Record<string, any>;
  flowDefinition: string;
  result: any; // will hold AI processed results
}

export async function runKestraFlow(
  flowId: string,
  payload: Record<string, any>
): Promise<KestraFlowExecution> {
  // 1. Load YAML flow
  const filePath = path.join(process.cwd(), "lib/flows", `${flowId}.yml`);
  if (!fs.existsSync(filePath)) {
    // Critical: If the flow doesn't exist, we can't run it.
    throw new Error(`Kestra flow file not found: ${filePath}`);
  }

  const flowDef = fs.readFileSync(filePath, "utf-8");

  console.log(`[Kestra Mock] Executing Flow: ${flowId} with payload:`, payload);

  // 2. Simulate Kestra returning an execution ID and a SUCCESS result
  return {
    flowId,
    executionId: uuidv4(), // Generate a unique ID for the mock execution
    executedAt: new Date(),
    payloadReceived: payload,
    flowDefinition: flowDef,
    // Mocked result: In a real system, this would be the final task output.
    result: {
      status: "SUCCESS",
      message: `Flow ${flowId} executed successfully (mocked).`,
      // Include the payload back in the result for debugging purposes
      flow_input: payload,
    },
  };
}