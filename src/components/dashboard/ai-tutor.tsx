import { Send, Sparkles } from "lucide-react";

const suggestions = [
  "Ano ang sanhi ng bagyo?",
  "Ibigay ang kahulugan ng wika.",
  "Paano magbasa nang maayos?",
  "Translate 'hello' to Cebuano",
];

export default function AITutor() {
  return (
    <div className="bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg h-full flex flex-col justify-between">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-teal-400 opacity-20 rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-medium text-indigo-100 uppercase tracking-wider mb-1 flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-amber-300" /> Gabay AI
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold leading-tight">
              Mag-aral kasama si <br className="hidden sm:block" />
              Gabay AI
            </h3>
          </div>
          {/* Simple Robot Illustration CSS-based */}
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center p-2 shadow-inner">
            <div className="w-full h-full bg-[#1E293B] rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
               <div className="flex space-x-2 mt-2">
                 <div className="w-3 h-3 rounded-full bg-[#00C2A8] animate-pulse"></div>
                 <div className="w-3 h-3 rounded-full bg-[#00C2A8] animate-pulse delay-75"></div>
               </div>
               <div className="w-8 h-1 bg-[#00C2A8]/50 rounded-full mt-3"></div>
            </div>
          </div>
        </div>

        <p className="text-indigo-100 mb-4 text-sm">
          Anong gusto mong aralin ngayon?
        </p>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Tanong mo ako..."
            className="w-full bg-white text-gray-900 rounded-2xl py-4 pl-5 pr-14 outline-none focus:ring-4 focus:ring-white/20 transition-all shadow-inner placeholder-gray-400"
          />
          <button className="absolute right-2 top-2 bottom-2 bg-[#6C63FF] hover:bg-[#5A52D5] text-white p-2 rounded-xl transition-colors flex items-center justify-center">
            <Send className="w-5 h-5" />
          </button>
        </div>

        <div>
          <p className="text-xs text-indigo-200 mb-3 font-medium">Halimbawa:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-colors text-xs py-2 px-3 rounded-xl text-white whitespace-nowrap"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
