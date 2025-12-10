import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LogEntry } from "@/models/LogEntry.model";
import { groqSummarize, groqClassify } from "@/lib/groqClient";

export async function POST(req: Request) {
  try {
    // 1️⃣ Validate webhook secret
    const secret = req.headers.get("x-kestra-secret");
    if (!secret || secret !== process.env.KESTRA_WEBHOOK_SECRET) {
      return NextResponse.json(
        { success: false, message: "Unauthorized Webhook" },
        { status: 401 }
      );
    }

    // 2️⃣ Parse body
    const body = await req.json();
    const { rawText, userId } = body;

    if (!rawText || rawText.trim() === "") {
      return NextResponse.json(
        { success: false, message: "rawText is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 3️⃣ Call Groq APIs in parallel for speed
    const [summary, classification] = await Promise.all([
      groqSummarize(rawText),
      groqClassify(rawText),
    ]);

    const logSummary = summary.success ? summary.summary : undefined;
    const logClassification = classification.success ? classification.classification : undefined;

    // 4️⃣ Save log (use undefined for optional fields instead of null)
    const log = await LogEntry.create({
      rawText,                    // required
      userId: userId ?? undefined,
      summary: logSummary,
      classification: logClassification,
      source: "webhook",
    });

    // 5️⃣ Respond
    return NextResponse.json({
      success: true,
      message: "Kestra webhook received & log saved with AI processing",
      log,
    });
  } catch (error: any) {
    console.error("Kestra Webhook Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Webhook failed" },
      { status: 500 }
    );
  }
}
