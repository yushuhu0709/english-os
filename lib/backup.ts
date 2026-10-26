"use client";

import { useSyncExternalStore } from "react";
import { allImages, allRecordings, allRefAudio, saveImage, saveRecording, saveRefAudio, type ImageRow, type RecordingRow, type RefAudioRow } from "./audioDb";
import { getState, replaceState, type AppState } from "./store";

// Client side of the automatic backup (server side: lib/backupServer.ts).
// After every change to progress, and whenever a new recording appears, the app
// copies it to a folder on this Mac through the local Next server. Nothing is
// sent anywhere else. The API key is never included.

export interface BackupStatus {
  phase: "idle" | "saving" | "ok" | "error" | "unavailable";
  dir?: string;
  savedAt?: string;
  files?: number;
  message?: string;
}

let status: BackupStatus = { phase: "idle" };
const listeners = new Set<() => void>();
function setStatus(next: BackupStatus) {
  status = next;
  listeners.forEach((l) => l());
}
export function useBackupStatus(): BackupStatus {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => status,
    () => status,
  );
}

export function stripSecrets(s: AppState): AppState {
  const { apiKey: _omit, ...settings } = s.settings;
  void _omit;
  return { ...s, settings };
}

type ServerFiles = Record<"recordings" | "refAudio" | "images", { id: string }[]>;

async function serverStatus(): Promise<{ dir: string; savedAt: string | null; files: ServerFiles } | null> {
  const res = await fetch("/api/backup", { cache: "no-store" }).catch(() => null);
  if (!res || res.status === 404) return null;
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `HTTP ${res.status}`);
  return res.json();
}

async function upload(kind: keyof ServerFiles, id: string, blob: Blob, meta: Record<string, unknown>) {
  const fd = new FormData();
  fd.append("file", blob);
  fd.append("meta", JSON.stringify(meta));
  const res = await fetch(`/api/backup/file?kind=${kind}&id=${encodeURIComponent(id)}`, { method: "POST", body: fd });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `HTTP ${res.status}`);
}

let running: Promise<void> | null = null;
let again = false;

// Save progress, then upload any recordings / reference audio / screenshots the
// folder does not have yet. Calls made while one is running are coalesced.
export function backupNow(): Promise<void> {
  if (running) { again = true; return running; }
  running = (async () => {
    try {
      do {
        again = false;
        await runOnce();
      } while (again);
    } finally {
      running = null;
    }
  })();
  return running;
}

async function runOnce() {
  setStatus({ ...status, phase: "saving" });
  try {
    const st = await serverStatus();
    if (!st) { setStatus({ phase: "unavailable", message: "当前运行方式不支持自动备份（需要在本机用 npm start 运行）。" }); return; }
    const res = await fetch("/api/backup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state: stripSecrets(getState()) }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);

    const have = (k: keyof ServerFiles) => new Set(st.files[k]?.map((f) => f.id) ?? []);
    const hasRec = have("recordings"), hasRef = have("refAudio"), hasImg = have("images");
    let uploaded = 0;
    for (const r of await allRecordings()) {
      if (hasRec.has(r.id)) continue;
      const { blob, ...meta } = r;
      await upload("recordings", r.id, blob, meta);
      uploaded++;
    }
    for (const r of await allRefAudio()) {
      if (hasRef.has(r.key)) continue;
      const { blob, ...meta } = r;
      await upload("refAudio", r.key, blob, meta);
      uploaded++;
    }
    for (const r of await allImages()) {
      if (hasImg.has(r.id)) continue;
      const { blob, ...meta } = r;
      await upload("images", r.id, blob, meta);
      uploaded++;
    }
    const files = hasRec.size + hasRef.size + hasImg.size + uploaded;
    setStatus({ phase: "ok", dir: body.dir ?? st.dir, savedAt: body.savedAt, files });
  } catch (e) {
    setStatus({ ...status, phase: "error", message: (e as Error).message });
  }
}

// Restore from the backup folder: progress is replaced, files are merged back
// into this browser. The API key saved in this browser is kept.
export async function restoreFromBackup(): Promise<string> {
  const res = await fetch("/api/backup?state=1", { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as { state: AppState | null; savedAt: string | null; files: Record<keyof ServerFiles, { id: string; meta: Record<string, unknown>; mime: string }[]> };
  if (!data.state) throw new Error("备份文件夹里还没有进度备份。");
  let n = 0;
  const fetchBlob = async (kind: keyof ServerFiles, id: string) => {
    const r = await fetch(`/api/backup/file?kind=${kind}&id=${encodeURIComponent(id)}`);
    if (!r.ok) throw new Error(`读取 ${id} 失败`);
    return r.blob();
  };
  for (const f of data.files.recordings ?? []) { await saveRecording({ ...(f.meta as Omit<RecordingRow, "blob">), id: f.id, blob: await fetchBlob("recordings", f.id) }); n++; }
  for (const f of data.files.refAudio ?? []) { await saveRefAudio({ ...(f.meta as Omit<RefAudioRow, "blob">), key: f.id, blob: await fetchBlob("refAudio", f.id) }); n++; }
  for (const f of data.files.images ?? []) { await saveImage({ ...(f.meta as Omit<ImageRow, "blob">), id: f.id, blob: await fetchBlob("images", f.id) }); n++; }
  const cur = getState();
  replaceState({ ...data.state, settings: { ...data.state.settings, apiKey: cur.settings.apiKey } });
  return `已从 ${data.savedAt ? new Date(data.savedAt).toLocaleString() : "备份"} 恢复进度，并恢复 ${n} 个录音和文件。`;
}
