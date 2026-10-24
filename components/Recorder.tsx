"use client";

import { useEffect, useRef, useState } from "react";
import { deleteRecording, getRecording, saveRecording, type RecordingRow } from "@/lib/audioDb";
import { uid } from "@/lib/store";
import { playBlob, stopAll } from "@/lib/tts";

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  for (const m of ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"]) {
    if (MediaRecorder.isTypeSupported?.(m)) return m;
  }
  return "";
}

export type MicState = "idle" | "recording" | "denied" | "unsupported";

// Records from the microphone into IndexedDB. The parent decides where the id is referenced.
export function Recorder({
  day,
  round,
  itemId,
  text,
  takes,
  onSaved,
  onDeleted,
  maxSeconds = 60,
}: {
  day: number;
  round: number;
  itemId: string;
  text: string;
  takes: string[];
  onSaved: (id: string) => void;
  onDeleted?: (id: string) => void;
  maxSeconds?: number;
}) {
  const [state, setState] = useState<MicState>("idle");
  const [secs, setSecs] = useState(0);
  const rec = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const started = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined")) setState("unsupported");
    return () => {
      if (timer.current) clearInterval(timer.current);
      rec.current?.stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function start() {
    stopAll();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const mime = pickMime();
      const mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunks.current = [];
      mr.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        if (timer.current) clearInterval(timer.current);
        const blob = new Blob(chunks.current, { type: mr.mimeType || mime || "audio/webm" });
        const row: RecordingRow = {
          id: uid("rec"),
          day,
          round,
          itemId,
          text,
          mime: blob.type,
          createdAt: new Date().toISOString(),
          durationMs: Date.now() - started.current,
          blob,
        };
        if (blob.size > 0) {
          await saveRecording(row);
          onSaved(row.id);
        }
        setState("idle");
        setSecs(0);
      };
      rec.current = mr;
      started.current = Date.now();
      mr.start(250);
      setState("recording");
      timer.current = setInterval(() => {
        const s = Math.floor((Date.now() - started.current) / 1000);
        setSecs(s);
        if (s >= maxSeconds) mr.state === "recording" && mr.stop();
      }, 250);
    } catch (e) {
      console.warn(e);
      setState("denied");
    }
  }

  function stop() {
    if (rec.current?.state === "recording") rec.current.stop();
  }

  if (state === "unsupported") return <div className="notice bad small">这个浏览器不支持录音。请使用最新版 Chrome、Edge 或 Safari，并通过 http://localhost 打开。</div>;

  return (
    <div className="stack" style={{ gap: 8 }}>
      <div className="row">
        {state === "recording" ? (
          <button className="btn rec on" onClick={stop}>■ 停止录音 · {secs}s</button>
        ) : (
          <button className="btn rec" onClick={start}>● 录音</button>
        )}
        {state === "denied" ? <span className="badge bad">麦克风未授权：请在浏览器地址栏允许麦克风</span> : null}
      </div>
      {takes.length ? (
        <div className="row small">
          {takes.map((id, i) => (
            <TakeChip key={id} id={id} index={i + 1} onDelete={onDeleted ? () => { deleteRecording(id); onDeleted(id); } : undefined} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function TakeChip({ id, index, onDelete, label }: { id: string; index?: number; onDelete?: () => void; label?: string }) {
  const [busy, setBusy] = useState(false);
  const [gone, setGone] = useState(false);
  async function play() {
    const r = await getRecording(id);
    if (!r) { setGone(true); return; }
    setBusy(true);
    await playBlob(r.blob);
    setBusy(false);
  }
  if (gone) return <span className="badge bad">录音已丢失</span>;
  return (
    <span className="row" style={{ gap: 2, display: "inline-flex" }}>
      <button className="btn sm" onClick={play}>{busy ? "♪" : "▶"} {label ?? `第 ${index} 次`}</button>
      {onDelete ? <button className="btn ghost sm" onClick={onDelete} aria-label="删除录音">×</button> : null}
    </span>
  );
}

export async function playRecording(id: string) {
  const r = await getRecording(id);
  if (r) await playBlob(r.blob);
  return !!r;
}
