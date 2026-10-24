import { AI_SYSTEM } from "@/lib/coach";

// Optional AI coach. Runs on your own machine (next dev / next start) and forwards
// the text-only question to the Anthropic Messages API. The key comes from the
// ANTHROPIC_API_KEY environment variable or from the key saved in your browser.

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { question?: string; context?: string; model?: string } | null;
  const key = process.env.ANTHROPIC_API_KEY || req.headers.get("x-user-api-key") || "";
  if (!key) return Response.json({ error: "没有配置 API key。在 AI Coach 页面的设置里填写，或设置环境变量 ANTHROPIC_API_KEY。" }, { status: 400 });
  if (!body?.question?.trim()) return Response.json({ error: "问题为空" }, { status: 400 });

  const model = body.model || process.env.ENGLISH_OS_MODEL || "claude-sonnet-5-5";
  const content = body.context ? `学习记录（来自 English OS 本地数据）：\n${body.context}\n\n问题：${body.question}` : body.question;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: 1500, system: AI_SYSTEM, messages: [{ role: "user", content }] }),
    });
    const data = await res.json();
    if (!res.ok) return Response.json({ error: data?.error?.message ?? `API 错误 ${res.status}` }, { status: res.status });
    const text = (data.content ?? []).filter((b: { type: string }) => b.type === "text").map((b: { text: string }) => b.text).join("\n");
    return Response.json({ text, model: data.model ?? model });
  } catch (e) {
    return Response.json({ error: `无法连接 Anthropic API：${(e as Error).message}` }, { status: 502 });
  }
}
