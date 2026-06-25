"use client";

import { useEffect, useState } from "react";
import { Sparkles, BookOpen, GraduationCap, School } from "lucide-react";

const STORAGE_KEY = "gabayal_education_level";

const levels = [
  {
    id: "JHS",
    label: "Junior High School",
    sublabel: "Grades 7 – 10",
    icon: School,
    color: "from-[#6C63FF] to-[#4F46E5]",
    border: "border-[#6C63FF]",
    shadow: "shadow-indigo-200",
    emoji: "📚",
    description: "Palakasin ang pundasyon ng kaalaman",
  },
  {
    id: "SHS",
    label: "Senior High School",
    sublabel: "Grades 11 – 12",
    icon: BookOpen,
    color: "from-[#00C2A8] to-[#059669]",
    border: "border-[#00C2A8]",
    shadow: "shadow-teal-200",
    emoji: "🎯",
    description: "Ihanda ang sarili para sa kinabukasan",
  },
  {
    id: "College",
    label: "College",
    sublabel: "Undergraduate",
    icon: GraduationCap,
    color: "from-[#F59E0B] to-[#D97706]",
    border: "border-[#F59E0B]",
    shadow: "shadow-amber-200",
    emoji: "🎓",
    description: "I-level up ang propesyonal na kaalaman",
  },
];

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setTimeout(() => setVisible(true), 500);
    }
  }, []);

  const handleSelect = (id: string) => {
    setSelected(id);
  };

  const handleConfirm = () => {
    if (!selected) return;
    setAnimating(true);
    localStorage.setItem(STORAGE_KEY, selected);
    setTimeout(() => setVisible(false), 500);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${
        animating ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1E293B]/70 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Top gradient strip */}
        <div className="h-2 w-full bg-gradient-to-r from-[#6C63FF] via-[#00C2A8] to-[#F59E0B]" />

        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#00C2A8] text-white text-3xl mb-4 shadow-lg shadow-indigo-200 relative">
              G
              <Sparkles className="absolute -top-1.5 -right-1.5 w-5 h-5 text-[#F59E0B]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Maligayang pagdating sa{" "}
              <span className="text-[#6C63FF]">GabayAral!</span>
            </h1>
            <p className="text-gray-500 text-base">
              Anong antas ng pag-aaral mo? Para mapersonalisa namin ang iyong
              karanasan. 🌟
            </p>
          </div>

          {/* Level cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleSelect(level.id)}
                className={`relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-200 text-center group ${
                  selected === level.id
                    ? `${level.border} bg-white shadow-xl ${level.shadow}`
                    : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white hover:shadow-md"
                }`}
              >
                {selected === level.id && (
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${level.color} opacity-5`}
                  />
                )}
                <span className="text-4xl mb-3">{level.emoji}</span>
                <h3 className="font-bold text-gray-900 text-base mb-0.5">
                  {level.label}
                </h3>
                <p className="text-xs font-medium text-gray-400 mb-3">
                  {level.sublabel}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {level.description}
                </p>

                {selected === level.id && (
                  <div
                    className={`mt-3 w-6 h-6 rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                  >
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 ${
              selected
                ? "bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {selected ? `Simulan ang Pag-aaral bilang ${selected} →` : "Pumili ng antas para magpatuloy"}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Maaari mong baguhin ito sa mga settings mamaya.
          </p>
        </div>
      </div>
    </div>
  );
}
