import { forbidden, isLocalRequest, readLatest } from "@/lib/backupServer";
import { lastSent, notificationsSupported, notify, reminderText } from "@/lib/reminderServer";
import type { AppState } from "@/lib/store";

// Daily practice reminder. See lib/reminderServer.ts.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET  → { supported, lastSent }
export async function GET(req: Request) {
  if (!isLocalRequest(req)) return forbidden();
  return Response.json({ supported: notificationsSupported(), lastSent: await lastSent() });
}

// POST { action: "test" } → shows the reminder notification right now
export async function POST(req: Request) {
  if (!isLocalRequest(req)) return forbidden();
  const body = await req.json().catch(() => ({}));
  if (body?.action !== "test") return Response.json({ error: "unknown action" }, { status: 400 });
  const latest = await readLatest();
  const ok = await notify("English OS · 测试提醒", reminderText((latest?.state ?? {}) as Partial<AppState>));
  return Response.json({ ok, supported: notificationsSupported() });
}
