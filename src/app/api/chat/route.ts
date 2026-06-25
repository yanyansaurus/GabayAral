import { getGeminiClient, GABAY_SYSTEM_INSTRUCTION } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, educationLevel, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const level = educationLevel || "SHS";
    const genAI = getGeminiClient();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: GABAY_SYSTEM_INSTRUCTION(level),
    });

    // Build chat history for Gemini
    const geminiHistory = (history || []).map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })
    );

    const chat = model.startChat({ history: geminiHistory });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to get response from Gabay AI. Please try again." },
      { status: 500 }
    );
  }
}
