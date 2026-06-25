# GabayAral

GabayAral is a Next.js web application built with React and Tailwind CSS. It integrates Google's Generative AI (Gemini) to provide AI-powered tutoring and educational features.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/)
- **UI/Styling:** React 19, Tailwind CSS v4, Lucide React, Recharts
- **AI Integration:** `@google/generative-ai` (Gemini 1.5 Flash)

## Getting Started

Follow these steps to set up the project locally:

### 1. Install Dependencies
Ensure you have Node.js installed, then install the required packages:

```bash
npm install
```

### 2. Configure Environment Variables
You need a Gemini API key to run the AI features. 
Create a `.env` file in the root of the project and add your key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run the Development Server
Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm run start`: Starts the production server
- `npm run lint`: Runs ESLint to check for code issues
