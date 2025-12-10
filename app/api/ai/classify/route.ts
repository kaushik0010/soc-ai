import { NextRequest, NextResponse } from "next/server";
import { groqClassify, GroqClassificationResult } from "@/lib/groqClient";
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

    const classifyResult: GroqClassificationResult = await groqClassify(text);

    // Connect to DB and save log
    await connectDB();
    const log = await LogEntry.create({
      rawText: text,
      classification: classifyResult.success ? classifyResult.classification : undefined,
      userId: userId || undefined,
      source: "api",
    });

    return NextResponse.json({
      success: classifyResult.success,
      classification: classifyResult.classification,
      message: classifyResult.success
        ? "Classification (Groq) successful"
        : `Classification failed: ${classifyResult.error}`,
      log,
    });
  } catch (error: any) {
    console.error("Classify API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
