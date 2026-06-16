"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CURRICULUM, TRACKS, getTotalXP } from "@/lib/curriculum";
import { usePremium } from "@/lib/premium-context";
import { EnergyBar } from "@/components/EnergyBar";
import {
  Trophy, Zap, Flame, BookOpen, CheckCircle,
  Lock, LogOut, ChevronRight, Crown, Clock, Star
} from "lucide-react";
import { formatTimeRemaining, MODULE_UNLOCK_DELAY_MS } from "@/lib/premium";

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { plan, isPremium, canAccessLesson, energy } = usePremium();

  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [progress, setProgress] = useState<Record<string, { completed: boolean; score: number; xp_earned: number; completed_at: string | null }>>({});
  const [profile, setProfile] = useState<{ total_xp: number; streak: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTrack, setActiveTrack] = useState("python");
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (searchParams.get("payment") === "success") setShowPaymentSuccess(true);
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/"); return; }
      setUser(data.user);
      fetchProgress();
    });
    // Update clock every second for time-lock countdowns
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  const fetchProgress = async () => {
    const res = await fetch("/api/progress");
    const data = await res.json();
    if (data.progress) {
      const map: Record<string, { completed: boolean; score: number; xp_earned: number; completed_at: string | null }> = {};
      data.progress.forEach((p: any) => { map[p.lesson_id] = p; });
      setProgress(map);
    }
    if (data.profile) setProfile(data.profile);
    setLoading(false);
  };

  const totalLessons = CURRICULUM.length;
  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const earnedXP = profile?.total_xp || Object.values(progress).reduce((s, p) => s + (p.xp_earned || 0), 0);
  const pct = Math.round((completedCount / totalLessons) * 100);
  const activeTrackLessons = CURRICULUM.filter(l => l.trackId === activeTrack).sort((a, b) => a.order - b.order);
  const trackMeta = TRACKS.find(t => t.id === activeTrack);

  if (loading) return (
    <div className="min-h-screen bg-[#0A0A14] flex items-center justify-center">
      <div className="text-slate-500 text-sm">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A14] flex flex-col">
      {/* Payment success banner */}
      {showPaymentSuccess && (
        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-b border-indigo-500/30 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-indigo-300">
            <Crown size={15} /> 🎉 Welcome to Pro! All modules, 10 energy, and free certificates unlocked.
          </div>
          <button onClick={() => setShowPaymentSuccess(false)} className="text-slate-500 hover:text-slate-300 text-xs">✕</button>
        </div>
      )}

      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-3.5 flex items-center justify-between sticky top-0 bg-[#0A0A14]/90 backdrop-blur z-40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">C</div>
            <span className="font-bold text-white tracking-tight">Codevance</span>
          </div>
          {isPremium && (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">
              <Crown size={9} /> PRO
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <EnergyBar />
          <div className="flex items-center gap-1.5 text-sm text-yellow-400 font-medium">
            <Zap size={13} /> {earnedXP}
          </div>
          {!isPremium && (
            <button onClick={() => router.push("/pricing")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-lg transition-opacity hover:opacity-90">
              <Crown size={11} /> Upgrade
            </button>
          )}
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
            <LogOut size={14} className="text-slate-500" />
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 border-r border-white/5 flex-shrink-0 py-4 overflow-y-auto hidden md:block">
          <p className="text-xs text-slate-600 font-medium uppercase tracking-wider px-4 mb-3">Tracks</p>
          {TRACKS.map(t => {
            const lessons = CURRICULUM.filter(l => l.trackId === t.id);
            const done = lessons.filter(l => progress[l.id]?.completed).length;
            const isActive = activeTrack === t.id;
            return (
              <button key={t.id} onClick={() => setActiveTrack(t.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors ${isActive ? "bg-indigo-500/10 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/3"}`}>
                <span className="text-base">{t.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{t.name}</div>
                  <div className="text-[10px] text-slate-600">{done}/{lessons.length} done</div>
                </div>
                {isActive && <ChevronRight size={12} className="text-indigo-400 flex-shrink-0" />}
              </button>
            );
          })}

          <div className="mx-3 mt-6">
            <a href="/pricing" className="block p-3 bg-gradient-to-b from-purple-500/10 to-indigo-500/5 border border-purple-500/20 rounded-xl">
              <div className="flex items-center gap-1.5 text-purple-400 text-xs font-semibold mb-1">
                <Crown size={11} /> {isPremium ? "Pro Active" : "Upgrade to Pro"}
              </div>
              {!isPremium && <p className="text-[10px] text-slate-500">Unlock all modules, 10 energy, free certs</p>}
              {isPremium && <p className="text-[10px] text-slate-500">All modules + certificates unlocked</p>}
            </a>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { label: "XP Earned", value: earnedXP.toLocaleString(), sub: `of ${getTotalXP().toLocaleString()}`, icon: <Zap size={13} />, color: "text-yellow-400" },
              { label: "Completed", value: `${completedCount}`, sub: `of ${totalLessons} lessons`, icon: <CheckCircle size={13} />, color: "text-emerald-400" },
              { label: "Streak", value: `${profile?.streak || 0}d`, sub: "days in a row", icon: <Flame size={13} />, color: "text-orange-400" },
              { label: "Progress", value: `${pct}%`, sub: "overall", icon: <Trophy size={13} />, color: "text-indigo-400" },
            ].map(s => (
              <div key={s.label} className="bg-white/2 border border-white/5 rounded-xl p-4">
                <div className={`flex items-center gap-1.5 text-xs mb-2 ${s.color}`}>{s.icon} {s.label}</div>
                <div className="text-2xl font-bold text-white leading-none mb-1">{s.value}</div>
                <div className="text-[11px] text-slate-600">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Overall Progress</span><span>{pct}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Mobile track tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 md:hidden">
            {TRACKS.map(t => (
              <button key={t.id} onClick={() => setActiveTrack(t.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTrack === t.id ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-white/3 text-slate-400 border border-white/5"}`}>
                {t.icon} {t.name}
              </button>
            ))}
          </div>

          {/* Lessons */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{trackMeta?.icon}</span>
              <h2 className="font-bold text-white">{trackMeta?.name}</h2>
              <span className="text-xs text-slate-600">
                {activeTrackLessons.filter(l => progress[l.id]?.completed).length}/{activeTrackLessons.length}
              </span>
            </div>

            <div className="space-y-2">
              {activeTrackLessons.map((lesson, idx) => {
                const p = progress[lesson.id];
                const isDone = p?.completed;
                const prevLesson = idx > 0 ? activeTrackLessons[idx - 1] : null;
                const prevProgress = prevLesson ? progress[prevLesson.id] : null;
                const completedPrev = !prevLesson || prevProgress?.completed === true;
                const prevCompletedAt = prevProgress?.completed_at || null;

                const access = canAccessLesson(idx, completedPrev, prevCompletedAt);
                const isLocked = !access.allowed;
                const isTimeLocked = access.reason === "Time locked";
                const isPremiumLocked = access.reason === "Upgrade to Pro to unlock all modules";

                // Countdown
                let countdown = "";
                if (isTimeLocked && access.unlocksAt) {
                  const ms = access.unlocksAt.getTime() - now;
                  countdown = formatTimeRemaining(ms);
                }

                return (
                  <button key={lesson.id}
                    onClick={() => {
                      if (isLocked) {
                        if (isPremiumLocked) router.push("/pricing");
                        return;
                      }
                      if (energy < 1) { alert("No energy! Wait for refill or upgrade to Pro for 10 energy."); return; }
                      router.push(`/learn/${lesson.id}`);
                    }}
                    className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      isDone ? "bg-emerald-500/5 border-emerald-500/15 hover:border-emerald-500/30"
                      : isPremiumLocked ? "bg-purple-500/3 border-purple-500/15 hover:border-purple-500/30 cursor-pointer"
                      : isTimeLocked ? "bg-yellow-500/3 border-yellow-500/10 cursor-not-allowed"
                      : isLocked ? "bg-white/1 border-white/3 opacity-40 cursor-not-allowed"
                      : "bg-white/2 border-white/8 hover:border-indigo-500/30 hover:bg-indigo-500/5 cursor-pointer"
                    }`}>

                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDone ? "bg-emerald-500/15"
                      : isPremiumLocked ? "bg-purple-500/15"
                      : isTimeLocked ? "bg-yellow-500/15"
                      : isLocked ? "bg-white/5"
                      : "bg-indigo-500/10"
                    }`}>
                      {isDone ? <CheckCircle size={16} className="text-emerald-400" />
                        : isPremiumLocked ? <Crown size={15} className="text-purple-400" />
                        : isTimeLocked ? <Clock size={15} className="text-yellow-400" />
                        : isLocked ? <Lock size={14} className="text-slate-600" />
                        : <BookOpen size={15} className="text-indigo-400" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="font-medium text-sm text-white">{lesson.title}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                          lesson.difficulty === "Beginner" ? "bg-emerald-500/10 text-emerald-400"
                          : lesson.difficulty === "Intermediate" ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                        }`}>{lesson.difficulty}</span>
                      </div>
                      <div className="text-xs text-slate-600">
                        {lesson.duration}
                        {isDone && <span className="text-emerald-500 ml-2">· Score {p.score}/3 · +{p.xp_earned} XP</span>}
                        {isTimeLocked && <span className="text-yellow-500 ml-2">· Unlocks in {countdown}</span>}
                        {isPremiumLocked && <span className="text-purple-400 ml-2">· Pro only — click to upgrade</span>}
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs text-slate-600">{lesson.xp} XP</div>
                      {!isLocked && !isDone && <ChevronRight size={14} className="text-slate-600 mt-1 ml-auto" />}
                      {isPremiumLocked && <Star size={13} className="text-purple-400 mt-1 ml-auto" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
