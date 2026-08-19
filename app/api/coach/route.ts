import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type CoachRequest = { grade?: string; exam?: string; subject?: string; goal?: string };

const starterPlan = (grade: string, subject: string, goal: string) => ({
  provider: "starter-plan",
  reply: `Let’s make ${subject} feel like a superpower! Here’s a friendly ${grade} plan for ${goal.toLowerCase()}.`,
  plan: [
    { day: "Today", task: "Try one 8-minute warm-up set", note: "Start with the question that feels easiest." },
    { day: "Tomorrow", task: "Learn one clever pattern", note: "Explain it aloud in your own words." },
    { day: "This week", task: "Take a mini mock", note: "Circle any question you want to revisit with Coach." },
  ],
});

function openAIText(payload: unknown) {
  const data = payload as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
  return data.output_text || data.output?.flatMap((item) => item.content ?? []).map((item) => item.text ?? "").join("\n").trim();
}

function geminiText(payload: unknown) {
  const data = payload as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n").trim();
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CoachRequest;
  const grade = body.grade || "Grade 4";
  const subject = body.subject || "Maths";
  const exam = body.exam || "IMO";
  const goal = body.goal || "my next Olympiad";
  const prompt = `You are Coach Nova, a cheerful, accurate Olympiad coach for Indian school students. Create a compact 3-step study plan for a ${grade} learner preparing ${subject} for SOF ${exam}. Their goal is: ${goal}. Use simple, encouraging language. Return exactly this JSON: {"reply":"one short sentence","plan":[{"day":"Today","task":"...","note":"..."},{"day":"Tomorrow","task":"...","note":"..."},{"day":"This week","task":"...","note":"..."}]}. Do not include Markdown.`;

  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-5.6-luna", input: prompt, reasoning: { effort: "low" }, text: { format: { type: "json_object" } } }),
      });
      if (response.ok) {
        const text = openAIText(await response.json());
        if (text) return NextResponse.json({ ...JSON.parse(text), provider: "OpenAI" });
      }
    } catch { /* Gemini is intentionally tried next. */ }
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.55 } }),
      });
      if (response.ok) {
        const text = geminiText(await response.json());
        if (text) return NextResponse.json({ ...JSON.parse(text), provider: "Gemini" });
      }
    } catch { /* A local plan keeps the demo useful when both providers are unavailable. */ }
  }

  return NextResponse.json(starterPlan(grade, subject, goal));
}
