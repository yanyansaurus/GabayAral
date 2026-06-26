"use client";

import { Send, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";

export default function AITutor() {
  const router = useRouter();
  const { profile } = useApp();
  const language = profile?.language || "Filipino";

  const t = (fil: string, eng: string) => (language === "Filipino" ? fil : eng);

  const suggestions = language === "Filipino"
    ? [
        "Gusto ko matuto ng Calculus",
        "Ituro ang photosynthesis",
        "Ano ang supply and demand?",
        "Paano magsulat ng essay?",
      ]
    : [
        "I want to learn Calculus",
        "Teach me photosynthesis",
        "What is supply and demand?",
        "How to write an essay?",
      ];

  return (
    <div
      className="bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] rounded-2xl lg:rounded-3xl p-5 sm:p-8 text-white relative overflow-hidden shadow-lg h-full flex flex-col justify-between cursor-pointer active:scale-[0.99] transition-transform"
      onClick={() => router.push("/tutor")}
    >
      {/* Decorative background */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white dark:bg-[#15171C] opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-teal-400 opacity-20 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <div>
            <h2 className="text-xs font-medium text-indigo-100 uppercase tracking-wider mb-1 flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-amber-300" /> Gabay AI
            </h2>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
              {t("Mag-aral kasama si", "Study with")} <br className="hidden sm:block" />
              Gabay AI
            </h3>
          </div>
          {/* Robot Illustration */}
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white dark:bg-[#15171C]/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center p-2 shadow-inner">
            <div className="w-full h-full bg-[#1E293B] rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
               <div className="flex space-x-2 mt-2">
                 <div className="w-3 h-3 rounded-full bg-[#00C2A8] animate-pulse" />
                 <div className="w-3 h-3 rounded-full bg-[#00C2A8] animate-pulse delay-75" />
               </div>
               <div className="w-8 h-1 bg-[#00C2A8]/50 rounded-full mt-3" />
            </div>
          </div>
        </div>

        <p className="text-indigo-100 mb-3 text-xs lg:text-sm">
          {t("Anong gusto mong aralin ngayon?", "What do you want to learn today?")}
        </p>

        <div className="relative mb-4 lg:mb-6" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            placeholder={t("Tanong mo ako...", "Ask me anything...")}
            className="w-full bg-white dark:bg-[#15171C] text-gray-900 dark:text-white rounded-2xl py-3 lg:py-4 pl-4 lg:pl-5 pr-12 lg:pr-14 outline-none focus:ring-4 focus:ring-white/20 transition-all shadow-inner placeholder-gray-400 text-sm"
            onFocus={() => router.push("/tutor")}
          />
          <button
            onClick={() => router.push("/tutor")}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#6C63FF] hover:bg-[#5A52D5] text-white p-2 rounded-xl transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>

        <div>
          <p className="text-xs text-indigo-200 mb-2 font-medium">{t("Halimbawa:", "Examples:")}</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); router.push("/tutor"); }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-colors text-[11px] lg:text-xs py-2 px-3 rounded-xl text-white whitespace-nowrap active:scale-95"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
