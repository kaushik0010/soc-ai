import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LogEntry } from "@/models/LogEntry.model";
import { IncidentModel } from "@/models/Incident.model"; // NEW: Import Incident Model
import { groqTriageAndStructure } from "@/lib/groqClient"; // NEW: Import structured triage
import { v4 as uuidv4 } from 'uuid'; // NEW: For generating incident IDs

export async function POST(req: Request) {
  try {
    // 1️⃣ Validate webhook secret (Unchanged)
    const secret = req.headers.get("x-kestra-secret");
    if (!secret || secret !== process.env.KESTRA_WEBHOOK_SECRET) {
      return NextResponse.json(
        { success: false, message: "Unauthorized Webhook" },
        { status: 401 }
      );
    }

    // 2️⃣ Parse body and save raw log
    const body = await req.json();
    const { rawText, userId } = body;

    if (!rawText || rawText.trim() === "") {
      return NextResponse.json(
        { success: false, message: "rawText is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 3️⃣ Save raw log first (with minimal fields, no classification/summary needed here)
    const log = await LogEntry.create({
      rawText,
      userId: userId ?? undefined,
      source: "webhook",
      // We remove summary/classification from here, as the Incident holds the analysis
    });

    // 4️⃣ Execute Triage Agent for structured incident creation
    // NOTE: This is where we would typically add context from a VectorDB for RAG, 
    // but for the MVP, we just pass the raw log text.
    const triageResult = await groqTriageAndStructure(log.rawText);

    if (!triageResult.success || !triageResult.incident) {
      // If structured triage fails, log it and return the raw log saved
      console.error("Triage Agent failed to create structured Incident:", triageResult.error);
      return NextResponse.json({
        success: false,
        message: `Log saved, but Triage failed: ${triageResult.error}`,
        log,
      }, { status: 500 });
    }

    // 5️⃣ Finalize and Save the Incident
    const newIncidentData = {
      ...triageResult.incident,
      // Overwrite the AI-generated UUID with a unique ID suitable for Mongoose/indexing
      incidentId: uuidv4(),
      // Link the current log entry ID to the Incident
      logEntryIds: [log._id],
    };

    const incident = await IncidentModel.create(newIncidentData as any);

    // 6️⃣ Respond
    return NextResponse.json({
      success: true,
      message: "Log triaged successfully and Incident created",
      log,
      incident: incident, // Return the newly created incident
    });

  } catch (error: any) {
    console.error("Kestra Webhook Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Webhook failed" },
      { status: 500 }
    );
  }
}