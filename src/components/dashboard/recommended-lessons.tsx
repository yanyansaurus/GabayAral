"use client";

import { useState, useEffect } from "react";
import { BookOpen, Map, Calculator, Atom, Languages, PenTool } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/context/app-context";

const lessonsByLevel: Record<string, Array<{ title: string; subject: string; icon: any; color: string }>> = {
  SHS: [
    { title: "Derivatives at Integrals", subject: "Basic Calculus", icon: Calculator, color: "bg-[#6C63FF]" },
    { title: "Cell Division: Mitosis at Meiosis", subject: "General Biology", icon: Atom, color: "bg-[#00C2A8]" },
    { title: "Philippine Literature", subject: "Filipino", icon: Languages, color: "bg-[#F59E0B]" },
  ],
  College: [
    { title: "Data Structures & Algorithms", subject: "Computer Science", icon: Calculator, color: "bg-[#6C63FF]" },
    { title: "Macroeconomics", subject: "Economics", icon: Map, color: "bg-[#00C2A8]" },
    { title: "Technical Writing", subject: "English", icon: BookOpen, color: "bg-[#F59E0B]" },
  ],
};

function getSubjectIcon(subject: string) {
  const lower = subject.toLowerCase();
  if (lower.includes("math") || lower.includes("calculus") || lower.includes("algebra")) return Calculator;
  if (lower.includes("science") || lower.includes("biology") || lower.includes("physics")) return Atom;
  if (lower.includes("english") || lower.includes("literature")) return BookOpen;
  if (lower.includes("filipino") || lower.includes("wika")) return Languages;
  return PenTool;
}

function getSubjectColor(subject: string) {
  const lower = subject.toLowerCase();
  if (lower.includes("math")) return "bg-[#6C63FF]";
  if (lower.includes("science")) return "bg-[#00C2A8]";
  if (lower.includes("filipino")) return "bg-[#F59E0B]";
  if (lower.includes("english")) return "bg-[#EC4899]";
  return "bg-[#3B82F6]";
}

export default function RecommendedLessons() {
  const { profile } = useApp();
  const level = profile?.educationLevel || "SHS";
  const language = profile?.language || "Filipino";
  const [lessons, setLessons] = useState(lessonsByLevel[level] || lessonsByLevel["SHS"]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gabayal_notes");
      if (stored) {
        try {
          const parsedNotes: any[] = JSON.parse(stored);
          if (parsedNotes && parsedNotes.length > 0) {
            // Get up to 3 most recent notes
            const recentNotes = parsedNotes.slice(0, 3).map((note) => ({
              title: note.title || "Walang Pamagat",
              subject: note.subject || "General",
              icon: getSubjectIcon(note.subject || ""),
              color: getSubjectColor(note.subject || ""),
            }));
            
            // If less than 3 notes, pad with defaults
            const defaults = lessonsByLevel[level] || lessonsByLevel["SHS"];
            const finalLessons = [...recentNotes, ...defaults].slice(0, 3);
            setLessons(finalLessons);
            return;
          }
        } catch (e) {
          // Ignore parse error
        }
      }
      // Set defaults if no notes
      setLessons(lessonsByLevel[level] || lessonsByLevel["SHS"]);
    }
  }, [level]);

  const t = (fil: string, eng: string) => (language === "Filipino" ? fil : eng);

  return (
    <div className="bg-white dark:bg-[#15171C] rounded-2xl lg:rounded-3xl p-5 lg:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-50 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h2 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">{t("Inirerekomenda Para sa Iyo", "Recommended for You")}</h2>
        <Link href="/practice" className="text-xs lg:text-sm font-medium text-[#6C63FF] hover:text-[#5A52D5]">
          {t("Tingnan lahat", "View all")}
        </Link>
      </div>

      <div className="flex flex-col space-y-3 flex-1 justify-between">
        {lessons.map((lesson, index) => {
          const Icon = lesson.icon;
          return (
            <Link
              key={index}
              href="/practice"
              className="flex items-center p-3 rounded-2xl hover:bg-gray-50 dark:bg-[#1E232B] transition-colors group cursor-pointer border border-transparent hover:border-gray-100 dark:border-gray-800 active:scale-[0.98]"
            >
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-white ${lesson.color} shadow-sm group-hover:scale-105 transition-transform`}>
                <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              
              <div className="ml-3 lg:ml-4 flex-1 min-w-0">
                <h3 className="text-sm lg:text-base font-bold text-gray-900 dark:text-white leading-tight mb-0.5 truncate">{lesson.title}</h3>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">{lesson.subject}</p>
              </div>

              <span className="bg-[#6C63FF]/10 text-[#6C63FF] group-hover:bg-[#6C63FF] group-hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex-shrink-0">
                {t("Go", "Go")}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
