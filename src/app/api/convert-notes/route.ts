import { getGeminiClient } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { noteContent, noteTitle, educationLevel } = await req.json();

    if (!noteContent) {
      return NextResponse.json({ error: "Note content is required" }, { status: 400 });
    }

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an educational content converter. A ${educationLevel || "SHS"} Filipino student has written the following notes about "${noteTitle || "a lesson"}".

Convert these notes into:
1. Exactly 5-8 flashcards (term/concept on front, explanation on back)
2. Exactly 5 multiple-choice quiz questions (4 options each, mark the correct answer)

Notes content:
"""
${noteContent}
"""

Respond ONLY with valid JSON in this exact format, no extra text:
{
  "flashcards": [
    { "front": "term or concept", "back": "clear explanation" }
  ],
  "quiz": [
    {
      "question": "question text",
      "options": ["option A", "option B", "option C", "option D"],
      "answer": "option A",
      "explanation": "brief explanation of why this is correct"
    }
  ]
}

Make the content appropriate for a ${educationLevel || "SHS"} student.
Use Filipino or Taglish where it helps understanding.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from Gemini");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Convert notes error:", error);
    return NextResponse.json(
      { error: "Failed to convert notes. Please try again." },
      { status: 500 }
    );
  }
}
