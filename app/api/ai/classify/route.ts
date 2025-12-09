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

    // Dummy classification logic (replace with Oumi + Groq on Day 2)
    const mockCategory = "General Inquiry";

    return NextResponse.json({
      success: true,
      category: mockCategory,
      message: "Classification route working (dummy response)",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
