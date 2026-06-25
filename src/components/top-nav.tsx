"use client";

import { Bell, Flame, ChevronDown, Menu } from "lucide-react";

export default function TopNav() {
  return (
    <header className="bg-white border-b border-gray-100 h-20 flex-shrink-0 flex items-center justify-between px-4 md:px-6 lg:px-8 z-10 shadow-[0_4px_24px_rgba(0,0,0,0.01)] relative">
      <div className="flex items-center">
        <button className="lg:hidden mr-4 text-gray-500 hover:text-gray-700">
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            Kumusta, Juan! <span className="ml-2 text-2xl">👋</span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Handa ka na bang matuto ngayon?</p>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {/* Streak Counter */}
        <div className="hidden sm:flex items-center bg-orange-50 border border-orange-100 px-4 py-2 rounded-2xl">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm mr-2 text-xl">
            🔥
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-orange-600 leading-none">7 Araw</span>
            <span className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider mt-0.5">Tuloy-tuloy</span>
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors bg-gray-50 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 block h-2 w-2 rounded-full bg-[#6C63FF] ring-2 ring-white"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="flex items-center cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-[#00C2A8]/10 border-2 border-[#00C2A8]/20 flex items-center justify-center overflow-hidden">
             {/* Simple Avatar Illustration */}
             <div className="w-full h-full bg-gradient-to-b from-[#6C63FF]/20 to-[#6C63FF]/5 pt-2 flex justify-center relative">
               <div className="w-5 h-5 rounded-full bg-amber-200 border border-amber-300 z-10 absolute top-2"></div>
               <div className="w-8 h-8 rounded-t-full bg-[#6C63FF] absolute bottom-0"></div>
             </div>
          </div>
          <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
