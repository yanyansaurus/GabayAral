import { getGeminiClient, GEMINI_MODEL } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { subject, topic, description, educationLevel, sourceText, count } = await req.json();

    if (!topic && !sourceText) {
      return NextResponse.json({ error: "Topic or Note content is required" }, { status: 400 });
    }

    const genAI = getGeminiClient();
    const flashcardCount = count || 10;
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: `You are an expert curriculum developer generating high-quality flashcards. ALWAYS respond with valid JSON containing exactly ${flashcardCount} flashcards.`,
    });

    const levelStr = educationLevel || "High School";
    
    let prompt = `Generate ${flashcardCount} flashcards for a ${levelStr} student studying ${subject || "General Education"}.\n`;
    
    if (sourceText) {
      prompt += `Base the flashcards strictly on the following study notes:\n"""\n${sourceText}\n"""\n`;
      if (topic) prompt += `\nThe general topic of these notes is: ${topic}\n`;
    } else {
      prompt += `Topic: ${topic}\n`;
    }

    if (description) {
      prompt += `Specific Focus/Instructions: ${description}\n`;
    }

    prompt += `
The flashcards should cover key concepts, vocabulary, definitions, or formulas related to the material.
The "front" should be a clear, concise question or term.
The "back" should be the direct answer or definition (keep it relatively brief but informative).

Output exactly in this JSON format:
{
  "flashcards": [
    {
      "front": "Question or Term here",
      "back": "Answer or Definition here"
    }
  ]
}

Ensure the output is raw valid JSON. Do not include markdown codeblocks (\`\`\`json) or any other text.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean up potential markdown formatting from Gemini response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from AI");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!parsed.flashcards || !Array.isArray(parsed.flashcards)) {
      throw new Error("Invalid schema from AI");
    }

    // Limit to requested count in case AI generates more
    const cardsToReturn = parsed.flashcards.slice(0, flashcardCount);

    return NextResponse.json({ flashcards: cardsToReturn });
  } catch (error) {
    console.error("Generate flashcards error:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards. Please try again." },
      { status: 500 }
    );
  }
}
