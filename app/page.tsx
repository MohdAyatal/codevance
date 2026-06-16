"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { TRACKS, getTotalXP } from "@/lib/curriculum";
import { ArrowRight, Zap, CheckCircle, Bot, Code2, Database, Trophy, Flame } from "lucide-react";

const FEATURES = [
  { icon: <Bot size={18} />, title: "AI-Generated Quizzes", desc: "Claude generates unique questions every session — never the same quiz twice" },
  { icon: <Code2 size={18} />, title: "Live Code Editor", desc: "Write and run Python, Java, SQL directly in your browser. No setup needed" },
  { icon: <Database size={18} />, title: "Progress Tracked", desc: "Every score, XP, and lesson saved to your account with Supabase" },
  { icon: <Trophy size={18} />, title: "Job-Ready Curriculum", desc: "8 tracks covering everything tech companies actually hire for" },
];

const OUTCOMES = [
  "Write production-quality Python code",
  "Solve DSA problems in interviews (Two Sum, Big O, hashmaps)",
  "Write complex SQL with JOINs, CTEs, window functions",
  "Build and train ML models with scikit-learn",
  "Deploy ML models as REST APIs with FastAPI",
  "Build RAG pipelines on private data",
  "Understand and call LLM APIs (Claude, OpenAI)",
  "Build AI agents with tool use",
  "Do EDA and feature engineering with Pandas",
  "Understand data warehousing and ETL pipelines",
  "Apply for internships and junior AI engineer roles",
  "Contribute to open source AI projects",
];

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser(data.user);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-slate-200">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 sticky top-0 bg-[#0A0A14]/90 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">C</div>
            <span className="font-bold text-white text-lg tracking-tight">Codevance</span>
          </div>
          {user ? (
            <button onClick={() => router.push("/dashboard")}
              className="px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg transition-colors font-medium">
              Dashboard →
            </button>
          ) : (
            <span className="text-xs text-slate-500 border border-white/10 px-3 py-1.5 rounded-lg">Free to start</span>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8">
          <Zap size={11} /> AI-Powered · 8 Tracks · {getTotalXP().toLocaleString()} XP to earn
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none tracking-tight">
          Track your journey<br />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">to AI Engineer</span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Master Python, Java, SQL, Data Science, Machine Learning, and AI Engineering with AI-generated quizzes, live code execution, and real progress tracking.
        </p>

        {/* Auth box */}
        <div className="max-w-sm mx-auto">
          {user ? (
            <button onClick={() => router.push("/dashboard")}
              className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-base">
              Continue Learning <ArrowRight size={16} />
            </button>
          ) : sent ? (
            <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
              ✓ Magic link sent! Check your email.
            </div>
          ) : (
            <div className="space-y-3">
              <button onClick={handleGoogle}
                className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-medium rounded-xl transition-colors flex items-center justify-center gap-2.5 text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>
              <div className="flex items-center gap-3 text-slate-600 text-xs">
                <div className="flex-1 h-px bg-white/5" />or email<div className="flex-1 h-px bg-white/5" />
              </div>
              <form onSubmit={handleLogin} className="flex gap-2">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com" required
                  className="flex-1 px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors" />
                <button type="submit" disabled={loading}
                  className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
                  {loading ? "..." : "Go"}
                </button>
              </form>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <p className="text-slate-600 text-xs">No credit card. Free forever on core tracks.</p>
            </div>
          )}
        </div>
      </section>

      {/* Tracks */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">8 tracks. Everything you need.</h2>
          <p className="text-slate-500">Complete all tracks → certified AI Engineer</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TRACKS.map((t) => (
            <div key={t.id} className="p-4 bg-white/2 border border-white/5 hover:border-white/10 rounded-xl transition-colors">
              <div className="text-2xl mb-2">{t.icon}</div>
              <h3 className="font-semibold text-white text-sm mb-1">{t.name}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white text-center mb-10">Built differently from other platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4 p-5 bg-white/2 border border-white/5 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm mb-1">{f.title}</h3>
                <p className="text-slate-500 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <div className="bg-gradient-to-br from-indigo-500/8 to-purple-500/8 border border-indigo-500/15 rounded-2xl p-8 md:p-10">
          <h2 className="text-2xl font-bold text-white mb-2">After completing Codevance, you can:</h2>
          <p className="text-slate-500 mb-8">Designed to match what companies actually test in interviews and use in day-to-day work</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {OUTCOMES.map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8">
            {user ? (
              <button onClick={() => router.push("/dashboard")}
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors">
                Go to Dashboard →
              </button>
            ) : (
              <button onClick={() => document.querySelector('input[type=email]')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors">
                Start for Free →
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">C</div>
            <span className="text-slate-400 font-medium">Codevance</span>
          </div>
          <span>
            Built by <a href="https://github.com/MohdAyatal" className="text-indigo-400 hover:underline">Mohd Ayatal</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
