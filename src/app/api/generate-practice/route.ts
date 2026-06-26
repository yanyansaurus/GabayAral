import { getGeminiClient, GEMINI_MODEL } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { subject, topic, description, educationLevel, difficulty } = await req.json();

    if (!subject || !topic) {
      return NextResponse.json({ error: "Subject and topic are required" }, { status: 400 });
    }

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const descContext = description ? `\nSpecific focus/details provided by the student: "${description}"\nMake sure the questions relate to this specific focus.` : "";

    const prompt = `
You are an educational content generator for Filipino ${educationLevel || "SHS"} students.

Generate exactly 5 practice questions about "${topic}" in the subject "${subject}".${descContext}
Difficulty level: ${difficulty || "Medium"}

Create a mix of question types appropriate for ${educationLevel || "SHS"} students.

Respond ONLY with valid JSON in this exact format, no extra text:
{
  "questions": [
    {
      "question": "the question text (use Filipino/Taglish where natural)",
      "type": "multiple_choice",
      "options": ["option A", "option B", "option C", "option D"],
      "answer": "the correct option text",
      "explanation": "brief explanation in Filipino/Taglish of why this is correct",
      "points": 10
    }
  ]
}

Rules:
- All 5 questions must be multiple_choice with exactly 4 options
- Use Filipino/Taglish naturally in questions and explanations
- Make questions appropriate for ${educationLevel || "SHS"} level
- Questions should test understanding, not just memorization
- Include practical, real-world Filipino examples where possible
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from Gemini");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Generate practice error:", error);
    return NextResponse.json(
      { error: "Failed to generate practice questions. Please try again." },
      { status: 500 }
    );
  }
}
