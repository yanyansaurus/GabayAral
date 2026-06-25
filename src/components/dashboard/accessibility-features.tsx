import { Mic, Globe, Wifi, HeartPulse } from "lucide-react";

const features = [
  {
    title: "Boses mo, intindihin",
    description: "Suporta sa maraming lokal na wika.",
    icon: Mic,
    color: "text-[#6C63FF]",
    bgColor: "bg-indigo-50",
  },
  {
    title: "Gamit kahit mahina ang internet.",
    description: "Dinisenyo para sa bawat komunidad.",
    icon: Wifi,
    color: "text-[#00C2A8]",
    bgColor: "bg-teal-50",
  },
  {
    title: "Aral na akma sa iyong level.",
    description: "Personalized na gabay para sa'yo.",
    icon: HeartPulse, // using HeartPulse for personalized/adaptive or Target
    color: "text-[#1D4ED8]", // darker blue
    bgColor: "bg-blue-50",
  },
  {
    title: "Ligtas, libre, at para sa'yo.",
    description: "Edukasyon para sa lahat, walang iwanan.",
    icon: Globe, // Using Globe or Heart
    color: "text-rose-500",
    bgColor: "bg-rose-50",
  },
];

export default function AccessibilityFeatures() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-50 h-full">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Para sa Bawat Estudyante</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start group">
            <div className={`p-3 rounded-2xl ${feature.bgColor} ${feature.color} flex-shrink-0 transition-transform group-hover:scale-110`}>
              <feature.icon className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1">{feature.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
