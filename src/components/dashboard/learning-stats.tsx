import { Book, Clock, Award, Flame } from "lucide-react";

const stats = [
  {
    name: "Araling Natapos",
    value: "12",
    subValue: "/ 20",
    icon: Book,
    color: "bg-[#6C63FF]",
    iconColor: "text-[#6C63FF]",
    bgColor: "bg-indigo-50",
  },
  {
    name: "Mga Badge",
    value: "5",
    subValue: "",
    icon: Award,
    color: "bg-[#F59E0B]",
    iconColor: "text-[#F59E0B]",
    bgColor: "bg-amber-50",
  },
  {
    name: "Oras ng Pag-aaral",
    value: "8",
    subValue: "h 30m",
    icon: Clock,
    color: "bg-[#00C2A8]",
    iconColor: "text-[#00C2A8]",
    bgColor: "bg-teal-50",
  },
  {
    name: "Kasalukuyang Streak",
    value: "7",
    subValue: " araw",
    icon: Flame,
    color: "bg-[#EF4444]",
    iconColor: "text-[#EF4444]",
    bgColor: "bg-red-50",
  },
];

export default function LearningStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-3xl p-6 flex items-center shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group"
        >
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.name}</p>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              {stat.subValue && (
                <p className="ml-1 text-sm font-medium text-gray-500">
                  {stat.subValue}
                </p>
              )}
            </div>
          </div>
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color} text-white shadow-md transform group-hover:scale-110 transition-transform duration-300`}
          >
            <stat.icon className="w-6 h-6" />
          </div>
        </div>
      ))}
    </div>
  );
}
