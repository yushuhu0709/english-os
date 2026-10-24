"use client";

import { useState } from "react";

// Optional intelligibility check using the browser's speech recogniser (en-GB).
// It only says what the recogniser *heard*; it cannot judge tongue position or phonemes.

type Rec = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getRecognizer(): Rec | null {
  if (typeof window === "undefined") return null;
  const W = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
  const C = W.SpeechRecognition ?? W.webkitSpeechRecognition;
  return C ? new C() : null;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z' ]/g, " ").replace(/\s+/g, " ").trim();

export function AsrCheck({ target }: { target: string }) {
  const [state, setState] = useState<"idle" | "listening" | "unsupported">("idle");
  const [heard, setHeard] = useState<string[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function run() {
    const r = getRecognizer();
    if (!r) { setState("unsupported"); return; }
    r.lang = "en-GB";
    r.interimResults = false;
    r.maxAlternatives = 3;
    setHeard(null);
    setErr(null);
    r.onresult = (e) => {
      const alts = Array.from(e.results[0] ?? []).map((a) => a.transcript);
      setHeard(alts);
    };
    r.onerror = (e) => setErr(e.error);
    r.onend = () => setState((s) => (s === "listening" ? "idle" : s));
    setState("listening");
    r.start();
  }

  if (state === "unsupported") return <span className="tiny muted">此浏览器不支持语音转写检查</span>;
  const match = heard?.some((h) => norm(h) === norm(target));
  return (
    <span className="row tiny" style={{ gap: 6, display: "inline-flex" }}>
      <button className="btn ghost sm" onClick={run} disabled={state === "listening"} title="用浏览器语音识别看看机器把你的发音听成了什么">
        {state === "listening" ? "正在听…" : "可懂度检查"}
      </button>
      {heard ? (
        <span className={`badge ${match ? "ok" : "warn"}`} title="语音识别结果，仅作可懂度参考，不是音素评分">
          识别为：{heard[0] || "（无）"}
        </span>
      ) : null}
      {err ? <span className="badge bad">{err === "not-allowed" ? "麦克风未授权" : `识别失败：${err}`}</span> : null}
    </span>
  );
}

export const ASR_DISCLAIMER =
  "可懂度检查调用浏览器自带的语音识别（Chrome 会把音频发送到 Google 服务器，Safari 使用 Apple 的识别）。它只告诉你机器把你的话听成了什么，受语境和词频影响，不能判断舌位或单个音素是否准确。";
