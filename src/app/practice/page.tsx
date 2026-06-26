"use client";

import { useState } from "react";
import {
  PenTool, BookOpen, Atom, Calculator, Globe2, Languages,
  ChevronRight, RefreshCw, CheckCircle, XCircle, Trophy,
  Sparkles, Star, Loader2, Flame, Target, Zap, Bot, Layers,
  ThumbsUp, ThumbsDown, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useApp } from "@/context/app-context";

interface PracticeQuestion {
  question: string;
  type: string;
  options: string[];
  answer: string;
  explanation: string;
  points: number;
}

interface Flashcard {
  front: string;
  back: string;
}

interface SRSCard {
  id: string;
  front: string;
  back: string;
  nextReviewDate: number;
  interval: number;
  easeFactor: number;
  repetitions: number;
}

const subjects = [
  { name: "Math", icon: Calculator, color: "from-[#6C63FF] to-[#4F46E5]", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
  { name: "Science", icon: Atom, color: "from-[#00C2A8] to-[#059669]", bg: "bg-teal-50 dark:bg-teal-900/20" },
  { name: "Filipino", icon: Languages, color: "from-[#F59E0B] to-[#D97706]", bg: "bg-amber-50 dark:bg-amber-900/20" },
  { name: "English", icon: BookOpen, color: "from-[#EC4899] to-[#DB2777]", bg: "bg-pink-50" },
  { name: "Araling Panlipunan", icon: Globe2, color: "from-[#3B82F6] to-[#2563EB]", bg: "bg-blue-50" },
];

const topicSuggestions: Record<string, string[]> = {
  Math: ["Calculus", "Trigonometry", "Statistics", "Algebra", "Probability"],
  Science: ["Photosynthesis", "Newton's Laws", "Periodic Table", "Genetics", "Electricity"],
  Filipino: ["Sanaysay", "Panitikan", "Balarila", "Retorika", "Pananaliksik"],
  English: ["Essay Writing", "Grammar", "Literature", "Vocabulary", "Reading Comprehension"],
  "Araling Panlipunan": ["Ekonomiks", "Pamahalaan", "Kasaysayan ng Pilipinas", "Globalisasyon", "Kultura"],
};

export default function PracticePage() {
  const { profile, addPoints, trackActivity, getStats } = useApp();
  const language = profile?.language || "Filipino";
  const educationLevel = profile?.educationLevel || "SHS";

  const t = (fil: string, eng: string) => (language === "Filipino" ? fil : eng);

  // States
  const [view, setView] = useState<
    "dashboard" | "quiz_select" | "quiz_topic" | "quiz_active" | "quiz_results" | 
    "fc_topic" | "fc_active" | "fc_results" | "srs_dashboard" | "srs_active" | "srs_results"
  >("dashboard");

  // Quiz States
  const [selectedSubject, setSelectedSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  
  // Flashcard States
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [fcIndex, setFcIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [fcScore, setFcScore] = useState(0);
  const [fcCount, setFcCount] = useState<number>(10);
  const [selectedNoteId, setSelectedNoteId] = useState<string>("none");

  // SRS States
  const [srsCards, setSrsCards] = useState<SRSCard[]>([]);
  const [srsQueue, setSrsQueue] = useState<SRSCard[]>([]);
  const [srsIndex, setSrsIndex] = useState(0);

  // Shared States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stats = getStats();

  // ─── Quiz Methods ───
  const generatePractice = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: topic.trim(),
          description: description.trim(),
          educationLevel,
          difficulty: "Medium",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQuestions(data.questions);
      setView("quiz_active");
      setCurrentQ(0);
      setScore(0);
      setAnswers([]);
      setSelected(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error generating practice.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option: string) => {
    if (selected) return;
    setSelected(option);
    const correct = option === questions[currentQ].answer;
    if (correct) {
      setScore((s) => s + 1);
      addPoints(10);
    }
    setAnswers((a) => [...a, correct]);
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((i) => i + 1);
      setSelected(null);
    } else {
      trackActivity("practiceCompleted");
      setView("quiz_results");
    }
  };

  // ─── Flashcard Methods ───
  const generateFlashcards = async () => {
    // Determine if we are using a note
    let sourceText = "";
    let finalTopic = topic;

    if (selectedNoteId !== "none") {
      const stored = localStorage.getItem("gabayal_notes");
      if (stored) {
        const notes = JSON.parse(stored);
        const note = notes.find((n: any) => n.id === selectedNoteId);
        if (note) {
          sourceText = note.content;
          if (!finalTopic) finalTopic = note.title;
        }
      }
    }

    if (!finalTopic.trim() && !sourceText) {
      setError("Please provide a topic or select a note.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: finalTopic.trim(),
          description: description.trim(),
          educationLevel,
          sourceText,
          count: fcCount,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFlashcards(data.flashcards);
      setView("fc_active");
      setFcIndex(0);
      setFcScore(0);
      setIsFlipped(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error generating flashcards.");
    } finally {
      setLoading(false);
    }
  };

  const handleFlashcardResponse = (gotIt: boolean) => {
    if (gotIt) {
      setFcScore((s) => s + 1);
      addPoints(5);
    }
    if (fcIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setFcIndex((i) => i + 1), 150); // slight delay for flip reset
    } else {
      trackActivity("practiceCompleted");
      addPoints(20, "Completed Flashcard Deck");
      setView("fc_results");
    }
  };

  // ─── SRS Methods ───
  const initSRS = () => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("gabayal_srs_cards") : null;
    if (stored) {
      setSrsCards(JSON.parse(stored));
    }
  };

  const openSRSDashboard = () => {
    initSRS();
    setView("srs_dashboard");
  };

  const saveDeckToSRS = () => {
    const newCards: SRSCard[] = flashcards.map((fc) => ({
      id: Math.random().toString(36).substr(2, 9),
      front: fc.front,
      back: fc.back,
      nextReviewDate: Date.now(),
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
    }));
    const stored = typeof window !== "undefined" ? localStorage.getItem("gabayal_srs_cards") : null;
    const existing = stored ? JSON.parse(stored) : [];
    const updated = [...existing, ...newCards];
    localStorage.setItem("gabayal_srs_cards", JSON.stringify(updated));
    setSrsCards(updated);
    addPoints(15, "Added Deck to Smart Schedule");
    setView("dashboard");
  };

  const handleSRSResponse = (gotIt: boolean) => {
    const card = srsQueue[srsIndex];
    let newInterval = card.interval;
    let newRepetitions = card.repetitions;
    let newEaseFactor = card.easeFactor;
    const quality = gotIt ? 4 : 1;

    if (quality >= 3) {
      if (newRepetitions === 0) newInterval = 1;
      else if (newRepetitions === 1) newInterval = 6;
      else newInterval = Math.round(newInterval * newEaseFactor);
      newRepetitions++;
    } else {
      newRepetitions = 0;
      newInterval = 1;
    }

    newEaseFactor = newEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEaseFactor < 1.3) newEaseFactor = 1.3;

    const nextReviewDate = Date.now() + newInterval * 24 * 60 * 60 * 1000;
    
    const updatedCard = { ...card, interval: newInterval, easeFactor: newEaseFactor, repetitions: newRepetitions, nextReviewDate };
    
    const updatedCards = srsCards.map((c) => c.id === card.id ? updatedCard : c);
    localStorage.setItem("gabayal_srs_cards", JSON.stringify(updatedCards));
    setSrsCards(updatedCards);

    if (gotIt) {
      setFcScore((s) => s + 1);
      addPoints(5);
    }

    if (srsIndex < srsQueue.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setSrsIndex((i) => i + 1), 150);
    } else {
      trackActivity("practiceCompleted");
      addPoints(20, "Completed Daily Review");
      setView("srs_results");
    }
  };

  // ─── Shared Views ───
  if (view === "dashboard") {
    return (
      <div className="max-w-xl mx-auto space-y-6 pb-6">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-200">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Study Hub 🎯</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">Everything you need to master your subjects.</p>
        </div>

        {/* Analytics & Goals Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-[#15171C] border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-500 flex items-center justify-center rounded-2xl">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide">Streak</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">{stats.streak} {t("araw", "days")}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#15171C] border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-[#6C63FF] flex items-center justify-center rounded-2xl">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide">Daily Goal</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">{Math.min(stats.practiceCompleted, 3)}/3</p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3 px-1 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" /> Study Tools
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setTopic(""); setDescription(""); setView("quiz_select"); }}
              className="bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] p-5 rounded-3xl text-left text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98] group relative overflow-hidden flex flex-col justify-between aspect-square"
            >
              <PenTool className="w-8 h-8 opacity-90 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-bold text-lg leading-tight">Quizzes</h3>
                <p className="text-[11px] text-indigo-100 mt-1 opacity-90">Active recall with AI</p>
              </div>
            </button>

            <button
              onClick={() => { setTopic(""); setDescription(""); setSelectedSubject("General"); setView("fc_topic"); }}
              className="bg-white dark:bg-[#15171C] border border-gray-100 dark:border-gray-800 p-5 rounded-3xl text-left text-gray-900 dark:text-white shadow-sm hover:border-teal-200 hover:shadow-md transition-all active:scale-[0.98] group flex flex-col justify-between aspect-square"
            >
              <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/20 text-teal-600 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Flashcards</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">Generate AI flip-cards</p>
              </div>
            </button>

            <button
              onClick={openSRSDashboard}
              className="bg-white dark:bg-[#15171C] border border-gray-100 dark:border-gray-800 p-5 rounded-3xl text-left text-gray-900 dark:text-white shadow-sm hover:border-rose-200 hover:shadow-md transition-all active:scale-[0.98] group flex flex-col justify-between aspect-square"
            >
              <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Spaced Rep.</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">Smart scheduling</p>
              </div>
            </button>

            <Link
              href="/tutor"
              className="bg-white dark:bg-[#15171C] border border-gray-100 dark:border-gray-800 p-5 rounded-3xl text-left text-gray-900 dark:text-white shadow-sm hover:border-amber-200 hover:shadow-md transition-all active:scale-[0.98] group flex flex-col justify-between aspect-square"
            >
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">AI Tutor</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">Ask Gabay anything</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Quiz: Subject Select ───
  if (view === "quiz_select") {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <button onClick={() => setView("dashboard")} className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-200 mb-6 flex items-center gap-1">
          ← Back to Dashboard
        </button>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("Practice Quizzes", "Practice Quizzes")} ✏️</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">{t("Pumili ng paksa", "Pick a subject")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {subjects.map((s) => (
            <button
              key={s.name}
              onClick={() => { setSelectedSubject(s.name); setView("quiz_topic"); }}
              className="flex items-center gap-4 bg-white dark:bg-[#15171C] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-200 dark:border-gray-700 transition-all active:scale-[0.98] group text-left"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{s.name}</h3>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 dark:text-gray-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Quiz: Topic Select ───
  if (view === "quiz_topic") {
    const suggestions = topicSuggestions[selectedSubject] || [];
    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <button onClick={() => setView("quiz_select")} className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-1">
          ← {t("Bumalik", "Back")}
        </button>
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedSubject} Quiz</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">{t("Anong topic ang gusto mong ipractice?", "What topic do you want to practice?")}</p>
        </div>

        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t("Hal. Calculus...", "E.g. Calculus...")}
          className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-base outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] transition-all text-center font-medium mb-3"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("Karagdagang detalye o focus (optional)...", "Additional details or focus (optional)...")}
          className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] transition-all text-center font-medium mb-4 resize-none h-24"
        />

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setTopic(s)}
              className={`text-xs px-3 py-2 rounded-xl border transition-all ${
                topic === s ? "bg-[#6C63FF] text-white border-[#6C63FF]" : "bg-white dark:bg-[#15171C] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#6C63FF]/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}

        <button
          onClick={generatePractice}
          disabled={!topic.trim() || loading}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
            topic.trim() && !loading ? "bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] text-white shadow-lg shadow-indigo-200 hover:scale-[1.01]" : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> {t("Ginagawa...", "Generating...")}</> : <><Sparkles className="w-5 h-5" /> {t("Gumawa ng Quiz", "Generate Quiz")}</>}
        </button>
      </div>
    );
  }

  // ─── Quiz: Active ───
  if (view === "quiz_active" && questions.length > 0) {
    const q = questions[currentQ];
    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{currentQ + 1}/{questions.length}</span>
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-[#6C63FF] flex items-center gap-1">
            <Star className="w-3.5 h-3.5" />{score * 10}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-[#6C63FF] bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">{selectedSubject}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">·</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{topic}</span>
        </div>

        <div className="bg-gradient-to-br from-[#6C63FF]/5 to-[#4F46E5]/5 rounded-2xl p-5 border border-[#6C63FF]/10 mb-5">
          <p className="font-bold text-gray-900 dark:text-white text-base leading-relaxed">{q.question}</p>
        </div>

        <div className="space-y-3 mb-5">
          {q.options.map((opt, i) => {
            const isSelected = selected === opt;
            const isCorrect = opt === q.answer;
            let style = "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#15171C] text-gray-700 dark:text-gray-200 hover:border-[#6C63FF]/50 hover:bg-indigo-50 dark:bg-indigo-900/20/50 active:scale-[0.98]";
            if (selected) {
              if (isCorrect) style = "border-green-400 bg-green-50 text-green-800";
              else if (isSelected) style = "border-red-400 bg-red-50 text-red-800";
              else style = "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1E232B] text-gray-400 dark:text-gray-500";
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-sm font-medium text-left transition-all ${style} ${!selected ? "cursor-pointer" : "cursor-default"}`}
              >
                <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {selected && isCorrect ? <CheckCircle className="w-5 h-5 text-green-500" /> : selected && isSelected ? <XCircle className="w-5 h-5 text-red-500" /> : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="space-y-3 animate-fade-in">
            <div className={`p-4 rounded-2xl text-sm ${selected === q.answer ? "bg-green-50 border border-green-200 text-green-800" : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 text-amber-800"}`}>
              <p className="font-semibold mb-1">
                {selected === q.answer ? "✅ Tama! +10 points 🌟" : `❌ Mali. Ang tamang sagot: ${q.answer}`}
              </p>
              <p>{q.explanation}</p>
            </div>
            <button
              onClick={nextQuestion}
              className="w-full bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md hover:scale-[1.01] transition-all active:scale-[0.99]"
            >
              {currentQ < questions.length - 1 ? t("Susunod na Tanong →", "Next Question →") : t("Tingnan ang Resulta 🏆", "See Results 🏆")}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── Quiz: Results ───
  if (view === "quiz_results") {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-md mx-auto text-center py-6 animate-fade-in">
        <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-lg mx-auto mb-5 ${
          pct >= 80 ? "bg-green-50 border-4 border-green-200" : pct >= 60 ? "bg-amber-50 dark:bg-amber-900/20 border-4 border-amber-200" : "bg-red-50 border-4 border-red-200"
        }`}>
          {pct >= 80 ? "🏆" : pct >= 60 ? "💪" : "📖"}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{score}/{questions.length} Correct!</h2>
        <p className={`text-4xl font-black mt-1 mb-2 ${pct >= 80 ? "text-green-500" : pct >= 60 ? "text-amber-500" : "text-red-500"}`}>{pct}%</p>
        <p className="text-[#6C63FF] font-bold text-lg mb-4 flex items-center justify-center gap-1">
          <Star className="w-5 h-5 text-[#F59E0B]" /> +{score * 10} points!
        </p>
        
        <div className="flex gap-3 justify-center mt-8">
          <button onClick={() => setView("dashboard")} className="flex items-center gap-2 bg-white dark:bg-[#15171C] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-5 py-3 rounded-2xl font-bold text-sm hover:bg-gray-50 dark:bg-[#1E232B] transition-all">
            Dashboard
          </button>
          <button onClick={() => { setTopic(""); setView("quiz_select"); }} className="flex items-center gap-2 bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-md">
            New Quiz
          </button>
        </div>
      </div>
    );
  }

  // ─── Flashcards: Setup ───
  if (view === "fc_topic") {
    // Load notes for dropdown
    const stored = typeof window !== "undefined" ? localStorage.getItem("gabayal_notes") : null;
    const notes = stored ? JSON.parse(stored) : [];

    return (
      <div className="max-w-lg mx-auto animate-fade-in pb-12">
        <button onClick={() => setView("dashboard")} className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-1">
          ← Back to Dashboard
        </button>
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Flashcards</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">Generate a deck of flashcards from a topic or your notes.</p>
        </div>

        <div className="bg-white dark:bg-[#15171C] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-5 mb-6">
          {/* Note Source */}
          {notes.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Create from Note (Optional)</label>
              <select
                value={selectedNoteId}
                onChange={(e) => setSelectedNoteId(e.target.value)}
                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-[#1E232B]"
              >
                <option value="none">-- Don't use a note --</option>
                {notes.map((note: any) => (
                  <option key={note.id} value={note.id}>{note.title} ({note.subject})</option>
                ))}
              </select>
            </div>
          )}

          {/* Topic */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
              Topic {selectedNoteId !== "none" && "(Optional if using note)"}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="E.g. Mitosis, Derivatives..."
              className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all font-medium bg-gray-50 dark:bg-[#1E232B]"
            />
          </div>

          {/* Count */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Number of Cards</label>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  onClick={() => setFcCount(num)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                    fcCount === num ? "bg-teal-50 dark:bg-teal-900/20 border-teal-500 text-teal-700" : "bg-white dark:bg-[#15171C] border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:border-teal-300"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Extra Details */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Extra Instructions (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specific focus or definitions..."
              className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all font-medium resize-none h-20 bg-gray-50 dark:bg-[#1E232B]"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}

        <button
          onClick={generateFlashcards}
          disabled={(!topic.trim() && selectedNoteId === "none") || loading}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
            (topic.trim() || selectedNoteId !== "none") && !loading ? "bg-teal-50 dark:bg-teal-900/200 text-white shadow-lg hover:bg-teal-600 active:scale-[0.99]" : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating Deck...</> : <><Layers className="w-5 h-5" /> Generate {fcCount} Cards</>}
        </button>
      </div>
    );
  }

  // ─── Flashcards: Active ───
  if (view === "fc_active" && flashcards.length > 0) {
    const card = flashcards[fcIndex];
    return (
      <div className="max-w-md mx-auto flex flex-col h-full animate-fade-in pb-12">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setView("dashboard")} className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-300">Quit</button>
          <span className="text-sm font-bold text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-3 py-1 rounded-full">
            {fcIndex + 1} / {flashcards.length}
          </span>
          <span className="text-sm font-bold text-amber-500 flex items-center gap-1">
            <Star className="w-3.5 h-3.5" />{fcScore * 5}
          </span>
        </div>

        {/* 3D Flip Card */}
        <div 
          className="relative w-full aspect-[4/3] perspective-1000 cursor-pointer group"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`w-full h-full relative preserve-3d transition-transform duration-500 ease-out ${isFlipped ? "rotate-y-180" : ""}`}>
            
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-white dark:bg-[#15171C] border-2 border-gray-100 dark:border-gray-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-md shadow-gray-100/50 hover:shadow-lg transition-shadow">
              <span className="absolute top-4 left-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Front</span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {card.front}
              </h3>
              <p className="absolute bottom-4 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1">
                Tap to Flip <RefreshCw className="w-3 h-3" />
              </p>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-teal-50 to-teal-100/50 border-2 border-teal-100 dark:border-teal-800/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg rotate-y-180">
               <span className="absolute top-4 left-4 text-xs font-bold text-teal-500/60 uppercase tracking-wider">Back</span>
              <p className="text-lg md:text-xl font-medium text-gray-900 dark:text-white leading-relaxed">
                {card.back}
              </p>
            </div>
            
          </div>
        </div>

        {/* Action Buttons (only show when flipped) */}
        <div className={`mt-8 flex gap-3 transition-all duration-300 ${isFlipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
          <button
            onClick={() => handleFlashcardResponse(false)}
            className="flex-1 flex flex-col items-center justify-center gap-2 bg-white dark:bg-[#15171C] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-4 rounded-2xl hover:bg-gray-50 dark:bg-[#1E232B] hover:border-gray-300 transition-colors active:scale-95 shadow-sm"
          >
            <ThumbsDown className="w-6 h-6 text-rose-400" />
            <span className="text-xs font-bold">Need Review</span>
          </button>
          <button
            onClick={() => handleFlashcardResponse(true)}
            className="flex-1 flex flex-col items-center justify-center gap-2 bg-white dark:bg-[#15171C] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-4 rounded-2xl hover:bg-teal-50 dark:bg-teal-900/20 hover:border-teal-200 transition-colors active:scale-95 shadow-sm"
          >
            <ThumbsUp className="w-6 h-6 text-teal-500" />
            <span className="text-xs font-bold text-teal-700">Got It!</span>
          </button>
        </div>
      </div>
    );
  }

  // ─── Flashcards: Results ───
  if (view === "fc_results") {
    return (
      <div className="max-w-md mx-auto text-center py-6 animate-fade-in">
        <div className="w-28 h-28 bg-teal-50 dark:bg-teal-900/20 border-4 border-teal-200 rounded-full flex items-center justify-center text-5xl shadow-lg mx-auto mb-5">
          🧠
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Deck Completed!</h2>
        <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm mb-4">You successfully recalled {fcScore} out of {flashcards.length} cards.</p>
        
        <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 font-bold px-4 py-3 rounded-xl inline-flex items-center gap-2 mb-8">
          <Star className="w-5 h-5 text-amber-500" /> +{fcScore * 5 + 20} Total Points!
        </div>
        
        <div className="flex flex-col gap-3 justify-center">
          <button onClick={saveDeckToSRS} className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-400 to-rose-500 text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-md hover:scale-[1.02] transition-all">
            <RefreshCw className="w-4 h-4" /> Save to Smart Schedule
          </button>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setView("dashboard")} className="flex-1 items-center gap-2 bg-white dark:bg-[#15171C] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-gray-50 dark:bg-[#1E232B] transition-all">
              Dashboard
            </button>
            <button onClick={() => { setTopic(""); setView("fc_topic"); }} className="flex-1 items-center gap-2 bg-teal-50 dark:bg-teal-900/200 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md hover:bg-teal-600">
              New Deck
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── SRS: Dashboard ───
  if (view === "srs_dashboard") {
    const dueCards = srsCards.filter(c => c.nextReviewDate <= Date.now());
    
    return (
      <div className="max-w-md mx-auto text-center py-6 animate-fade-in">
        <button onClick={() => setView("dashboard")} className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-200 mb-6 flex items-center gap-1 mx-auto">
          ← Back to Dashboard
        </button>
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 border-4 border-rose-200 text-rose-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg mx-auto mb-6">
          <RefreshCw className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Smart Schedule</h2>
        
        <div className="bg-white dark:bg-[#15171C] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm mb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest mb-1">Due for Review Today</p>
          <p className="text-5xl font-black text-rose-500">{dueCards.length}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Total Cards in Deck: {srsCards.length}</p>
        </div>
        
        <button 
          onClick={() => {
            if (dueCards.length === 0) return;
            setSrsQueue(dueCards);
            setSrsIndex(0);
            setFcScore(0);
            setView("srs_active");
          }}
          disabled={dueCards.length === 0}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
            dueCards.length > 0 ? "bg-gradient-to-r from-rose-400 to-rose-500 text-white shadow-lg shadow-rose-200 hover:scale-[1.02]" : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          {dueCards.length > 0 ? "Start Reviewing" : "All Caught Up! 🎉"}
        </button>
      </div>
    );
  }

  // ─── SRS: Active ───
  if (view === "srs_active" && srsQueue.length > 0) {
    const card = srsQueue[srsIndex];
    return (
      <div className="max-w-md mx-auto flex flex-col h-full animate-fade-in pb-12">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setView("srs_dashboard")} className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-300">Quit</button>
          <span className="text-sm font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-3 py-1 rounded-full border border-rose-100 dark:border-rose-800/50">
            {srsIndex + 1} / {srsQueue.length} Due
          </span>
          <span className="text-sm font-bold text-amber-500 flex items-center gap-1">
            <Star className="w-3.5 h-3.5" />{fcScore * 5}
          </span>
        </div>

        {/* 3D Flip Card */}
        <div 
          className="relative w-full aspect-[4/3] perspective-1000 cursor-pointer group"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`w-full h-full relative preserve-3d transition-transform duration-500 ease-out ${isFlipped ? "rotate-y-180" : ""}`}>
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-white dark:bg-[#15171C] border-2 border-gray-100 dark:border-gray-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-md shadow-gray-100/50 hover:shadow-lg transition-shadow">
              <span className="absolute top-4 left-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Front</span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {card.front}
              </h3>
              <p className="absolute bottom-4 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1">
                Tap to Flip <RefreshCw className="w-3 h-3" />
              </p>
            </div>
            {/* Back */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-rose-50 to-rose-100/50 border-2 border-rose-100 dark:border-rose-800/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg rotate-y-180">
               <span className="absolute top-4 left-4 text-xs font-bold text-rose-400 uppercase tracking-wider">Back</span>
              <p className="text-lg md:text-xl font-medium text-gray-900 dark:text-white leading-relaxed">
                {card.back}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`mt-8 flex gap-3 transition-all duration-300 ${isFlipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
          <button
            onClick={() => handleSRSResponse(false)}
            className="flex-1 flex flex-col items-center justify-center gap-2 bg-white dark:bg-[#15171C] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-4 rounded-2xl hover:bg-rose-50 dark:bg-rose-900/20 hover:border-rose-300 transition-colors active:scale-95 shadow-sm"
          >
            <ThumbsDown className="w-6 h-6 text-rose-400" />
            <span className="text-xs font-bold">Need Review</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">See tomorrow</span>
          </button>
          <button
            onClick={() => handleSRSResponse(true)}
            className="flex-1 flex flex-col items-center justify-center gap-2 bg-white dark:bg-[#15171C] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-4 rounded-2xl hover:bg-teal-50 dark:bg-teal-900/20 hover:border-teal-200 transition-colors active:scale-95 shadow-sm"
          >
            <ThumbsUp className="w-6 h-6 text-teal-500" />
            <span className="text-xs font-bold text-teal-700">Got It!</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">Increase interval</span>
          </button>
        </div>
      </div>
    );
  }

  // ─── SRS: Results ───
  if (view === "srs_results") {
    return (
      <div className="max-w-md mx-auto text-center py-6 animate-fade-in">
        <div className="w-28 h-28 bg-rose-50 dark:bg-rose-900/20 border-4 border-rose-200 rounded-full flex items-center justify-center text-5xl shadow-lg mx-auto mb-5">
          🎉
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Review Complete!</h2>
        <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm mb-4">You successfully completed your daily smart schedule.</p>
        
        <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 font-bold px-4 py-3 rounded-xl inline-flex items-center gap-2 mb-8">
          <Star className="w-5 h-5 text-amber-500" /> +{fcScore * 5 + 20} Total Points!
        </div>
        
        <button onClick={() => setView("dashboard")} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-rose-400 to-rose-500 text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-md hover:scale-[1.02] transition-all">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return null;
}
