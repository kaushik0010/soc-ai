import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LogEntry } from "@/models/LogEntry.model";

export async function GET() {
  await connectDB();

  const test = await LogEntry.create({
    rawText: "Hello world log",
  });

  return NextResponse.json({ success: true, test });
}
