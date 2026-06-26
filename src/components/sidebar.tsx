"use client";

import {
  Home,
  Bot,
  FileText,
  PenTool,
  Settings,
  Wifi,
  Sparkles,
  Globe,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp, getRankEmoji } from "@/context/app-context";

const navigation = [
  { name: "Dashboard",   href: "/",         icon: Home },
  { name: "AI Tutor",    href: "/tutor",    icon: Bot },
  { name: "Practice",    href: "/practice", icon: PenTool },
  { name: "Mga Tala",    href: "/notes",    icon: FileText },
  { name: "Mga Setting", href: "/profile",  icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, points, rank, resetProfile } = useApp();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="hidden lg:flex lg:flex-shrink-0 w-64 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-[#15171C] shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative transition-colors duration-300">
      <div className="flex flex-col flex-1 pb-4 overflow-y-auto pt-6 px-6">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 mb-8 px-2">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#0f1115] mr-3">
            <img src="/gabayaral-logo.png" alt="GabayAral Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Gabay<span className="text-[#6C63FF]">Aral</span>
          </span>
        </div>

        {/* Student card */}
        {profile && (
          <div className="mb-6 bg-gradient-to-br from-[#6C63FF]/5 to-[#00C2A8]/5 border border-[#6C63FF]/10 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00C2A8] flex items-center justify-center text-white font-bold text-sm shadow-md">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{profile.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{profile.educationLevel} · {profile.school}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6C63FF] dark:text-[#8881ff] font-bold">{getRankEmoji(points)} {rank}</span>
              <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">{points} pts</span>
            </div>
          </div>
        )}

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
                    ? "bg-[#6C63FF] text-white shadow-md shadow-indigo-200 dark:shadow-none"
                    : "text-gray-600 dark:text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                    active
                      ? "text-white"
                      : "text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 dark:text-gray-500"
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
          {/* Language display */}
          {profile && (
            <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/50">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 block">
                Wika
              </label>
              <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                <Globe className="w-4 h-4 text-[#6C63FF] dark:text-[#8881ff] mr-2" />
                {profile.language}
              </div>
            </div>
          )}

          {/* Low Data Mode */}
          <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Low Data Mode</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1 flex items-center">
                <Wifi className="w-3 h-3 mr-1 text-[#00C2A8]" />
                Gabay kahit mahina
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => { if (confirm("I-reset ang profile mo?")) resetProfile(); }}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            I-reset ang Profile
          </button>
        </div>
      </div>
    </div>
  );
}
