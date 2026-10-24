"use client";

import { useEffect, useRef, useState } from "react";
import { deleteRefAudio, getRefAudio, normKey, saveRefAudio } from "@/lib/audioDb";
import { britishVoices, modelSource, playModel, SLOW_RATE, stopAll, type ModelSource } from "@/lib/tts";

const SOURCE_LABEL: Record<ModelSource, string> = {
  human: "真人音频",
  "tts-gb": "英式合成",
  none: "无英式声音",
};

// Play the SSBE model for a piece of text. Shows where the audio comes from.
export function PlayButton({
  text,
  label = "听示范",
  rate,
  onPlayed,
  size = "sm",
  showSource = false,
}: {
  text: string;
  label?: string;
  rate?: number;
  onPlayed?: () => void;
  size?: "sm" | "md";
  showSource?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [src, setSrc] = useState<ModelSource | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (showSource) modelSource(text).then(setSrc);
  }, [text, showSource]);

  async function play() {
    if (busy) {
      stopAll();
      setBusy(false);
      return;
    }
    setBusy(true);
    const s = await playModel(text, rate);
    setBusy(false);
    setSrc(s);
    if (s === "none") setMissing(true);
    else onPlayed?.();
  }

  return (
    <span className="row" style={{ gap: 6, display: "inline-flex" }}>
      <button className={`btn ${size === "sm" ? "sm" : ""}`} onClick={play} aria-label={`${label}: ${text}`}>
        {busy ? "■ 停止" : `▶ ${label}`}
        {rate && rate < 0.8 ? <span className="tiny muted">慢速</span> : null}
      </button>
      {showSource && src ? <span className={`badge ${src === "human" ? "ok" : src === "none" ? "bad" : ""}`}>{SOURCE_LABEL[src]}</span> : null}
      {missing ? <span className="badge bad" title="请在 Pronunciation Lab 的设置里查看如何安装英式声音">未找到 en-GB 声音</span> : null}
    </span>
  );
}

// Normal + slow buttons side by side.
export function ModelPair({ text, onPlayed, showSource }: { text: string; onPlayed?: () => void; showSource?: boolean }) {
  return (
    <span className="row" style={{ gap: 6, display: "inline-flex" }}>
      <PlayButton text={text} onPlayed={onPlayed} showSource={showSource} />
      <PlayButton text={text} label="慢" rate={SLOW_RATE} onPlayed={onPlayed} />
    </span>
  );
}

// Attach a human British recording (e.g. saved from a dictionary's UK audio) to a text.
export function RefAudioImport({ text }: { text: string }) {
  const [has, setHas] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getRefAudio(text).then((r) => setHas(r?.name ?? null)).catch(() => setHas(null));
  }, [text]);

  async function onFile(f: File | undefined) {
    if (!f) return;
    await saveRefAudio({ key: normKey(text), blob: f, mime: f.type, name: f.name, addedAt: new Date().toISOString() });
    setHas(f.name);
  }

  return (
    <span className="row tiny" style={{ gap: 6, display: "inline-flex" }}>
      <input ref={input} type="file" accept="audio/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
      {has ? (
        <>
          <span className="badge ok" title={has}>已导入真人音频</span>
          <button className="btn ghost sm" onClick={async () => { await deleteRefAudio(text); setHas(null); }}>移除</button>
        </>
      ) : (
        <button className="btn ghost sm" onClick={() => input.current?.click()} title="导入一段真人英式录音，之后优先播放它">
          ＋ 导入真人音频
        </button>
      )}
    </span>
  );
}

export function VoiceStatus() {
  const [names, setNames] = useState<string[] | null>(null);
  useEffect(() => {
    britishVoices().then((v) => setNames(v.map((x) => x.name)));
  }, []);
  if (names === null) return null;
  if (!names.length)
    return (
      <div className="notice bad">
        这个浏览器没有找到英式（en-GB）语音，示范音频无法播放。macOS：系统设置 → 辅助功能 → 朗读内容 → 系统声音 → 管理声音，下载 English (UK) 的 Daniel、Serena 或 Kate，然后重新打开浏览器。也可以用 Chrome（自带 Google UK English）。应用不会改用美式声音。
      </div>
    );
  return null;
}
