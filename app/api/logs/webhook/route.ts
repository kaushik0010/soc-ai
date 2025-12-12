import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LogEntry } from "@/models/LogEntry.model";
import { IncidentModel } from "@/models/Incident.model";
import { groqTriageAndStructure } from "@/lib/groqClient";
import { v4 as uuidv4 } from 'uuid';

/**
 * Handles incoming log data from external systems (e.g., SIEM, firewalls) via webhook.
 * Expects: { rawText: string, userId?: string }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { rawText, userId } = body;

        if (!rawText || rawText.trim() === "") {
            return NextResponse.json(
                { success: false, message: "rawText is required in webhook payload" },
                { status: 400 }
            );
        }

        await connectDB();

        // 1️⃣ Save raw log with source set to 'webhook'
        const log = await LogEntry.create({
            rawText,
            // Assuming the external system provides a user ID or service name
            userId: userId || "system-source", 
            source: "webhook", // <<< CRITICAL: Sets the source for the dashboard
        });

        let incident = null;
        let triageError: string | null = null;

        // 2️⃣ Execute Triage Agent for structured incident creation (with retry logic)
        const triageResult = await groqTriageAndStructure(log.rawText);

        if (triageResult.success && triageResult.incident) {
            // Triage SUCCESS: Save the Incident
            try {
                const newIncidentData = {
                    ...triageResult.incident,
                    incidentId: uuidv4(),
                    logEntryIds: [log._id],
                };
                incident = await IncidentModel.create(newIncidentData as any);

            } catch (dbError: any) {
                triageError = `Database error creating incident: ${dbError.message}`;
                console.error(triageError);
            }
        } else {
            // Triage FAILURE: Store the error message
            triageError = triageResult.error || "Triage Agent returned no structured incident.";
            console.error("Webhook Triage Agent failed:", triageError);
        }

        // 3️⃣ Final Response: Return success (HTTP 200) regardless of triage status, 
        // as the log was accepted and saved.
        const responseMessage = incident 
            ? "Webhook log accepted and triaged successfully." 
            : `Webhook log accepted, but Triage failed: ${triageError}.`;

        return NextResponse.json({
            success: true,
            message: responseMessage,
            log,
            incident,
        });
        
    } catch (error: any) {
        console.error("Error processing webhook log:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Server error processing webhook" },
            { status: 500 }
        );
    }
}