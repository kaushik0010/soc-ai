// src/app/api/logs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LogEntry } from "@/models/LogEntry.model";
import mongoose from "mongoose";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { pathname } = new URL(req.url);
    const id = pathname.split("/").pop();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid log ID" },
        { status: 400 }
      );
    }

    const deleted = await LogEntry.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Log not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Log deleted successfully",
      log: deleted,
    });
  } catch (error: any) {
    console.error("Error deleting log:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
