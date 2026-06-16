-- EduForge AI — Supabase Schema
-- Run this in your Supabase SQL editor

-- Users progress table
create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id text not null,
  completed boolean default false,
  score integer default 0,
  xp_earned integer default 0,
  attempts integer default 0,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, lesson_id)
);

-- Quiz attempts table (stores AI-generated questions + answers)
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id text not null,
  question text not null,
  options jsonb not null,
  correct_index integer not null,
  user_answer integer,
  is_correct boolean,
  explanation text,
  created_at timestamptz default now()
);

-- Certificates table
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  track text not null,
  issued_at timestamptz default now(),
  total_xp integer default 0,
  unique(user_id, track)
);

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  total_xp integer default 0,
  streak integer default 0,
  last_active date,
  created_at timestamptz default now()
);

-- RLS Policies
alter table public.user_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.certificates enable row level security;
alter table public.profiles enable row level security;

create policy "Users can view own progress" on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.user_progress for update using (auth.uid() = user_id);

create policy "Users can view own quizzes" on public.quiz_attempts for select using (auth.uid() = user_id);
create policy "Users can insert own quizzes" on public.quiz_attempts for insert with check (auth.uid() = user_id);
create policy "Users can update own quizzes" on public.quiz_attempts for update using (auth.uid() = user_id);

create policy "Users can view own certificates" on public.certificates for select using (auth.uid() = user_id);
create policy "Users can insert own certificates" on public.certificates for insert with check (auth.uid() = user_id);

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── PREMIUM SYSTEM ADDITIONS ────────────────────────────────────────

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free', -- 'free' | 'monthly' | 'lifetime'
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'cancelled' | 'expired'
  razorpay_subscription_id TEXT,
  razorpay_payment_id TEXT,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Energy system table
CREATE TABLE IF NOT EXISTS public.energy (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current INTEGER NOT NULL DEFAULT 5,
  max_energy INTEGER NOT NULL DEFAULT 5, -- 5 free, 10 premium
  last_refill TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Module unlock schedule (time-locked)
CREATE TABLE IF NOT EXISTS public.module_unlocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Certificate purchases (free users pay ₹49)
CREATE TABLE IF NOT EXISTS public.certificate_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  track_id TEXT NOT NULL,
  amount_paid INTEGER DEFAULT 0, -- 0 for premium, 4900 paise for free
  payment_id TEXT,
  issued_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, track_id)
);

-- Question history (to avoid repeats, track AI question level)
CREATE TABLE IF NOT EXISTS public.question_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  was_correct BOOLEAN,
  difficulty TEXT DEFAULT 'intermediate',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own subscription" ON public.subscriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own energy" ON public.energy FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own unlocks" ON public.module_unlocks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own certificates" ON public.certificate_purchases FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own question history" ON public.question_history FOR ALL USING (auth.uid() = user_id);

-- Auto-create energy + subscription on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_premium()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (new.id, 'free', 'active')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.energy (user_id, current, max_energy, last_refill)
  VALUES (new.id, 5, 5, now())
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created_premium
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_premium();
