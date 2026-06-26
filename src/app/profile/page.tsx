"use client";

import { useApp, getRankEmoji, getNextRank, getRank } from "@/context/app-context";
import { User, School, Calendar, Globe, Star, Trophy, LogOut, ChevronRight, Settings } from "lucide-react";

const RANKS = [
  { name: "Baguhan", minPoints: 0, emoji: "🌱" },
  { name: "Estudyante", minPoints: 100, emoji: "📖" },
  { name: "Iskolar", minPoints: 500, emoji: "🎓" },
  { name: "Marunong", minPoints: 1000, emoji: "⭐" },
  { name: "Pantas", minPoints: 2500, emoji: "👑" },
];

export default function ProfilePage() {
  const { profile, points, rank, getStats, resetProfile, updateProfile } = useApp();
  const stats = getStats();
  const nextRank = getNextRank(points);

  if (!profile) return null;

  const t = (fil: string, eng: string) => (profile.language === "Filipino" ? fil : eng);

  return (
    <div className="max-w-lg mx-auto">
      {/* Profile Card */}
      <div className="bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] rounded-3xl p-6 text-white text-center mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white dark:bg-[#15171C] opacity-10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-full bg-white dark:bg-[#15171C]/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center mx-auto mb-3 text-3xl font-bold">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-indigo-200 text-sm mt-1">{profile.educationLevel} · {profile.school}</p>
          
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="bg-white dark:bg-[#15171C]/20 backdrop-blur-md px-4 py-2 rounded-xl">
              <p className="text-lg font-bold text-[#6C63FF] dark:text-white">{getRankEmoji(points)} {rank}</p>
            </div>
            <div className="bg-white dark:bg-[#15171C]/20 backdrop-blur-md px-4 py-2 rounded-xl">
              <p className="text-lg font-bold text-[#6C63FF] dark:text-white">{points} <span className="text-sm font-normal text-indigo-400 dark:text-gray-300">pts</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Rank Progress */}
      <div className="bg-white dark:bg-[#15171C] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#F59E0B]" />
          {t("Mga Ranggo", "Ranks")}
        </h3>
        <div className="space-y-3">
          {RANKS.map((r) => {
            const isCurrentOrBelow = points >= r.minPoints;
            const isCurrent = rank === r.name;
            return (
              <div key={r.name} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isCurrent ? "bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50" : ""}`}>
                <span className={`text-2xl ${isCurrentOrBelow ? "" : "grayscale opacity-40"}`}>{r.emoji}</span>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${isCurrent ? "text-[#6C63FF]" : isCurrentOrBelow ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}`}>{r.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{r.minPoints} pts</p>
                </div>
                {isCurrent && <span className="text-xs font-bold text-[#6C63FF] bg-indigo-100 px-2 py-1 rounded-lg">{t("Ikaw!", "You!")}</span>}
                {!isCurrentOrBelow && <span className="text-xs text-gray-400 dark:text-gray-500">🔒</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Stats */}
      <div className="bg-white dark:bg-[#15171C] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-[#6C63FF]" />
          {t("Mga Activity", "Activities")}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: t("Tanong", "Questions"), value: stats.questionsAsked, emoji: "💬" },
            { label: t("Tala", "Notes"), value: stats.notesCreated, emoji: "📝" },
            { label: t("Practice", "Practice"), value: stats.practiceCompleted, emoji: "✏️" },
            { label: t("Quiz", "Quizzes"), value: stats.quizCompleted, emoji: "❓" },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 dark:bg-[#1E232B] rounded-xl p-3 text-center">
              <span className="text-2xl">{item.emoji}</span>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{item.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white dark:bg-[#15171C] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">{t("Impormasyon", "Information")}</h3>
        <div className="space-y-3">
          {[
            { icon: User, label: t("Pangalan", "Name"), value: profile.name },
            { icon: Calendar, label: t("Edad", "Age"), value: `${profile.age} ${t("taong gulang", "years old")}` },
            { icon: School, label: t("Paaralan", "School"), value: profile.school },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-2">
              <div className="w-9 h-9 bg-gray-50 dark:bg-[#1E232B] rounded-xl flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{item.label}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Settings */}
      <div className="bg-white dark:bg-[#15171C] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
          {t("Mga Setting", "Settings")}
        </h3>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Globe className="w-4 h-4 text-[#6C63FF]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{t("Wika", "Language")}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{t("Piliin ang gusto mong wika", "Choose your preferred language")}</p>
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center">
            <button
              onClick={() => updateProfile({ language: "Filipino" })}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                profile.language === "Filipino"
                  ? "bg-white dark:bg-[#15171C] text-[#6C63FF] shadow-sm"
                  : "text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-200"
              }`}
            >
              Filipino
            </button>
            <button
              onClick={() => updateProfile({ language: "English" })}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                profile.language === "English"
                  ? "bg-white dark:bg-[#15171C] text-[#6C63FF] shadow-sm"
                  : "text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-200"
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          if (confirm(t("I-reset ang profile mo? Mabubura lahat ng data.", "Reset your profile? All data will be erased."))) {
            resetProfile();
          }
        }}
        className="w-full flex items-center justify-center gap-2 py-4 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all mb-8"
      >
        <LogOut className="w-4 h-4" />
        {t("I-reset ang Profile", "Reset Profile")}
      </button>
    </div>
  );
}
