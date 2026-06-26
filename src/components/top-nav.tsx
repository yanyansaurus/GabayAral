"use client";

import { Menu, Star } from "lucide-react";
import { useApp, getRankEmoji } from "@/context/app-context";
import { ThemeToggle } from "./theme-toggle";

export default function TopNav() {
  const { profile, points, rank, sidebarOpen, setSidebarOpen, getStats } = useApp();
  const stats = getStats();

  const firstName = profile?.name?.split(" ")[0] || "Estudyante";
  const t = (fil: string, eng: string) =>
    profile?.language === "English" ? eng : fil;

  return (
    <header className="bg-white dark:bg-[#15171C] border-b border-gray-100 dark:border-gray-800 h-16 lg:h-20 flex-shrink-0 flex items-center justify-between px-4 md:px-6 lg:px-8 z-10 shadow-[0_4px_24px_rgba(0,0,0,0.01)] relative transition-colors duration-300">
      <div className="flex items-center">
        {/* Mobile logo — visible only on mobile */}
        <div className="lg:hidden flex items-center mr-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#15171C]">
            <img src="/gabayaral-logo.png" alt="GabayAral Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        <div>
          <h1 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            {t(`Kumusta, ${firstName}!`, `Hey, ${firstName}!`)}
            <span className="ml-2 text-lg lg:text-2xl">👋</span>
          </h1>
          <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-0.5">
            {t("Handa ka na bang matuto ngayon?", "Ready to learn today?")}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 lg:space-x-6">
        {/* Points & Rank */}
        <div className="flex items-center bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 px-3 lg:px-4 py-1.5 lg:py-2 rounded-2xl">
          <span className="text-sm lg:text-base mr-1">{getRankEmoji(points)}</span>
          <div className="flex flex-col">
            <span className="text-xs lg:text-sm font-bold text-[#6C63FF] leading-none">{points} pts</span>
            <span className="text-[9px] lg:text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mt-0.5 hidden sm:block">{rank}</span>
          </div>
        </div>

        {/* Streak */}
        <div className="hidden sm:flex items-center bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 px-3 lg:px-4 py-1.5 lg:py-2 rounded-2xl">
          <span className="text-sm lg:text-base mr-1">🔥</span>
          <div className="flex flex-col">
            <span className="text-xs lg:text-sm font-bold text-orange-600 dark:text-orange-400 leading-none">{stats.streak} {t("Araw", "Days")}</span>
            <span className="text-[9px] lg:text-[10px] font-semibold text-orange-400 uppercase tracking-wider mt-0.5">{t("Tuloy-tuloy", "Streak")}</span>
          </div>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
