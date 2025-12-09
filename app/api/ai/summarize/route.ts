import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { success: false, error: "Missing field: content" },
        { status: 400 }
      );
    }

    // Dummy summarization logic (replace with Groq or Oumi on Day 2)
    const mockSummary = "This is a mock summary for testing.";

    return NextResponse.json({
      success: true,
      summary: mockSummary,
      message: "Summarization route working (dummy response)",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
