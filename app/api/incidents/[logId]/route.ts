import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { IncidentModel } from "@/models/Incident.model";
import mongoose from "mongoose";

export async function GET(
    req: Request,
    { params }: { params: { logId: string } }
) {
    try {
        await connectDB();
        const { logId } = await params;

        if (!logId || !mongoose.Types.ObjectId.isValid(logId)) {
            return NextResponse.json(
                { success: false, message: "Invalid Log ID" },
                { status: 400 }
            );
        }

        // Find the Incident that contains this LogEntry ID in its logEntryIds array
        const incident = await IncidentModel.findOne({
            logEntryIds: logId,
        })
        .lean(); // Use .lean() for faster, plain JavaScript objects

        if (!incident) {
            return NextResponse.json(
                { success: false, message: "No Incident found for this Log" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            incident,
        });

    } catch (error: any) {
        console.error("Error fetching Incident by Log ID:", error);
        return NextResponse.json(
            { success: false, message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}