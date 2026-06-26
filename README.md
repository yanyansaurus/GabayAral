<div align="center">
  <img src="public/gabayaral-logo.png" alt="GabayAral Logo" width="120" />
  <h1>GabayAral</h1>
  <p><em>Boses Mo. Aral Mo. Kinabukasan Mo.</em></p>
  <p>A student-first, bilingual AI Study Companion designed specifically for Filipino students.</p>
</div>

---

## 🌟 Overview

**GabayAral** is not just another homework solver. It is a highly personalized **Socratic AI Tutor** built to guide students to understand complex concepts on their own. Designed for the Philippine education context, GabayAral bridges the gap for students who lack access to expensive private tutoring by providing a world-class, culturally aware, and bilingual learning experience right on their smartphones.

## ✨ Key Features

- 🧠 **Socratic AI Tutor:** Gabay doesn't give straight answers. It asks clarifying questions and guides students step-by-step through their learning journey.
- 🇵🇭 **Bilingual Support:** Full support for both Tagalog and English, seamlessly switching based on the student's preference.
- 🗂️ **AI Flashcard Generator:** Instantly convert saved notes or general topics into high-quality flashcards.
- ⏱️ **Smart Scheduling (Spaced Repetition):** Integrated SuperMemo-2 (SM-2) algorithm tracks your memory retention and tells you exactly when you need to review specific topics.
- 🎮 **Gamification System:** Earn Points, maintain Daily Streaks, and climb the Ranks (from *Baguhan* to *Pantas*) to stay motivated.
- 📱 **Mobile-First PWA:** Designed to feel like a native mobile app, complete with bottom-tab navigation and touch-friendly interfaces.
- 🌙 **Dark Mode:** A beautiful, sleek dark mode for late-night studying.

## 🛠️ Technologies Used

GabayAral was built with a modern, high-performance tech stack:

- **Framework:** Next.js 16 (App Router) with React 19
- **Styling:** Tailwind CSS v4 (with custom CSS variables and Dark Mode)
- **AI Integration:** Google Gemini 3.5 Flash (via `@google/genai` SDK) for lightning-fast, highly contextual responses.
- **Icons & UI:** Lucide React for crisp SVG iconography.
- **State Management:** React Context API + LocalStorage for seamless offline-capable persistence.
- **Mathematics Rendering:** `react-markdown` + `rehype-katex` + `remark-math` for beautiful textbook-quality equations.
- - **AI USED:** `We use anti-gravity ide for this project and use recommendations from gemini ai from google.

## 🚀 Getting Started

To run GabayAral locally on your machine, follow these steps:

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yanyansaurus/GabayAral.git
   cd GabayAral
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser. (For the best experience, emulate a mobile device using Chrome DevTools).

## 👥 The Team

GabayAral was built with ❤️ during the TechSprint Hackathon by:

- **Adriane Nathaniel Peña (yanyansaurus)** — Full Stack Developer & AI Integration
- **Raineer Cura** — Team Member
- **Brent Verdera** — Team Member
- **Joseph Cabuhat** — Team Member

---

*Made to empower the next generation of Filipino learners.*
