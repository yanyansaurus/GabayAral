"use client";

import LearningStats from "@/components/dashboard/learning-stats";
import AITutor from "@/components/dashboard/ai-tutor";
import RecommendedLessons from "@/components/dashboard/recommended-lessons";
import WeeklyProgress from "@/components/dashboard/weekly-progress";
import StudentMotivation from "@/components/dashboard/student-motivation";
import AccessibilityFeatures from "@/components/dashboard/accessibility-features";

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6 pb-6 lg:pb-12">
      {/* Learning Statistics */}
      <section>
        <LearningStats />
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <section className="h-[340px] lg:h-[420px]">
            <AITutor />
          </section>
          
          <section className="h-[280px] lg:h-[320px]">
            <WeeklyProgress />
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-4 lg:space-y-6">
          <section className="h-[340px] lg:h-[420px]">
            <RecommendedLessons />
          </section>
          
          <section className="h-[260px] lg:h-[320px]">
            <StudentMotivation />
          </section>
        </div>
      </div>

      {/* Bottom Section */}
      <section>
        <AccessibilityFeatures />
      </section>
    </div>
  );
}
