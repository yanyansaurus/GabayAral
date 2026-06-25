import { ArrowRight, Sparkles } from "lucide-react";

export default function StudentMotivation() {
  return (
    <div className="bg-[#00C2A8]/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden h-full flex flex-col justify-center border border-[#00C2A8]/20">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-[#00C2A8] opacity-20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
          Tuloy lang, Juan! <Sparkles className="w-5 h-5 ml-2 text-amber-500" />
        </h3>
        <p className="text-gray-700 text-sm mb-6 max-w-[200px]">
          Malaking bagay ang bawat hakbang mo. Keep up the good work!
        </p>

        <button className="bg-white hover:bg-gray-50 text-[#00C2A8] border border-[#00C2A8]/20 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center group">
          Magpatuloy
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* CSS Illustration for Student */}
      <div className="absolute right-0 bottom-0 w-32 h-32 flex justify-end items-end mr-4 mb-4 opacity-90">
         <div className="w-24 h-24 bg-gradient-to-b from-amber-200 to-amber-100 rounded-full relative shadow-md border-4 border-white">
           {/* Face */}
           <div className="absolute top-8 left-6 w-3 h-3 bg-gray-800 rounded-full"></div>
           <div className="absolute top-8 right-6 w-3 h-3 bg-gray-800 rounded-full"></div>
           <div className="absolute top-12 left-9 w-6 h-3 bg-red-400 rounded-b-full"></div>
           <div className="absolute top-10 left-3 w-3 h-3 bg-rose-200 rounded-full opacity-60"></div>
           <div className="absolute top-10 right-3 w-3 h-3 bg-rose-200 rounded-full opacity-60"></div>
           {/* Hair */}
           <div className="absolute -top-2 -left-1 w-26 h-12 bg-gray-900 rounded-t-full rounded-bl-3xl"></div>
         </div>
      </div>
    </div>
  );
}
