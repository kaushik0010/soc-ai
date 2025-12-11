import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LogEntry } from "@/models/LogEntry.model";
import { IncidentModel } from "@/models/Incident.model"; 
import { groqTriageAndStructure } from "@/lib/groqClient"; // Now includes retry logic
import { v4 as uuidv4 } from 'uuid'; 

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Log ID is required" },
                { status: 400 }
            );
        }

        const log = await LogEntry.findById(id);
        if (!log) {
            return NextResponse.json(
                { success: false, message: "Log not found" },
                { status: 404 }
            );
        }

        // 1️⃣ Re-run AI Triage on the raw text (Retry logic is inside this function)
        const triageResult = await groqTriageAndStructure(log.rawText);

        if (!triageResult.success || !triageResult.incident) {
            // If Triage fails (after all retries), log it and return a 500 status.
            console.error("Re-Triage failed after retries:", triageResult.error);
            return NextResponse.json({
                success: false,
                message: `Re-Triage failed: ${triageResult.error}`,
            }, { status: 500 }); 
        }
        
        // 2️⃣ Create a NEW Incident (simulating re-triage/new analysis)
        // We create a new Incident rather than updating the old one for a clean audit trail.
        const newIncidentData = {
            ...triageResult.incident,
            incidentId: uuidv4(),
            logEntryIds: [log._id], // Link to the existing log
            title: `[RE-TRIAGE] ${triageResult.incident.title}` // Indicate re-analysis
        };

        const newIncident = await IncidentModel.create(newIncidentData as any);
        
        // 3️⃣ Final Success Response
        return NextResponse.json({
            success: true,
            message: "AI re-triage successfully created a new Incident",
            log,
            incident: newIncident, // Return the new incident
        });
    } catch (error: any) {
        console.error("Error reprocessing log:", error);
        // Ensure that any unexpected server error also returns 500
        return NextResponse.json(
            { success: false, message: "Server error during re-triage", error: error.message },
            { status: 500 }
        );
    }
}