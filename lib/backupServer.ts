import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

// Server side of the automatic backup. The app runs on your own Mac, so the Next
// server can write plain files into a folder in your home directory:
//
//   ~/English OS 备份/
//     progress-latest.json        newest copy of all progress (no API key)
//     daily/progress-YYYY-MM-DD.json   one snapshot per day, last 60 kept
//     recordings/  refAudio/  images/  one file per item plus a .json sidecar
//
// Override the folder with ENGLISH_OS_BACKUP_DIR.

export const KINDS = ["recordings", "refAudio", "images"] as const;
export type Kind = (typeof KINDS)[number];

const KEEP_DAILY = 60;

export function backupDir() {
  return process.env.ENGLISH_OS_BACKUP_DIR || path.join(os.homedir(), "English OS 备份");
}

// Only answer requests addressed to this machine. Blocks other devices on the
// network and DNS-rebinding pages from writing into the backup folder.
export function isLocalRequest(req: Request) {
  const host = (req.headers.get("host") ?? "").replace(/:\d+$/, "").replace(/^\[|\]$/g, "");
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

export function forbidden() {
  return Response.json({ error: "自动备份只接受本机（localhost）的请求。" }, { status: 403 });
}

async function writeAtomic(file: string, data: string | Uint8Array) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, data);
  await fs.rename(tmp, file);
}

export function localDate(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export async function saveState(state: unknown) {
  const dir = backupDir();
  const savedAt = new Date().toISOString();
  const json = JSON.stringify({ app: "english-os", kind: "auto-backup", savedAt, state }, null, 1);
  await writeAtomic(path.join(dir, "progress-latest.json"), json);
  await writeAtomic(path.join(dir, "daily", `progress-${localDate()}.json`), json);
  const daily = (await fs.readdir(path.join(dir, "daily"))).filter((f) => /^progress-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
  for (const f of daily.slice(0, Math.max(0, daily.length - KEEP_DAILY))) await fs.unlink(path.join(dir, "daily", f)).catch(() => {});
  return savedAt;
}

export async function readLatest(): Promise<{ savedAt: string; state: unknown } | null> {
  try {
    const raw = JSON.parse(await fs.readFile(path.join(backupDir(), "progress-latest.json"), "utf8"));
    return { savedAt: raw.savedAt, state: raw.state };
  } catch {
    return null;
  }
}

// File names: readable prefix + short hash, so any id (including refAudio keys,
// which are free text) maps to one safe, stable name.
export function fileBase(id: string) {
  const readable = id.replace(/[^A-Za-z0-9._-]+/g, "_").slice(0, 60);
  const hash = createHash("sha1").update(id).digest("hex").slice(0, 10);
  return `${readable}-${hash}`;
}

const EXT: Record<string, string> = {
  "audio/webm": "webm", "audio/mp4": "m4a", "audio/mpeg": "mp3", "audio/wav": "wav", "audio/x-wav": "wav", "audio/ogg": "ogg", "audio/aac": "aac",
  "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/heic": "heic",
};
const extFor = (mime: string) => EXT[mime.split(";")[0].trim()] ?? "bin";

export interface FileMeta {
  id: string;
  file: string;
  mime: string;
  savedAt: string;
  meta: Record<string, unknown>;
}

export async function listFiles(kind: Kind): Promise<FileMeta[]> {
  const dir = path.join(backupDir(), kind);
  let names: string[] = [];
  try { names = await fs.readdir(dir); } catch { return []; }
  const out: FileMeta[] = [];
  for (const n of names.filter((x) => x.endsWith(".json"))) {
    try { out.push(JSON.parse(await fs.readFile(path.join(dir, n), "utf8"))); } catch { /* skip broken sidecar */ }
  }
  return out;
}

export async function saveFile(kind: Kind, id: string, mime: string, bytes: Uint8Array, meta: Record<string, unknown>) {
  const base = fileBase(id);
  const file = `${base}.${extFor(mime)}`;
  const dir = path.join(backupDir(), kind);
  await writeAtomic(path.join(dir, file), bytes);
  const sidecar: FileMeta = { id, file, mime, savedAt: new Date().toISOString(), meta };
  await writeAtomic(path.join(dir, `${base}.json`), JSON.stringify(sidecar, null, 1));
}

export async function readFile(kind: Kind, id: string): Promise<{ mime: string; bytes: Buffer } | null> {
  const dir = path.join(backupDir(), kind);
  try {
    const side = JSON.parse(await fs.readFile(path.join(dir, `${fileBase(id)}.json`), "utf8")) as FileMeta;
    return { mime: side.mime, bytes: await fs.readFile(path.join(dir, side.file)) };
  } catch {
    return null;
  }
}
