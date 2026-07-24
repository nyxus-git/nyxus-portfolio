import { NextRequest, NextResponse } from "next/server";

const HF_API_URL =
  "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const hfRes = await fetch(HF_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: text.slice(0, 512),
        options: { wait_for_model: true },
      }),
      // 30 second timeout
      signal: AbortSignal.timeout(30000),
    });

    if (!hfRes.ok) {
      const err = await hfRes.json().catch(() => ({}));
      if (hfRes.status === 503) {
        return NextResponse.json(
          { error: "Model is warming up (~20s). Please try again!" },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: err?.error ?? "HuggingFace API error" },
        { status: hfRes.status }
      );
    }

    const data = await hfRes.json();
    return NextResponse.json({ results: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
