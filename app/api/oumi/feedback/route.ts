// app/api/oumi/feedback/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { IncidentSchema, SuggestedActionSchema } from "@/types/incident";
import { provideOumiRlFeedback } from "@/lib/oumiClient";

// Define a Zod schema for the analyst's feedback payload
const FeedbackPayloadSchema = z.object({
    incidentId: z.string().uuid(),
    
    // Analyst's corrected severity
    severity: IncidentSchema.shape.severity, 

    // Analyst's corrected actions (can be empty array if no action is needed)
    suggestedActions: z.array(SuggestedActionSchema), 
    
    // Analyst's justification for overriding the AI
    justification: z.string().min(10, "Justification is required to train the model."),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Validate the incoming feedback data
        const validatedData = FeedbackPayloadSchema.parse(body);

        const { incidentId, severity, suggestedActions, justification } = validatedData;

        // 2. Call the Oumi Client to queue the data for RL fine-tuning
        const result = await provideOumiRlFeedback(incidentId, {
            severity,
            suggestedActions,
            justification
        });

        if (!result.success) {
             return NextResponse.json(
                { success: false, message: result.message },
                { status: 500 }
            );
        }

        // 3. Success Response
        return NextResponse.json({
            success: true,
            message: "Analyst feedback submitted successfully to Oumi RL Queue.",
            incidentId: incidentId,
        });

    } catch (error: any) {
        console.error("Oumi Feedback API Error:", error);
        
        // Handle Zod validation errors cleanly
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: "Invalid feedback payload.", errors: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, message: error.message || "Failed to submit RL feedback" },
            { status: 500 }
        );
    }
}