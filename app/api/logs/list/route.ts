// src/app/api/logs/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LogEntry } from "@/models/LogEntry.model";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const userId = searchParams.get("userId");
    const source = searchParams.get("source");
    const classification = searchParams.get("classification");
    const search = searchParams.get("search");

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const query: Record<string, any> = {};

    if (userId) query.userId = userId;
    if (source) query.source = source;

    if (classification) query.classification = classification;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Text search (rawText + summary)
    if (search) {
      query.$or = [
        { rawText: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } }
      ];
    }

    const totalLogs = await LogEntry.countDocuments(query);

    const logs = await LogEntry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      totalLogs,
      page,
      limit,
      logs,
    });

  } catch (error: any) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
