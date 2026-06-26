"use client";

import { useEffect, useState } from "react";
import { BookOpen, Clock, Star, Flame } from "lucide-react";
import { useApp, getRankEmoji, getNextRank } from "@/context/app-context";

export default function LearningStats() {
  const { points, rank, getStats } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = getStats();
  const nextRank = getNextRank(points);

  const statCards = [
    {
      name: "Tanong",
      value: stats.questionsAsked.toString(),
      subValue: " asked",
      icon: BookOpen,
      color: "bg-[#6C63FF]",
    },
    {
      name: "Rank",
      value: getRankEmoji(points),
      subValue: ` ${rank}`,
      icon: Star,
      color: "bg-[#F59E0B]",
    },
    {
      name: "Puntos",
      value: points.toString(),
      subValue: " pts",
      icon: Clock,
      color: "bg-[#00C2A8]",
    },
    {
      name: "Streak",
      value: stats.streak.toString(),
      subValue: " araw",
      icon: Flame,
      color: "bg-[#EF4444]",
    },
  ];

  if (!mounted) {
    // Return empty placeholder or generic skeleton that matches server render
    return <div className="h-40" />; 
  }

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-[#15171C] rounded-2xl lg:rounded-3xl p-4 lg:p-6 flex items-center shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-1 truncate">{stat.name}</p>
              <div className="flex items-baseline">
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                {stat.subValue && (
                  <p className="ml-1 text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 truncate">
                    {stat.subValue}
                  </p>
                )}
              </div>
            </div>
            <div
              className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center ${stat.color} text-white shadow-md transform group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
            >
              <stat.icon className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Rank progress bar */}
      {nextRank && (
        <div className="mt-3 bg-white dark:bg-[#15171C] rounded-2xl p-4 border border-gray-50 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-gray-600 dark:text-gray-300">{getRankEmoji(points)} {rank}</span>
            <span className="text-gray-400 dark:text-gray-500">{nextRank.emoji} {nextRank.name} ({nextRank.minPoints} pts)</span>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#6C63FF] to-[#00C2A8] h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((points / nextRank.minPoints) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
