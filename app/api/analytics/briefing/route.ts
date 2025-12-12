import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { fetcher } from "@/utils/fetcher"; // Use the same fetcher utility

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY!,
});

// Define the model we stabilized earlier
const AI_MODEL = "llama-3.3-70b-versatile";

export async function GET() {
    try {
        // 1. Fetch Raw Analytics Data from our internal API
        // NOTE: We use the fetcher utility to hit our own backend route
        const analyticsResponse = await fetcher<{ dashboardData: any }>('/analytics/dashboard');
        const rawAnalyticsData = analyticsResponse.dashboardData;

        // 2. Construct the AI System Prompt
        const systemPrompt = `You are the SOC-AI Senior Analyst. Your task is to provide a concise, high-level security briefing for executive staff and Tier 1 analysts.
        
        Analyze the following raw security metrics (JSON format) and summarize the current state in **three to four sentences**:
        1. Current risk level (Critical, High, Medium, Low).
        2. The most significant finding or trend (e.g., "Brute force attacks are up 50%").
        3. The single most important action recommended for the next hour.
        
        ONLY respond with the briefing text, nothing else.`;

        // 3. Construct the User Prompt (sending the data)
        const userPrompt = `ANALYTICS DATA:\n${JSON.stringify(rawAnalyticsData, null, 2)}`;

        // 4. Call the Groq Agent
        const completion = await groq.chat.completions.create({
            model: AI_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.1,
        });

        const briefingText = completion.choices[0]?.message?.content || "AI Briefing unavailable.";

        return NextResponse.json({
            success: true,
            briefing: briefingText,
        });

    } catch (error: any) {
        console.error("AI Briefing Generation Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to generate AI briefing." },
            { status: 500 }
        );
    }
}