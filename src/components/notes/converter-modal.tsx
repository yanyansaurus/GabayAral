"use client";

import { useState, useEffect } from "react";
import { X, Zap, RefreshCw, ChevronLeft, ChevronRight, RotateCcw, CheckCircle, XCircle, Trophy } from "lucide-react";
import type { Note } from "@/app/notes/page";

interface Flashcard {
  front: string;
  back: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface ConvertedData {
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

interface Props {
  note: Note;
  educationLevel: string;
  onClose: () => void;
}

// ─────────────────── Flashcard View ───────────────────
function FlashcardView({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = cards[index];

  const next = () => { setFlipped(false); setTimeout(() => setIndex((i) => Math.min(i + 1, cards.length - 1)), 150); };
  const prev = () => { setFlipped(false); setTimeout(() => setIndex((i) => Math.max(i - 1, 0)), 150); };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress */}
      <div className="flex items-center gap-3 w-full">
        <span className="text-sm text-gray-500">{index + 1} / {cards.length}</span>
        <div className="flex-1 bg-gray-100 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] h-2 rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / cards.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-400">I-click para i-flip</span>
      </div>

      {/* Card */}
      <div
        className="w-full cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "220px",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] rounded-3xl flex flex-col items-center justify-center p-8 text-white"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200 mb-4">Konsepto</span>
            <p className="text-xl font-bold text-center leading-relaxed">{current?.front}</p>
            <RotateCcw className="w-5 h-5 text-indigo-200 mt-6 opacity-70" />
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-white border-2 border-[#6C63FF]/20 rounded-3xl flex flex-col items-center justify-center p-8"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6C63FF] mb-4">Paliwanag</span>
            <p className="text-base text-gray-800 text-center leading-relaxed">{current?.back}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={prev}
          disabled={index === 0}
          className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => { setFlipped(false); setIndex(i); }}
              className={`w-2 h-2 rounded-full transition-all ${i === index ? "bg-[#6C63FF] w-5" : "bg-gray-200 hover:bg-gray-300"}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          disabled={index === cards.length - 1}
          className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────── Quiz View ───────────────────
function QuizView({ questions }: { questions: QuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const current = questions[index];

  const handleAnswer = (option: string) => {
    if (selected) return;
    setSelected(option);
    const correct = option === current.answer;
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, correct]);
  };

  const next = () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setAnswers([]);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center gap-5 py-6">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg ${
          pct >= 80 ? "bg-green-50 border-4 border-green-200" : pct >= 60 ? "bg-amber-50 border-4 border-amber-200" : "bg-red-50 border-4 border-red-200"
        }`}>
          {pct >= 80 ? "🏆" : pct >= 60 ? "💪" : "📖"}
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">
            {score}/{questions.length} Tama!
          </h3>
          <p className={`text-3xl font-black mt-1 ${pct >= 80 ? "text-green-500" : pct >= 60 ? "text-amber-500" : "text-red-500"}`}>
            {pct}%
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {pct >= 80 ? "Kahanga-hanga! Naintindihan mo nang maayos! 🎉" : pct >= 60 ? "Magaling! Subukan ulit para mas mapabuti pa! 💪" : "Okay lang! Basahin ulit ang iyong mga tala at subukan muli. 📚"}
          </p>
        </div>
        <div className="flex gap-1.5">
          {answers.map((a, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${a ? "bg-green-400" : "bg-red-400"}`} />
          ))}
        </div>
        <button
          onClick={restart}
          className="flex items-center gap-2 bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md"
        >
          <RefreshCw className="w-4 h-4" /> Subukan Muli
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Tanong {index + 1} / {questions.length}</span>
        <div className="flex-1 bg-gray-100 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] h-2 rounded-full transition-all"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-bold text-[#6C63FF]">{score} pts</span>
      </div>

      {/* Question */}
      <div className="bg-gradient-to-br from-[#6C63FF]/5 to-[#4F46E5]/5 rounded-2xl p-5 border border-[#6C63FF]/10">
        <p className="font-bold text-gray-900 text-base leading-relaxed">{current.question}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {current.options.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect = opt === current.answer;
          let style = "border-gray-200 bg-white text-gray-700 hover:border-[#6C63FF]/50 hover:bg-indigo-50/50";
          if (selected) {
            if (isCorrect) style = "border-green-400 bg-green-50 text-green-800";
            else if (isSelected) style = "border-red-400 bg-red-50 text-red-800";
            else style = "border-gray-100 bg-gray-50 text-gray-400";
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-sm font-medium text-left transition-all ${style} ${!selected ? "cursor-pointer" : "cursor-default"}`}
            >
              <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                {selected && isCorrect ? <CheckCircle className="w-5 h-5 text-green-500" /> : selected && isSelected ? <XCircle className="w-5 h-5 text-red-500" /> : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation + Next */}
      {selected && (
        <div className="space-y-3">
          <div className={`p-4 rounded-2xl text-sm ${selected === current.answer ? "bg-green-50 border border-green-200 text-green-800" : "bg-amber-50 border border-amber-200 text-amber-800"}`}>
            <p className="font-semibold mb-1">{selected === current.answer ? "✅ Tama!" : `❌ Mali. Ang tamang sagot: ${current.answer}`}</p>
            <p>{current.explanation}</p>
          </div>
          <button
            onClick={next}
            className="w-full bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] text-white py-3 rounded-2xl font-bold text-sm shadow-md hover:scale-[1.01] transition-all"
          >
            {index < questions.length - 1 ? "Susunod na Tanong →" : "Tingnan ang Resulta 🏆"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────── Main Converter Modal ───────────────────
export default function ConverterModal({ note, educationLevel, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ConvertedData | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"flashcards" | "quiz">("flashcards");

  const convert = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/convert-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noteContent: note.content,
          noteTitle: note.title,
          educationLevel,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "May error. Subukan muli.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    convert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E293B]/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: "92vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">I-convert ang Tala</h2>
              <p className="text-xs text-gray-500 truncate max-w-[200px]">{note.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] flex items-center justify-center animate-pulse">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900 text-lg">Ino-convert ng Gabay AI...</p>
                <p className="text-sm text-gray-500 mt-1">Ginagawa ang iyong mga flashcard at quiz. Sandali lang! ✨</p>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2.5 h-2.5 bg-[#6C63FF] rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="text-4xl">😔</div>
              <p className="text-gray-700 font-medium text-center">{error}</p>
              <button onClick={convert} className="flex items-center gap-2 bg-[#6C63FF] text-white px-5 py-2.5 rounded-xl text-sm font-bold">
                <RefreshCw className="w-4 h-4" /> Subukan Muli
              </button>
            </div>
          )}

          {/* Results */}
          {data && !loading && (
            <div className="space-y-5">
              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setTab("flashcards")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === "flashcards" ? "bg-white shadow-sm text-[#6C63FF]" : "text-gray-500 hover:text-gray-700"}`}
                >
                  🃏 Flashcards ({data.flashcards.length})
                </button>
                <button
                  onClick={() => setTab("quiz")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === "quiz" ? "bg-white shadow-sm text-[#6C63FF]" : "text-gray-500 hover:text-gray-700"}`}
                >
                  ❓ Quiz ({data.quiz.length} tanong)
                </button>
              </div>

              {tab === "flashcards" && <FlashcardView cards={data.flashcards} />}
              {tab === "quiz" && <QuizView questions={data.quiz} />}
            </div>
          )}
        </div>

        {/* Footer */}
        {data && !loading && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-[#F59E0B]" />
              Generated by Gabay AI
            </p>
            <button onClick={convert} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#6C63FF] transition-colors font-medium">
              <RefreshCw className="w-4 h-4" /> I-regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
