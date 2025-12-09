import { NextRequest, NextResponse } from "next/server";
import { runKestraFlow } from "@/lib/kestra";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { flowId, payload } = body;

  if (!flowId) {
    return NextResponse.json({ error: "Missing flowId" }, { status: 400 });
  }

  const execution = await runKestraFlow(flowId, payload);

  return NextResponse.json({
    success: true,
    execution,
  });
}
