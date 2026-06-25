"use client";

import {
  Home,
  BookOpen,
  Bot,
  FileText,
  BarChart2,
  Award,
  Globe,
  Settings,
  Wifi,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "Dashboard",   href: "/",       icon: Home },
  { name: "AI Tutor",    href: "/tutor",  icon: Bot },
  { name: "Mga Tala",    href: "/notes",  icon: FileText },
  { name: "Mga Aralin",  href: "#",       icon: BookOpen },
  { name: "Progress",    href: "#",       icon: BarChart2 },
  { name: "Mga Badge",   href: "#",       icon: Award },
  { name: "Mga Setting", href: "#",       icon: Settings },
];

export default function Sidebar() {
  const [lowDataMode, setLowDataMode] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="hidden lg:flex lg:flex-shrink-0 w-64 border-r border-gray-100 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
      <div className="flex flex-col flex-1 pb-4 overflow-y-auto pt-6 px-6">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 mb-8 px-2">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#00C2A8] text-white font-bold text-xl mr-3 shadow-md">
            G<Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-[#F59E0B]" />
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            Gabay<span className="text-[#6C63FF]">Aral</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${
                  active
                    ? "bg-[#6C63FF] text-white shadow-md shadow-indigo-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                    active
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-8 space-y-4">
          {/* Language Selector */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 transition-all hover:border-gray-200 hover:bg-gray-100/50">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              Wika
            </label>
            <div className="flex items-center text-sm font-medium text-gray-900">
              <Globe className="w-4 h-4 text-[#6C63FF] mr-2" />
              <select className="bg-transparent outline-none w-full cursor-pointer focus:ring-0 text-gray-700">
                <option>Filipino</option>
                <option>Cebuano</option>
                <option>Ilocano</option>
                <option>Hiligaynon</option>
                <option>Waray</option>
              </select>
            </div>
          </div>

          {/* Low Data Mode */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between transition-all hover:border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-900">Low Data Mode</p>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <Wifi className="w-3 h-3 mr-1 text-[#00C2A8]" />
                Gabay kahit mahina
              </p>
            </div>
            <button
              onClick={() => setLowDataMode(!lowDataMode)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                lowDataMode ? "bg-[#00C2A8]" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  lowDataMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
