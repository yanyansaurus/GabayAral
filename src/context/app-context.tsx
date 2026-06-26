"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────
export interface StudentProfile {
  name: string;
  birthday: string;       // ISO date string
  age: number;
  school: string;
  educationLevel: "SHS" | "College";
  language: "Filipino" | "English";
}

export interface AppState {
  // Auth / onboarding
  isOnboarded: boolean;
  profile: StudentProfile | null;

  // Points
  points: number;
  rank: string;

  // UI
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Actions
  completeOnboarding: (profile: StudentProfile) => void;
  addPoints: (amount: number, reason?: string) => void;
  getStats: () => ActivityStats;
  trackActivity: (key: ActivityKey, increment?: number) => void;
  resetProfile: () => void;
  updateProfile: (updates: Partial<StudentProfile>) => void;
}

export type ActivityKey =
  | "questionsAsked"
  | "notesCreated"
  | "quizCompleted"
  | "practiceCompleted"
  | "flashcardsViewed";

export interface ActivityStats {
  questionsAsked: number;
  notesCreated: number;
  quizCompleted: number;
  practiceCompleted: number;
  flashcardsViewed: number;
  totalPoints: number;
  rank: string;
  streak: number;
}

// ─── Constants ───────────────────────────────────────────
const PROFILE_KEY = "gabay_profile";
const POINTS_KEY = "gabay_points";
const ACTIVITY_KEY = "gabay_activity";
const STREAK_KEY = "gabay_streak";
const LAST_VISIT_KEY = "gabay_last_visit";

const RANKS = [
  { name: "Baguhan", minPoints: 0, emoji: "🌱" },
  { name: "Estudyante", minPoints: 100, emoji: "📖" },
  { name: "Iskolar", minPoints: 500, emoji: "🎓" },
  { name: "Marunong", minPoints: 1000, emoji: "⭐" },
  { name: "Pantas", minPoints: 2500, emoji: "👑" },
];

export function getRank(points: number): string {
  let rank = RANKS[0].name;
  for (const r of RANKS) {
    if (points >= r.minPoints) rank = r.name;
  }
  return rank;
}

export function getRankEmoji(points: number): string {
  let emoji = RANKS[0].emoji;
  for (const r of RANKS) {
    if (points >= r.minPoints) emoji = r.emoji;
  }
  return emoji;
}

export function getNextRank(points: number): { name: string; minPoints: number; emoji: string } | null {
  for (const r of RANKS) {
    if (points < r.minPoints) return r;
  }
  return null;
}

// ─── Context ─────────────────────────────────────────────
const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

// ─── Streak Logic ────────────────────────────────────────
function calculateStreak(): number {
  if (typeof window === "undefined") return 0;
  const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
  const streak = parseInt(localStorage.getItem(STREAK_KEY) || "0", 10);
  const today = new Date().toDateString();

  if (!lastVisit) {
    localStorage.setItem(LAST_VISIT_KEY, today);
    localStorage.setItem(STREAK_KEY, "1");
    return 1;
  }

  if (lastVisit === today) return streak;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (lastVisit === yesterday.toDateString()) {
    const newStreak = streak + 1;
    localStorage.setItem(STREAK_KEY, newStreak.toString());
    localStorage.setItem(LAST_VISIT_KEY, today);
    return newStreak;
  }

  // Streak broken
  localStorage.setItem(STREAK_KEY, "1");
  localStorage.setItem(LAST_VISIT_KEY, today);
  return 1;
}

// ─── Provider ────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [isOnboarded, setIsOnboarded] = useState(true); // default true to avoid flash
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [points, setPoints] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streak, setStreak] = useState(0);

  // Hydrate from localStorage
  useEffect(() => {
    const storedProfile = localStorage.getItem(PROFILE_KEY);
    const storedPoints = parseInt(localStorage.getItem(POINTS_KEY) || "0", 10);

    if (storedProfile) {
      try {
        setProfile(JSON.parse(storedProfile));
        setIsOnboarded(true);
      } catch {
        setIsOnboarded(false);
      }
    } else {
      setIsOnboarded(false);
    }

    setPoints(storedPoints);
    setStreak(calculateStreak());
  }, []);

  const completeOnboarding = useCallback((newProfile: StudentProfile) => {
    setProfile(newProfile);
    setIsOnboarded(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
      localStorage.setItem("gabayal_education_level", newProfile.educationLevel);
    }
  }, []);

  const addPoints = useCallback((amount: number) => {
    setPoints((prev) => {
      const newPoints = prev + amount;
      if (typeof window !== "undefined") {
        localStorage.setItem(POINTS_KEY, newPoints.toString());
      }
      return newPoints;
    });
  }, []);

  const trackActivity = useCallback((key: ActivityKey, increment: number = 1) => {
    if (typeof window === "undefined") return;
    const stored = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "{}");
    stored[key] = (stored[key] || 0) + increment;
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(stored));
  }, []);

  const getStats = useCallback((): ActivityStats => {
    const stored = typeof window !== "undefined" ? JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "{}") : {};
    return {
      questionsAsked: stored.questionsAsked || 0,
      notesCreated: stored.notesCreated || 0,
      quizCompleted: stored.quizCompleted || 0,
      practiceCompleted: stored.practiceCompleted || 0,
      flashcardsViewed: stored.flashcardsViewed || 0,
      totalPoints: points,
      rank: getRank(points),
      streak,
    };
  }, [points, streak]);

  const resetProfile = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(POINTS_KEY);
      localStorage.removeItem(ACTIVITY_KEY);
      localStorage.removeItem(STREAK_KEY);
      localStorage.removeItem(LAST_VISIT_KEY);
      localStorage.removeItem("gabayal_education_level");
      localStorage.removeItem("gabayal_notes");
    }
    setProfile(null);
    setIsOnboarded(false);
    setPoints(0);
  }, []);

  const updateProfile = useCallback((updates: Partial<StudentProfile>) => {
    setProfile((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      if (typeof window !== "undefined") {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
        localStorage.setItem("gabayal_education_level", updated.educationLevel);
      }
      return updated;
    });
  }, []);

  const rank = getRank(points);

  return (
    <AppContext.Provider
      value={{
        isOnboarded,
        profile,
        points,
        rank,
        sidebarOpen,
        setSidebarOpen,
        completeOnboarding,
        addPoints,
        getStats,
        trackActivity,
        resetProfile,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
