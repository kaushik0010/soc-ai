import { NextRequest, NextResponse } from "next/server";
import { runKestraFlow } from "@/lib/kestra";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { flowId, payload } = body;

        if (!flowId) {
            return NextResponse.json({ error: "Missing flowId" }, { status: 400 });
        }

        // The runKestraFlow function now includes all necessary authentication,
        // URI construction, and payload formatting logic.
        const execution = await runKestraFlow(flowId, payload);

        return NextResponse.json({
            success: true,
            execution,
        });
    } catch (error: any) {
        // Log the detailed error on the server side
        console.error("Error executing Kestra flow:", error);

        // Return a client-friendly error response (500 status)
        // We extract the message from the thrown error (which runKestraFlow provides)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to trigger Kestra flow." },
            { status: 500 }
        );
    }
}