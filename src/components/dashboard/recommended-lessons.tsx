import { BookOpen, Map, Calculator, Play } from "lucide-react";
import Link from "next/link";

const lessons = [
  {
    title: "Pangngalan",
    subject: "Wika",
    grade: "Grade 4",
    icon: BookOpen,
    color: "bg-[#6C63FF]",
    lightColor: "bg-indigo-50",
  },
  {
    title: "Mga Anyong Lupa",
    subject: "Araling Panlipunan",
    grade: "Grade 5",
    icon: Map,
    color: "bg-[#00C2A8]",
    lightColor: "bg-teal-50",
  },
  {
    title: "Pagdaragdag ng Fraction",
    subject: "Math",
    grade: "Grade 6",
    icon: Calculator,
    color: "bg-[#F59E0B]",
    lightColor: "bg-amber-50",
  },
];

export default function RecommendedLessons() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-50 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Inirerekomenda Para sa Iyo</h2>
        <Link href="#" className="text-sm font-medium text-[#6C63FF] hover:text-[#5A52D5]">
          Tingnan lahat
        </Link>
      </div>

      <div className="flex flex-col space-y-4 flex-1 justify-between">
        {lessons.map((lesson, index) => (
          <div
            key={index}
            className="flex items-center p-3 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer border border-transparent hover:border-gray-100"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${lesson.color} shadow-sm group-hover:scale-105 transition-transform`}>
              <lesson.icon className="w-6 h-6" />
            </div>
            
            <div className="ml-4 flex-1">
              <h3 className="text-base font-bold text-gray-900 leading-tight mb-1">{lesson.title}</h3>
              <div className="flex items-center text-xs font-medium text-gray-500 space-x-2">
                <span>{lesson.subject}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>{lesson.grade}</span>
              </div>
            </div>

            <button className="bg-[#6C63FF]/10 text-[#6C63FF] group-hover:bg-[#6C63FF] group-hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
              Simulan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
