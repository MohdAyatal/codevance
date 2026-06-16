import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type UserProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  score: number;
  xp_earned: number;
  attempts: number;
  completed_at: string | null;
};

export type QuizAttempt = {
  id: string;
  user_id: string;
  lesson_id: string;
  question: string;
  options: string[];
  correct_index: number;
  user_answer: number | null;
  is_correct: boolean | null;
  explanation: string;
};

export type Profile = {
  id: string;
  full_name: string;
  total_xp: number;
  streak: number;
  last_active: string;
};
