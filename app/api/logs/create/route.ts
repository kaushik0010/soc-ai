// src/app/api/logs/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LogEntry } from "@/models/LogEntry.model";
import { groqSummarize, groqClassify } from "@/lib/groqClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawText, userId } = body;

    if (!rawText || rawText.trim() === "") {
      return NextResponse.json(
        { success: false, message: "rawText is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const [summary, classification] = await Promise.all([
      groqSummarize(rawText),
      groqClassify(rawText),
    ]);

    const logSummary = summary.success ? summary.summary : undefined;
    const logClassification = classification.success ? classification.classification : undefined;

    // 3️⃣ Save to database
    const log = await LogEntry.create({
      rawText,
      userId: userId || undefined,
      summary: logSummary,
      classification: logClassification,
      source: "manual",
    });

    return NextResponse.json({
      success: true,
      message: "Log created successfully",
      log,
    });
  } catch (error: any) {
    console.error("Error creating log:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
