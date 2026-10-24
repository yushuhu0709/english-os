import { forbidden, isLocalRequest, KINDS, readFile, saveFile, type Kind } from "@/lib/backupServer";

// One recording, imported reference audio or screenshot in the backup folder.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 50 * 1024 * 1024;

function params(req: Request): { kind: Kind; id: string } | null {
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") as Kind;
  const id = url.searchParams.get("id") ?? "";
  if (!KINDS.includes(kind) || !id || id.length > 500) return null;
  return { kind, id };
}

export async function GET(req: Request) {
  if (!isLocalRequest(req)) return forbidden();
  const p = params(req);
  if (!p) return Response.json({ error: "参数不对" }, { status: 400 });
  const f = await readFile(p.kind, p.id);
  if (!f) return Response.json({ error: "备份里没有这个文件" }, { status: 404 });
  return new Response(new Uint8Array(f.bytes), { headers: { "content-type": f.mime } });
}

// multipart form: file (blob), meta (JSON string)
export async function POST(req: Request) {
  if (!isLocalRequest(req)) return forbidden();
  const p = params(req);
  if (!p) return Response.json({ error: "参数不对" }, { status: 400 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof Blob)) return Response.json({ error: "缺少文件" }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "文件太大" }, { status: 413 });
  let meta: Record<string, unknown> = {};
  try { meta = JSON.parse(String(form?.get("meta") ?? "{}")); } catch { /* keep empty */ }
  try {
    await saveFile(p.kind, p.id, file.type || "application/octet-stream", new Uint8Array(await file.arrayBuffer()), meta);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: `写入失败：${(e as Error).message}` }, { status: 500 });
  }
}
