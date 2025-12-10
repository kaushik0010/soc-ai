import fs from "fs";
import path from "path";

export interface KestraFlowExecution {
  flowId: string;
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
    throw new Error(`Kestra flow file not found: ${filePath}`);
  }

  const flowDef = fs.readFileSync(filePath, "utf-8");

  console.log("Executing Kestra Flow:", flowId);

  return {
    flowId,
    executedAt: new Date(),
    payloadReceived: payload,
    flowDefinition: flowDef,
    result: null, // actual AI logic handled by Next.js endpoints
  };
}
