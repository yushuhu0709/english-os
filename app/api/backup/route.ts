import { backupDir, forbidden, isLocalRequest, KINDS, listFiles, readLatest, saveState } from "@/lib/backupServer";

// Automatic backup of progress to a folder on this Mac. See lib/backupServer.ts.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET            → status: folder, last save, which files are already backed up
// GET ?state=1   → also returns the latest saved progress (for restoring)
export async function GET(req: Request) {
  if (!isLocalRequest(req)) return forbidden();
  const url = new URL(req.url);
  const latest = await readLatest();
  const files = Object.fromEntries(
    await Promise.all(KINDS.map(async (k) => [k, (await listFiles(k)).map((f) => ({ id: f.id, meta: f.meta, mime: f.mime }))] as const)),
  );
  return Response.json({
    dir: backupDir(),
    savedAt: latest?.savedAt ?? null,
    files,
    ...(url.searchParams.get("state") ? { state: latest?.state ?? null } : {}),
  });
}

// POST { state } → writes progress-latest.json and today's snapshot
export async function POST(req: Request) {
  if (!isLocalRequest(req)) return forbidden();
  const body = (await req.json().catch(() => null)) as { state?: { version?: number; settings?: Record<string, unknown> } } | null;
  if (!body?.state || body.state.version !== 1) return Response.json({ error: "备份数据格式不对" }, { status: 400 });
  if (body.state.settings) delete body.state.settings.apiKey; // never write the key to disk
  try {
    const savedAt = await saveState(body.state);
    return Response.json({ ok: true, savedAt, dir: backupDir() });
  } catch (e) {
    return Response.json({ error: `写入备份文件夹失败：${(e as Error).message}` }, { status: 500 });
  }
}
