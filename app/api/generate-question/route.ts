import { NextRequest, NextResponse } from "next/server";
import { generateQuizQuestions } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const { topic, count = 3, previousQuestions = [] } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const questions = await generateQuizQuestions(topic, count, previousQuestions);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Question generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
