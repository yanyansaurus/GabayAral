import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import TopNav from "@/components/top-nav";
import BottomNav from "@/components/bottom-nav";
import OnboardingModal from "@/components/onboarding-modal";
import { AppProvider } from "@/context/app-context";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GabayAral - Boses Mo. Aral Mo. Kinabukasan Mo.",
  description: "AI-powered study companion for Filipino SHS & College students. Personalized, bilingual learning that adapts to your level.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GabayAral",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6C63FF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex bg-white dark:bg-[#0f1115] text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppProvider>
            <OnboardingModal />
            {/* Desktop sidebar — hidden on mobile */}
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
              {/* Desktop top nav — hidden on mobile */}
              <TopNav />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#F8FAFC] dark:bg-[#0f1115] pb-mobile-nav lg:pb-8 custom-scrollbar transition-colors duration-300">
                {children}
              </main>
            </div>
            {/* Mobile bottom nav — hidden on desktop */}
            <BottomNav />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
