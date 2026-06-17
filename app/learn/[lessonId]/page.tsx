"use client";
import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getLessonById, CURRICULUM } from "@/lib/curriculum";
import {
  ArrowLeft, ArrowRight, BookOpen, Code2, HelpCircle,
  Lightbulb, CheckCircle, XCircle, Zap, Loader2, RotateCcw
} from "lucide-react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type Tab = "theory" | "code" | "quiz";
type Question = { question: string; options: string[]; correct_index: number; explanation: string };

export default function LearnPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const router = useRouter();
  const lesson = getLessonById(lessonId);

  const [tab, setTab] = useState<Tab>("theory");
  const [code, setCode] = useState(lesson?.codeStarter || "");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [prevQs, setPrevQs] = useState<string[]>([]);
  const pyodideRef = useRef<any>(null);
  const pyodideLoading = useRef(false);
  const pyodideReady = useRef(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/");
    });
    if (lesson?.language === "python") initPyodide();
  }, []);

  const initPyodide = async () => {
    if (pyodideRef.current || pyodideLoading.current) return;
    pyodideLoading.current = true;
    try {
      const { loadPyodide } = await import((/* webpackIgnore: true */ "https://cdn.jsdelivr.net/npm/pyodide@0.25.0/pyodide.mjs" as any);
      pyodideRef.current = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/npm/pyodide@0.25.0/" });
      pyodideReady.current = true;
    } catch (e) { console.error("Pyodide:", e); }
  };

  const runCode = async () => {
    if (!lesson) return;
    setRunning(true);
    setOutput("Running...");

    if (lesson.language === "sql") {
      await new Promise(r => setTimeout(r, 400));
      setOutput(`-- SQL Simulator --\nQuery received:\n\n${code.split("\n").filter((l: string) => l.trim() && !l.trim().startsWith("--")).join("\n")}\n\n✓ Connect Supabase to run against a real PostgreSQL database.`);
      setRunning(false);
      return;
    }

    if (lesson.language === "java") {
      await new Promise(r => setTimeout(r, 400));
      setOutput(`// Java Simulator --\nCode received. To run Java locally:\n1. Save as Main.java\n2. Run: javac Main.java && java Main\n\nOr use: https://replit.com — paste your code there.`);
      setRunning(false);
      return;
    }

    if (!pyodideRef.current) {
      setOutput("Python runtime still loading... wait a moment and try again.");
      setRunning(false);
      await initPyodide();
      return;
    }

    try {
      const logs: string[] = [];
      pyodideRef.current.globals.set("print", (...args: any[]) => {
        logs.push(args.map(String).join(" "));
      });
      await pyodideRef.current.runPythonAsync(code);
      setOutput(logs.join("\n") || "(no output — did you forget print()?  )");
    } catch (e: any) {
      setOutput(`❌ Error: ${e.message}`);
    }
    setRunning(false);
  };

  const loadQuiz = async () => {
    if (questions.length > 0) return;
    setLoadingQ(true);
    try {
      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: lesson?.quizTopic, count: 3, previousQuestions: prevQs }),
      });
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
        setPrevQs(p => [...p, ...data.questions.map((q: Question) => q.question)]);
      }
    } catch (e) { console.error(e); }
    setLoadingQ(false);
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    if (t === "quiz") loadQuiz();
  };

  const selectAnswer = async (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === questions[currentQ].correct_index) setScore(s => s + 1);
    const q = questions[currentQ];
    await fetch("/api/submit-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, question: q.question, options: q.options, correctIndex: q.correct_index, userAnswer: i, explanation: q.explanation }),
    });
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setQuizDone(true);
    const finalScore = score + (selected === questions[currentQ]?.correct_index && !quizDone ? 1 : 0);
    const xpEarned = Math.round((lesson?.xp || 60) * (finalScore / Math.max(questions.length, 1)));
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, score: finalScore, xpEarned, completed: true }),
    });
  };

  const retakeQuiz = () => {
    setQuestions([]);
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setQuizDone(false);
    setTimeout(loadQuiz, 100);
  };

  // Find next lesson
  const lessonIndex = CURRICULUM.findIndex(l => l.id === lessonId);
  const nextLesson = CURRICULUM[lessonIndex + 1];

  if (!lesson) return <div className="min-h-screen bg-[#0A0A14] flex items-center justify-center text-slate-500">Lesson not found.</div>;

  const q = questions[currentQ];
  const finalScore = score;

  return (
    <div className="min-h-screen bg-[#0A0A14] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 px-5 py-3 flex items-center gap-3 flex-shrink-0">
        <button onClick={() => router.push("/dashboard")} className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors text-sm">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-slate-600">{lesson.track}</div>
          <div className="text-sm font-semibold text-white truncate">{lesson.title}</div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
            lesson.difficulty === "Beginner" ? "bg-emerald-500/10 text-emerald-400"
            : lesson.difficulty === "Intermediate" ? "bg-yellow-500/10 text-yellow-400"
            : "bg-red-500/10 text-red-400"
          }`}>{lesson.difficulty}</span>
          <span className="text-xs text-slate-600 flex items-center gap-1"><Zap size={11} className="text-yellow-400" />{lesson.xp}</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/5 px-5 flex flex-shrink-0">
        {(["theory", "code", "quiz"] as Tab[]).map((t) => (
          <button key={t} onClick={() => switchTab(t)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
              tab === t ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-600 hover:text-slate-400"
            }`}>
            {t === "theory" && <BookOpen size={13} />}
            {t === "code" && <Code2 size={13} />}
            {t === "quiz" && <HelpCircle size={13} />}
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">

        {/* THEORY */}
        {tab === "theory" && (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-8 fade-in">
              <h2 className="text-2xl font-bold text-white mb-5">{lesson.theory.heading}</h2>

              <div className="flex gap-3 p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl mb-6">
                <Lightbulb size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-1">Analogy</div>
                  <p className="text-sm text-slate-300 leading-relaxed">{lesson.theory.analogy}</p>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed mb-6 text-sm">{lesson.theory.body}</p>

              <div className="bg-white/2 border border-white/5 rounded-xl p-5 mb-6">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Key Concepts</div>
                <div className="space-y-2">
                  {lesson.theory.keyPoints.map((kp, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-indigo-400 mt-0.5 flex-shrink-0">→</span>
                      <code className="text-indigo-300 font-mono text-xs leading-relaxed">{kp}</code>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => switchTab("code")}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl transition-colors">
                Try it in Code <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* CODE */}
        {tab === "code" && (
          <div className="flex-1 overflow-hidden flex flex-col px-5 py-4 gap-3 fade-in">
            <div className="flex items-start gap-2 p-3 bg-indigo-500/5 border border-indigo-500/15 rounded-lg flex-shrink-0">
              <span className="text-indigo-400 text-xs font-semibold mt-0.5 flex-shrink-0">Task:</span>
              <span className="text-indigo-200 text-xs leading-relaxed">{lesson.codeTask}</span>
            </div>

            <div className="flex-1 min-h-0 rounded-xl overflow-hidden border border-white/8">
              <Editor
                height="100%"
                language={lesson.language === "java" ? "java" : lesson.language === "sql" ? "sql" : "python"}
                value={code}
                onChange={(v) => setCode(v || "")}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  padding: { top: 14 },
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontLigatures: true,
                  wordWrap: "on",
                }}
              />
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={runCode} disabled={running}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
                {running ? <Loader2 size={13} className="animate-spin" /> : "▶"} {running ? "Running..." : "Run"}
              </button>
              <button onClick={() => { setCode(lesson.codeStarter); setOutput(""); }}
                className="flex items-center gap-1.5 px-3 py-2 border border-white/8 hover:border-white/15 text-slate-500 text-xs rounded-lg transition-colors">
                <RotateCcw size={11} /> Reset
              </button>
              {lesson.language === "python" && !pyodideReady.current && (
                <span className="text-[11px] text-slate-600 pulse-slow">Loading Python runtime...</span>
              )}
              {lesson.language === "sql" && <span className="text-[11px] text-slate-600">SQL simulator</span>}
              {lesson.language === "java" && <span className="text-[11px] text-slate-600">Java simulator</span>}
            </div>

            {/* Terminal */}
            <div className="bg-[#080810] border border-white/5 rounded-xl p-4 font-mono text-xs min-h-[90px] max-h-[160px] overflow-auto flex-shrink-0">
              <div className="text-slate-700 mb-2">$ output</div>
              {output ? (
                <pre className={`whitespace-pre-wrap leading-relaxed ${output.startsWith("❌") ? "text-red-400" : "text-emerald-400"}`}>{output}</pre>
              ) : (
                <span className="text-slate-700">Click Run to execute your code...</span>
              )}
            </div>

            <button onClick={() => switchTab("quiz")}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl transition-colors self-start flex-shrink-0">
              Take Quiz <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* QUIZ */}
        {tab === "quiz" && (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-6 py-8 fade-in">
              {loadingQ ? (
                <div className="flex flex-col items-center gap-3 py-16">
                  <Loader2 size={22} className="animate-spin text-indigo-400" />
                  <p className="text-slate-500 text-sm">Claude is generating unique questions...</p>
                </div>
              ) : quizDone ? (
                /* Quiz complete screen */
                <div className="text-center">
                  <div className="text-5xl mb-4">{finalScore === 3 ? "🎯" : finalScore >= 2 ? "✅" : "📚"}</div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {finalScore === 3 ? "Perfect!" : finalScore >= 2 ? "Lesson complete!" : "Keep practicing!"}
                  </h2>
                  <p className="text-slate-500 mb-8">{finalScore}/{questions.length} correct</p>
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                      { l: "Score", v: `${finalScore}/${questions.length}` },
                      { l: "Accuracy", v: `${Math.round((finalScore / questions.length) * 100)}%` },
                      { l: "XP Earned", v: `+${Math.round(lesson.xp * (finalScore / questions.length))}` },
                    ].map(s => (
                      <div key={s.l} className="bg-white/3 border border-white/5 rounded-xl p-4 text-center">
                        <div className="text-xl font-bold text-white">{s.v}</div>
                        <div className="text-xs text-slate-600 mt-1">{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <button onClick={retakeQuiz} className="px-5 py-2.5 border border-white/10 hover:border-white/20 text-slate-400 text-sm rounded-xl transition-colors">
                      Retake (new questions)
                    </button>
                    {nextLesson && (
                      <button onClick={() => router.push(`/learn/${nextLesson.id}`)}
                        className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2">
                        Next: {nextLesson.title} <ArrowRight size={13} />
                      </button>
                    )}
                    <button onClick={() => router.push("/dashboard")}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/8 text-slate-300 text-sm rounded-xl transition-colors">
                      Dashboard
                    </button>
                  </div>
                </div>
              ) : q ? (
                /* Active question */
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs text-slate-600">Question {currentQ + 1} of {questions.length}</span>
                    <div className="flex gap-1.5">
                      {questions.map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
                          i < currentQ ? "bg-emerald-500" : i === currentQ ? "bg-indigo-500" : "bg-white/10"
                        }`} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-600">{score}/{currentQ} correct</span>
                  </div>

                  <h3 className="text-base font-medium text-white mb-5 leading-relaxed">{q.question}</h3>

                  <div className="space-y-2.5 mb-5">
                    {q.options.map((opt, i) => {
                      const isSelected = selected === i;
                      const isCorrect = i === q.correct_index;
                      return (
                        <button key={i} onClick={() => selectAnswer(i)} disabled={answered}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                            answered && isCorrect
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                              : answered && isSelected && !isCorrect
                              ? "bg-red-500/10 border-red-500/30 text-red-300"
                              : isSelected
                              ? "bg-indigo-500/10 border-indigo-500/30 text-white"
                              : "bg-white/2 border-white/8 text-slate-300 hover:border-white/15 hover:bg-white/4 disabled:cursor-default"
                          }`}>
                          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[11px] font-medium flex-shrink-0">
                            {"ABCD"[i]}
                          </span>
                          <span className="text-sm flex-1">{opt}</span>
                          {answered && isCorrect && <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />}
                          {answered && isSelected && !isCorrect && <XCircle size={14} className="text-red-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {answered && (
                    <>
                      <div className={`p-3.5 rounded-xl border text-sm mb-4 ${
                        selected === q.correct_index
                          ? "bg-emerald-500/5 border-emerald-500/15 text-emerald-300"
                          : "bg-red-500/5 border-red-500/15 text-red-300"
                      }`}>
                        <span className="font-medium">{selected === q.correct_index ? "✓ Correct! " : "✗ Not quite. "}</span>
                        {q.explanation}
                      </div>
                      <button onClick={nextQuestion}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl transition-colors">
                        {currentQ < questions.length - 1 ? "Next Question" : "Finish Quiz"} <ArrowRight size={13} />
                      </button>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
