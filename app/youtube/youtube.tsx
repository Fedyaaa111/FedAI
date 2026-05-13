import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { url, language } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an AI assistant.

Task:
- Analyze this YouTube URL: ${url}
- Create a structured step-by-step explanation
- Output language: ${language}

FORMAT:
Step 1: explanation paragraph

Step 2: explanation paragraph

Step 3: explanation paragraph

Final summary:
short conclusion
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ prompt: text });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed" },
      { status: 500 }
    );
  }
}
