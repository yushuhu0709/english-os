"use client";

// IndexedDB storage for binary data: learner recordings, imported human reference
// audio, and ELSA screenshots. Nothing leaves the browser.

const DB_NAME = "english-os";
const DB_VERSION = 1;

export interface RecordingMeta {
  id: string;
  day: number;
  round: number;
  itemId: string;
  text: string;
  mime: string;
  createdAt: string;
  durationMs: number;
}

export interface RecordingRow extends RecordingMeta {
  blob: Blob;
}

export interface RefAudioRow {
  key: string; // normalised text
  blob: Blob;
  mime: string;
  name: string;
  addedAt: string;
}

export interface ImageRow {
  id: string;
  blob: Blob;
  mime: string;
  name: string;
  addedAt: string;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("recordings")) {
        const st = db.createObjectStore("recordings", { keyPath: "id" });
        st.createIndex("day", "day");
        st.createIndex("itemId", "itemId");
      }
      if (!db.objectStoreNames.contains("refAudio")) db.createObjectStore("refAudio", { keyPath: "key" });
      if (!db.objectStoreNames.contains("images")) db.createObjectStore("images", { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(store, mode);
        const req = fn(t.objectStore(store));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }),
  );
}

export const normKey = (text: string) => text.trim().toLowerCase().replace(/\s+/g, " ");

// Lets the automatic backup (lib/backup.ts) know a new file is waiting.
const announce = <T>(p: Promise<T>) => p.then((v) => { window.dispatchEvent(new Event("english-os:file-saved")); return v; });

export const saveRecording = (row: RecordingRow) => announce(tx("recordings", "readwrite", (s) => s.put(row)));
export const getRecording = (id: string) => tx<RecordingRow | undefined>("recordings", "readonly", (s) => s.get(id));
export const deleteRecording = (id: string) => tx("recordings", "readwrite", (s) => s.delete(id));
export const allRecordings = () => tx<RecordingRow[]>("recordings", "readonly", (s) => s.getAll());

export const saveRefAudio = (row: RefAudioRow) => announce(tx("refAudio", "readwrite", (s) => s.put(row)));
export const getRefAudio = (text: string) => tx<RefAudioRow | undefined>("refAudio", "readonly", (s) => s.get(normKey(text)));
export const deleteRefAudio = (text: string) => announce(tx("refAudio", "readwrite", (s) => s.delete(normKey(text))));
export const allRefAudio = () => tx<RefAudioRow[]>("refAudio", "readonly", (s) => s.getAll());

export const saveImage = (row: ImageRow) => announce(tx("images", "readwrite", (s) => s.put(row)));
export const getImage = (id: string) => tx<ImageRow | undefined>("images", "readonly", (s) => s.get(id));
export const deleteImage = (id: string) => tx("images", "readwrite", (s) => s.delete(id));
export const allImages = () => tx<ImageRow[]>("images", "readonly", (s) => s.getAll());

// ── backup helpers ───────────────────────────────────────────────
export async function blobToDataUrl(b: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(b);
  });
}

export async function dataUrlToBlob(url: string): Promise<Blob> {
  const res = await fetch(url);
  return res.blob();
}
