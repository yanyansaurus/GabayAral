# GabayAral

GabayAral is a modern, interactive, and AI-powered study companion designed specifically for Filipino students. Built for the Accenture Hackathon, GabayAral addresses the challenge of creating a systematic, recreational, and innovative study buddy application. By integrating Google Gemini's advanced generative AI capabilities, it offers adaptive tutoring, automated study material generation, progress tracking, and personalized lesson recommendations.

---

## 1. Project Overview

GabayAral (literally "Study Guide") serves as a virtual tutor and organizer that adapts to a student's learning level. Upon launching the application, students are greeted with an onboarding system that tailors the learning experience for:
*   **Junior High School** (Grades 7–10)
*   **Senior High School** (Grades 11–12)
*   **College** (Undergraduate)

Through a sleek, glassmorphic dashboard, students can interact with an AI tutor in real-time, convert unstructured notes into study materials, track their study analytics, and receive customized learning recommendations. The application focuses on making learning engaging, personalized, and structured.

---

## 2. Features

*   **Adaptive AI Tutor (`/tutor`)**
    *   Powered by the Google Gemini API.
    *   Provides context-aware tutoring in both English and Filipino.
    *   Adapts explanations, tone, and examples to the user's selected education level (JHS, SHS, College).
*   **AI Notes Converter & Study Guide Generator (`/notes`)**
    *   Converts raw text, study materials, or notes into structured resources.
    *   Generates study summaries, conceptual mind maps (text-based), flashcards, and quizzes.
*   **Interactive Learning Dashboard**
    *   **Learning Stats:** Displays key metrics such as total study hours, notes created, questions asked, and current level progress.
    *   **Weekly Progress Tracker:** A Recharts-powered interactive chart detailing study hours logged per day.
    *   **Student Motivation System:** Displays streak rewards, milestone progress, and a progress bar to keep students motivated.
*   **Personalized Lesson Recommender**
    *   Dynamically suggests relevant topics based on the student's selected academic level.
*   **Accessibility & Personalization**
    *   Built-in text-to-speech, text size adjustment, and display high-contrast options.
    *   A seamless onboarding flow that saves student preferences locally.

---

## 3. Setup Instructions

Follow these instructions to set up the project locally for development:

### Prerequisites
*   Node.js (v18.x or later recommended)
*   npm (v9.x or later)

### 1. Clone and Navigate to the Repository
```bash
git clone <repository-url>
cd GabayAral
```

### 2. Install Dependencies
Install all required Node.js modules:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Linting and Building
*   To check code style and linting issues:
    ```bash
    npm run lint
    ```
*   To build the application for production:
    ```bash
    npm run build
    ```
*   To run the production build locally:
    ```bash
    npm run start
    ```

---

## 4. Technologies Used

*   **Frontend Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
*   **UI Library:** React 19
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Data Visualization:** [Recharts](https://recharts.org/)
*   **AI Engine:** Google Gemini API (via `@google/generative-ai` SDK)

---

## 5. Team Members and Rules

### The Team: Kilabot
*   **Team Representative:** Adriane Peña
*   **Members:** Joseph Cabuhat, Raineer Cura, Brent Verdera

### Team Rules and Git Workflow
To ensure smooth collaboration during the hackathon, the team adheres to the following rules:

1.  **Branch Naming Conventions**
    *   Feature branches must be created from `main`.
    *   Branch names should use snake_case or kebab-case describing the feature (e.g., `login_functions`, `notes-converter-ui`).
2.  **Commit Messages**
    *   Write clear, imperative commit messages (e.g., `feat: add onboarding modal level selection` or `fix: resolve gemini api endpoint issue`).
3.  **Code Consistency**
    *   Verify lint rules before committing (`npm run lint`).
    *   Do not leave debugging logs (`console.log`) in production code.
4.  **Local Testing**
    *   Always verify that the application compiles and runs locally (`npm run dev`) before pushing changes to the remote repository.
