"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useApp } from "@/context/app-context";
import Link from "next/link";

export default function StudentMotivation() {
  const { profile, points } = useApp();
  const firstName = profile?.name?.split(" ")[0] || "Estudyante";
  const language = profile?.language || "Filipino";

  const t = (fil: string, eng: string) => (language === "Filipino" ? fil : eng);

  return (
    <div className="bg-[#00C2A8]/10 rounded-2xl lg:rounded-3xl p-5 sm:p-8 relative overflow-hidden h-full flex flex-col justify-center border border-[#00C2A8]/20">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-[#00C2A8] opacity-20 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          {t(`Tuloy lang, ${firstName}!`, `Keep going, ${firstName}!`)}
          <Sparkles className="w-5 h-5 ml-2 text-amber-500" />
        </h3>
        <p className="text-gray-700 dark:text-gray-200 text-sm mb-5 max-w-[220px]">
          {t(
            "Malaking bagay ang bawat hakbang mo. Keep up the good work!",
            "Every step you take matters. Keep up the good work!"
          )}
        </p>

        <Link
          href="/tutor"
          className="inline-flex items-center bg-white dark:bg-[#15171C] hover:bg-gray-50 dark:bg-[#1E232B] text-[#00C2A8] border border-[#00C2A8]/20 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all group active:scale-95"
        >
          {t("Magpatuloy", "Continue")}
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Student illustration */}
      <div className="absolute right-0 bottom-0 w-28 h-28 lg:w-32 lg:h-32 flex justify-end items-end mr-3 mb-3 opacity-90">
         <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-b from-amber-200 to-amber-100 rounded-full relative shadow-md border-4 border-white">
           <div className="absolute top-8 left-6 w-3 h-3 bg-gray-800 rounded-full" />
           <div className="absolute top-8 right-6 w-3 h-3 bg-gray-800 rounded-full" />
           <div className="absolute top-12 left-9 w-6 h-3 bg-red-400 rounded-b-full" />
           <div className="absolute top-10 left-3 w-3 h-3 bg-rose-200 rounded-full opacity-60" />
           <div className="absolute top-10 right-3 w-3 h-3 bg-rose-200 rounded-full opacity-60" />
           <div className="absolute -top-2 -left-1 w-26 h-12 bg-gray-900 rounded-t-full rounded-bl-3xl" />
         </div>
      </div>
    </div>
  );
}
