import { getGeminiClient, GABAY_SYSTEM_INSTRUCTION, GEMINI_MODEL } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, image, mimeType, educationLevel, history, studentName, language, school, mode } = await req.json();

    if (!message && !image) {
      return NextResponse.json({ error: "Message or image is required" }, { status: 400 });
    }

    const level = educationLevel || "SHS";
    const genAI = getGeminiClient();

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: GABAY_SYSTEM_INSTRUCTION(level, studentName, language, school, mode),
    });

    // Build chat history for Gemini
    let geminiHistory = (history || []).map(
      (msg: any) => {
        const parts: any[] = [{ text: msg.content || "Uploaded an image." }];
        if (msg.image) {
          // Remove data url prefix if it exists
          const base64Data = msg.image.includes(",") ? msg.image.split(",")[1] : msg.image;
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType: msg.mimeType || "image/jpeg",
            },
          });
        }
        return {
          role: msg.role === "user" ? "user" : "model",
          parts,
        };
      }
    );

    // Gemini API requires the first message in history to be from the 'user'
    if (geminiHistory.length > 0 && geminiHistory[0].role === "model") {
      geminiHistory = geminiHistory.slice(1);
    }

    const chat = model.startChat({ history: geminiHistory });

    // Build the current message parts
    const currentParts: any[] = [];
    if (message) currentParts.push({ text: message });
    else if (image) currentParts.push({ text: "Please analyze this image." });
    
    if (image) {
      const base64Data = image.includes(",") ? image.split(",")[1] : image;
      currentParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType || "image/jpeg",
        },
      });
    }

    const result = await chat.sendMessage(currentParts);
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
