import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import TopNav from "@/components/top-nav";
import OnboardingModal from "@/components/onboarding-modal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GabayAral - Boses Mo. Aral Mo. Kinabukasan Mo.",
  description: "AI-powered learning platform designed for Filipino students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex bg-background text-foreground overflow-hidden">
        <OnboardingModal />
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#F8FAFC]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
