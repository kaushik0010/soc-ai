import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LogEntry } from "@/models/LogEntry.model";
import { IncidentModel } from "@/models/Incident.model";
import { groqTriageAndStructure } from "@/lib/groqClient"; // Now includes retry logic
import { v4 as uuidv4 } from 'uuid';

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

        // 1️⃣ Save raw log (Must happen first)
        const log = await LogEntry.create({
            rawText,
            userId: userId || undefined,
            source: "manual",
        });

        let incident = null;
        let triageError: string | null = null;

        // 2️⃣ Execute Triage Agent for structured incident creation (Now runs up to 2 retries)
        const triageResult = await groqTriageAndStructure(log.rawText);

        if (triageResult.success && triageResult.incident) {
            // Triage SUCCESS: Save the Incident
            try {
                const newIncidentData = {
                    ...triageResult.incident,
                    incidentId: uuidv4(),
                    logEntryIds: [log._id],
                };
                // Use 'as any' for Mongoose type assertion
                incident = await IncidentModel.create(newIncidentData as any);

            } catch (dbError: any) {
                triageError = `Database error creating incident: ${dbError.message}`;
                console.error(triageError);
            }
        } else {
            // Triage FAILURE (All retries failed): Store the error message
            triageError = triageResult.error || "Triage Agent returned no structured incident.";
            console.error("Triage Agent failed:", triageError);
        }

        // 3️⃣ Final Response: Always return 200/success for the log save, and use the message to indicate triage status
        if (incident) {
            return NextResponse.json({
                success: true,
                message: "Log created and Incident triaged successfully.",
                log,
                incident,
            });
        } else {
            // Triage failed, but log was saved.
            return NextResponse.json({
                success: true, // Still success because the log save succeeded
                message: `Log saved, but Triage failed: ${triageError}. Please run re-triage manually.`,
                log,
                incident: null, // Explicitly null
            });
        }
    } catch (error: any) {
        console.error("Error creating log:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Server error" },
            { status: 500 }
        );
    }
}