import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: any) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set({name, value, options}: any)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lessonId, question, options, correctIndex, userAnswer, explanation } =
    await req.json();

  const isCorrect = userAnswer === correctIndex;

  // Save quiz attempt
  await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    lesson_id: lessonId,
    question,
    options,
    correct_index: correctIndex,
    user_answer: userAnswer,
    is_correct: isCorrect,
    explanation,
  });

  return NextResponse.json({ isCorrect, explanation });
}
