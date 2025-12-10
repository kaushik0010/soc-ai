import { NextRequest, NextResponse } from "next/server";
import { groqSummarize, GroqSummaryResult } from "@/lib/groqClient";
import { connectDB } from "@/lib/db";
import { LogEntry } from "@/models/LogEntry.model";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, userId } = body;

    if (!text) {
      return NextResponse.json(
        { success: false, message: "Text is required" },
        { status: 400 }
      );
    }

    const summaryResult: GroqSummaryResult = await groqSummarize(text);

    // Connect to DB and save log
    await connectDB();
    const log = await LogEntry.create({
      rawText: text,
      summary: summaryResult.success ? summaryResult.summary : undefined,
      userId: userId || undefined,
      source: "api",
    });

    return NextResponse.json({
      success: summaryResult.success,
      summary: summaryResult.summary,
      message: summaryResult.success
        ? "Summarization (Groq) successful"
        : `Summarization failed: ${summaryResult.error}`,
      log,
    });
  } catch (error: any) {
    console.error("Summarize API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
