"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PlayButton, RefAudioImport } from "@/components/Audio";
import { allRefAudio, normKey, saveRefAudio } from "@/lib/audioDb";
import { courseTexts, KIND_LABEL, matchFile, scriptCsv, type ModelText } from "@/lib/audioLibrary";
import { stopAll } from "@/lib/tts";
import { useHydrated } from "@/lib/useHydrated";

type Filter = "missing" | "short" | "all";
interface Pending { file: File; match: string | null } // match = ModelText.key

const AUDIO_EXT = /\.(mp3|m4a|aac|wav|aif|aiff|ogg|oga|opus|webm|flac|caf)$/i;

export default function AudioLibraryPage() {
  const h = useHydrated();
  const texts = useMemo(() => courseTexts(), []);
  const byKey = useMemo(() => new Map(texts.map((t) => [t.key, t])), [texts]);
  const [have, setHave] = useState<Set<string>>(new Set());
  const [rev, setRev] = useState(0); // bump to refresh per-row import buttons
  const [filter, setFilter] = useState<Filter>("missing");
  const [day, setDay] = useState<number | 0>(0);
  const [pending, setPending] = useState<Pending[]>([]);
  const [saved, setSaved] = useState<number | null>(null);
  const files = useRef<HTMLInputElement>(null);
  const folder = useRef<HTMLInputElement>(null);

  async function refresh() {
    try { setHave(new Set((await allRefAudio()).map((r) => r.key))); } catch { setHave(new Set()); }
    setRev((r) => r + 1);
  }
  useEffect(() => {
    refresh();
    const on = () => refresh();
    window.addEventListener("english-os:file-saved", on);
    return () => window.removeEventListener("english-os:file-saved", on);
  }, []);
  useEffect(() => {
    folder.current?.setAttribute("webkitdirectory", "");
  }, [h]);

  if (!h) return <div className="page-head"><h1>真人示范音频</h1><p className="muted">加载中…</p></div>;

  const covered = texts.filter((t) => have.has(t.key)).length;
  const shortAll = texts.filter((t) => t.short);
  const shortCovered = shortAll.filter((t) => have.has(t.key)).length;
  const days = [...new Set(texts.map((t) => t.day))];
  const shown = texts.filter((t) =>
    (day === 0 || t.day === day) &&
    (filter === "all" || (filter === "missing" ? !have.has(t.key) : t.short)),
  );

  function pick(list: FileList | null) {
    if (!list) return;
    const audio = [...list].filter((f) => f.type.startsWith("audio/") || AUDIO_EXT.test(f.name));
    setSaved(null);
    setPending(audio.map((file) => ({ file, match: matchFile(file.name, texts)?.key ?? null })));
    if (files.current) files.current.value = "";
    if (folder.current) folder.current.value = "";
  }

  async function importAll() {
    let n = 0;
    for (const p of pending) {
      if (!p.match) continue;
      await saveRefAudio({ key: normKey(byKey.get(p.match)!.text), blob: p.file, mime: p.file.type || "audio/mpeg", name: p.file.name, addedAt: new Date().toISOString() });
      n++;
    }
    setPending([]);
    setSaved(n);
    refresh();
  }

  function downloadScript() {
    const blob = new Blob(["﻿" + scriptCsv(texts)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "english-os-录音清单.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  const matched = pending.filter((p) => p.match).length;
  const dupes = new Set(pending.map((p) => p.match).filter((k, i, a) => k && a.indexOf(k) !== i));

  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Audio Library</div>
        <h1>真人示范音频</h1>
        <p>导入真人英式（SSBE）录音后，课程、复习和 Pronunciation Lab 会优先播放真人声音，没有的再用 Mac 的英式合成声音。录音只存在这台电脑上，并会自动备份。</p>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="card flat"><div className="stat"><b>{covered} / {texts.length}</b><span>已有真人音频</span></div></div>
        <div className="card flat"><div className="stat"><b>{shortCovered} / {shortAll.length}</b><span>短课要用的</span></div></div>
        <div className="card flat"><div className="stat"><b>{texts.length - covered}</b><span>还在用合成声音</span></div></div>
      </div>

      <section className="card" style={{ marginBottom: 16 }}>
        <h3>批量导入</h3>
        <ol className="small" style={{ marginTop: 0 }}>
          <li>下载录音清单，按清单录音或剪辑片段。请一位英式口音的老师或朋友照着读，或者从你有权使用的课程里剪出对应句子。</li>
          <li>文件名用清单第一列的编号，例如 <code>d2-l1.m4a</code>；也可以直接用句子本身做文件名，例如 <code>sheep ship leave live.mp3</code>。</li>
          <li>选择文件或整个文件夹，确认匹配结果，再点导入。同一句再次导入会替换旧的。</li>
        </ol>
        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <button className="btn" onClick={downloadScript}>⬇ 下载录音清单（CSV）</button>
          <input ref={files} type="file" accept="audio/*" multiple hidden onChange={(e) => pick(e.target.files)} data-testid="audio-files" />
          <input ref={folder} type="file" multiple hidden onChange={(e) => pick(e.target.files)} />
          <button className="btn primary" onClick={() => files.current?.click()}>选择音频文件</button>
          <button className="btn" onClick={() => folder.current?.click()}>选择整个文件夹</button>
        </div>
        {saved !== null ? <div className="notice ok" style={{ marginTop: 12 }}>已导入 {saved} 段真人音频。</div> : null}

        {pending.length ? (
          <div style={{ marginTop: 14 }}>
            <p className="small">找到 {pending.length} 个音频文件，其中 {matched} 个已匹配。没匹配上的可以在右边手动选择对应的句子，选「跳过」就不导入。</p>
            <table className="t">
              <thead><tr><th>文件</th><th>对应的句子</th><th></th></tr></thead>
              <tbody>
                {pending.map((p, i) => (
                  <tr key={i}>
                    <td className="small">{p.file.name}</td>
                    <td>
                      <select
                        className="input"
                        value={p.match ?? ""}
                        aria-label={`${p.file.name} 对应的句子`}
                        onChange={(e) => setPending((ps) => ps.map((x, j) => (j === i ? { ...x, match: e.target.value || null } : x)))}
                      >
                        <option value="">跳过</option>
                        {texts.map((t) => <option key={t.key} value={t.key}>{t.id} · {t.text.length > 60 ? t.text.slice(0, 60) + "…" : t.text}</option>)}
                      </select>
                      {p.match && dupes.has(p.match) ? <div className="tiny" style={{ color: "var(--warn)" }}>有多个文件对应这一句，只会保留最后一个。</div> : null}
                      {p.match && have.has(p.match) ? <div className="tiny muted">这一句已有真人音频，导入后会替换。</div> : null}
                    </td>
                    <td>
                      <button className="btn sm" onClick={() => { stopAll(); new Audio(URL.createObjectURL(p.file)).play().catch(() => {}); }}>▶ 试听</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="row" style={{ gap: 8, marginTop: 10 }}>
              <button className="btn primary" disabled={!matched} onClick={importAll}>导入 {matched} 段</button>
              <button className="btn ghost" onClick={() => setPending([])}>取消</button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="card">
        <div className="row between" style={{ flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          <h3 style={{ margin: 0 }}>全部示范句</h3>
          <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
            {(["missing", "short", "all"] as Filter[]).map((f) => (
              <button key={f} className={`btn sm ${filter === f ? "dark" : ""}`} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {f === "missing" ? "缺真人音频" : f === "short" ? "短课要用的" : "全部"}
              </button>
            ))}
            <select className="input" style={{ width: "auto" }} value={day} onChange={(e) => setDay(Number(e.target.value))} aria-label="按天筛选">
              <option value={0}>所有天</option>
              {days.map((d) => <option key={d} value={d}>Day {d}</option>)}
            </select>
          </div>
        </div>
        {shown.length ? (
          <table className="t">
            <thead><tr><th>编号</th><th>句子</th><th>类型</th><th>示范</th><th>真人音频</th></tr></thead>
            <tbody>
              {shown.map((t: ModelText) => (
                <tr key={t.key}>
                  <td className="tiny muted" style={{ whiteSpace: "nowrap" }}>{t.id}</td>
                  <td>{t.text}{t.short ? <span className="badge" style={{ marginLeft: 6 }}>短课</span> : null}</td>
                  <td className="tiny" style={{ whiteSpace: "nowrap" }}>Day {t.day} · {KIND_LABEL[t.kind]}</td>
                  <td><PlayButton key={`${t.key}-${rev}`} text={t.text} showSource /></td>
                  <td><RefAudioImport key={`${t.key}-${rev}`} text={t.text} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="small muted" style={{ margin: 0 }}>{filter === "missing" ? "这里的句子都已经有真人音频了。" : "没有符合条件的句子。"}</p>
        )}
      </section>

      <p className="tiny muted" style={{ marginTop: 16 }}>
        只导入你自己录的、别人同意给你用的，或你购买的课程里允许个人学习使用的音频。真人音频不会上传到任何地方。
      </p>
    </div>
  );
}
