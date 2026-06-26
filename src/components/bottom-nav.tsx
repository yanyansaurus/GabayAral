"use client";

import { Home, Bot, PenTool, FileText, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Home", href: "/", icon: Home },
  { name: "Gabay", href: "/tutor", icon: Bot },
  { name: "Practice", href: "/practice", icon: PenTool },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Profile", href: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#15171C]/95 dark:bg-[#15171C]/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-2xl transition-all duration-200 relative ${
                active
                  ? "text-[#6C63FF] dark:text-[#8881ff]"
                  : "text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 dark:text-gray-500 active:scale-95"
              }`}
            >
              {active && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] dark:from-[#8881ff] dark:to-[#6C63FF] rounded-full" />
              )}
              <tab.icon
                className={`w-5 h-5 transition-all duration-200 ${
                  active ? "text-[#6C63FF] dark:text-[#8881ff] scale-110" : ""
                }`}
              />
              <span
                className={`text-[10px] font-semibold leading-none transition-all ${
                  active ? "text-[#6C63FF] dark:text-[#8881ff]" : "text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500"
                }`}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
