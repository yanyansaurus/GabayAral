"use client";

import { useState, type FormEvent } from "react";
import { Sparkles, ChevronRight, ChevronLeft, GraduationCap, School, Globe, AlertTriangle } from "lucide-react";
import { useApp, type StudentProfile } from "@/context/app-context";

const STEPS = ["language", "name", "birthday", "school", "level", "confirm"] as const;
type Step = (typeof STEPS)[number];

export default function OnboardingModal() {
  const { isOnboarded, completeOnboarding } = useApp();

  const [step, setStep] = useState<Step>("language");
  const [language, setLanguage] = useState<"Filipino" | "English">("Filipino");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [school, setSchool] = useState("");
  const [level, setLevel] = useState<"SHS" | "College" | "JHS" | "">("");
  const [animating, setAnimating] = useState(false);
  const [rejected, setRejected] = useState(false);

  if (isOnboarded) return null;

  const age = birthday
    ? Math.floor(
        (Date.now() - new Date(birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      )
    : 0;

  const stepIndex = STEPS.indexOf(step);

  const goNext = () => {
    if (step === "level" && level === "JHS") {
      setRejected(true);
      return;
    }
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next);
  };

  const goBack = () => {
    if (rejected) {
      setRejected(false);
      return;
    }
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  };

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!name || !birthday || !school || !level || level === "JHS") return;
    setAnimating(true);
    const profile: StudentProfile = {
      name: name.trim(),
      birthday,
      age,
      school: school.trim(),
      educationLevel: level as "SHS" | "College",
      language,
    };
    setTimeout(() => completeOnboarding(profile), 500);
  };

  const canGoNext = (): boolean => {
    switch (step) {
      case "language": return true;
      case "name": return name.trim().length >= 2;
      case "birthday": return birthday !== "" && age >= 14;
      case "school": return school.trim().length >= 2;
      case "level": return level !== "";
      case "confirm": return true;
      default: return false;
    }
  };

  const t = (fil: string, eng: string) => (language === "Filipino" ? fil : eng);

  // Rejected state
  if (rejected) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#1E293B]/70 backdrop-blur-md" />
        <div className="relative w-full max-w-md bg-white dark:bg-[#15171C] rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
          <div className="h-2 w-full bg-gradient-to-r from-amber-400 to-red-400" />
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {t("Pasensya Na! 🙏", "Sorry! 🙏")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
              {t(
                "Ang GabayAral ay kasalukuyang para sa Senior High School at College students lamang. Babalik kami para sa'yo soon!",
                "GabayAral is currently for Senior High School and College students only. We'll be back for you soon!"
              )}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
              {t(
                "Kailangan mo maging SHS o College student para magamit ang app.",
                "You need to be an SHS or College student to use the app."
              )}
            </p>
            <button
              onClick={goBack}
              className="bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg"
            >
              {t("Bumalik", "Go Back")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${
        animating ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      <div className="absolute inset-0 bg-[#1E293B]/70 backdrop-blur-md" />

      <div className="relative w-full max-w-md bg-white dark:bg-[#15171C] rounded-3xl shadow-2xl overflow-hidden">
        {/* Top gradient */}
        <div className="h-2 w-full bg-gradient-to-r from-[#6C63FF] via-[#00C2A8] to-[#F59E0B]" />

        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-6 px-8">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= stepIndex
                  ? "bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] w-8"
                  : "bg-gray-200 w-4"
              }`}
            />
          ))}
        </div>

        <div className="p-8">
          {/* ─── Step: Language ─── */}
          {step === "language" && (
            <div className="animate-fade-in text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-[#15171C] mb-4 shadow-lg shadow-indigo-200/50 relative overflow-hidden">
                <img src="/gabayaral-logo.png" alt="GabayAral Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to <span className="text-[#6C63FF]">GabayAral!</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm mb-6">
                Piliin ang iyong wika / Choose your language
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(["Filipino", "English"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`flex flex-col items-center p-5 rounded-2xl border-2 transition-all ${
                      language === lang
                        ? "border-[#6C63FF] bg-indigo-50 dark:bg-indigo-900/20 shadow-lg shadow-indigo-100"
                        : "border-gray-100 dark:border-gray-800 bg-white dark:bg-[#15171C] hover:border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <Globe className={`w-8 h-8 mb-2 ${language === lang ? "text-[#6C63FF]" : "text-gray-400 dark:text-gray-500"}`} />
                    <span className="font-bold text-gray-900 dark:text-white">{lang}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
                      {lang === "Filipino" ? "Tagalog" : "English"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── Step: Name ─── */}
          {step === "name" && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {t("Ano ang pangalan mo?", "What's your name?")} 👋
              </h2>
              <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm mb-6 text-center">
                {t("Para makilala ka namin", "So we can get to know you")}
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("I-type ang pangalan mo...", "Type your name...")}
                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-base outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] transition-all text-center font-medium"
                autoFocus
              />
            </div>
          )}

          {/* ─── Step: Birthday ─── */}
          {step === "birthday" && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {t("Kailan ka ipinanganak?", "When were you born?")} 🎂
              </h2>
              <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm mb-6 text-center">
                {t("Para malaman ang iyong edad", "So we know your age")}
              </p>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-base outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] transition-all text-center font-medium"
              />
              {birthday && (
                <p className="text-center text-sm text-[#6C63FF] font-semibold mt-3">
                  {age} {t("taong gulang", "years old")} 🎉
                </p>
              )}
            </div>
          )}

          {/* ─── Step: School ─── */}
          {step === "school" && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {t("Saan ka nag-aaral?", "Where do you study?")} 🏫
              </h2>
              <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm mb-6 text-center">
                {t("Pangalan ng iyong paaralan", "Name of your school")}
              </p>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder={t("Hal. ABC National High School", "E.g. ABC National High School")}
                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-base outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] transition-all text-center font-medium"
                autoFocus
              />
            </div>
          )}

          {/* ─── Step: Level ─── */}
          {step === "level" && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {t("Anong antas mo?", "What's your level?")} 📚
              </h2>
              <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm mb-6 text-center">
                {t("Para mapersonalisa ang iyong karanasan", "To personalize your experience")}
              </p>
              <div className="space-y-3">
                {[
                  { id: "SHS" as const, label: "Senior High School", sub: "Grades 11 – 12", icon: School, color: "from-[#00C2A8] to-[#059669]", emoji: "🎯" },
                  { id: "College" as const, label: "College", sub: "Undergraduate", icon: GraduationCap, color: "from-[#F59E0B] to-[#D97706]", emoji: "🎓" },
                  { id: "JHS" as const, label: "Junior High School", sub: "Grades 7 – 10", icon: School, color: "from-gray-400 to-gray-500", emoji: "📚" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setLevel(opt.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                      level === opt.id
                        ? opt.id === "JHS"
                          ? "border-gray-300 bg-gray-50 dark:bg-[#1E232B]"
                          : "border-[#6C63FF] bg-indigo-50 dark:bg-indigo-900/20 shadow-lg shadow-indigo-100"
                        : "border-gray-100 dark:border-gray-800 bg-white dark:bg-[#15171C] hover:border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">{opt.label}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{opt.sub}</p>
                    </div>
                    {level === opt.id && (
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${opt.color} flex items-center justify-center text-white text-xs`}>
                        ✓
                      </div>
                    )}
                  </button>
                ))}
                {level === "JHS" && (
                  <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl text-center">
                    ⚠️ {t("Ang GabayAral ay para lamang sa SHS at College.", "GabayAral is for SHS and College only.")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ─── Step: Confirm ─── */}
          {step === "confirm" && (
            <div className="animate-fade-in text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#6C63FF] to-[#00C2A8] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                <span className="text-4xl">🚀</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t(`Handa ka na, ${name.split(" ")[0]}!`, `You're all set, ${name.split(" ")[0]}!`)}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm mb-6">
                {t("Sisimulan na natin ang iyong learning journey!", "Let's start your learning journey!")}
              </p>
              <div className="bg-gray-50 dark:bg-[#1E232B] rounded-2xl p-4 mb-6 space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">{t("Pangalan", "Name")}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">{t("Edad", "Age")}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{age}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">{t("Paaralan", "School")}</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-right max-w-[180px] truncate">{school}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">{t("Antas", "Level")}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{level}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">{t("Wika", "Language")}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{language}</span>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                {t("Simulan ang Pag-aaral! 🎉", "Start Learning! 🎉")}
              </button>
            </div>
          )}

          {/* Navigation buttons */}
          {step !== "confirm" && (
            <div className="flex items-center justify-between mt-8">
              {stepIndex > 0 ? (
                <button
                  onClick={goBack}
                  className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-200 transition-colors font-medium"
                >
                  <ChevronLeft className="w-4 h-4" /> {t("Bumalik", "Back")}
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={goNext}
                disabled={!canGoNext()}
                className={`flex items-center gap-1 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                  canGoNext()
                    ? "bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] text-white shadow-md hover:scale-[1.02]"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                {t("Susunod", "Next")} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
