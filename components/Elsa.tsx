"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SKILLS, skillLabel } from "@/content/skills";
import { deleteImage, getImage, saveImage } from "@/lib/audioDb";
import { checkAccentDifference, suggestSkillsForElsa } from "@/lib/elsa";
import { addErrorDraft, currentDay } from "@/lib/progress";
import { uid, update, useAppState, type ElsaEntry } from "@/lib/store";

export function ElsaForm({ day, compact = false }: { day?: number; compact?: boolean }) {
  const s = useAppState();
  const [word, setWord] = useState("");
  const [issue, setIssue] = useState("");
  const [score, setScore] = useState("");
  const [accent, setAccent] = useState<ElsaEntry["accentSetting"]>("unknown");
  const [skills, setSkills] = useState<string[]>([]);
  const [touchedSkills, setTouchedSkills] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const accentHits = useMemo(() => (word || issue ? checkAccentDifference(word, issue) : []), [word, issue]);
  const suggested = useMemo(() => suggestSkillsForElsa(word, issue), [word, issue]);
  useEffect(() => {
    if (!touchedSkills) setSkills(suggested.slice(0, 1));
  }, [suggested, touchedSkills]);

  async function submit() {
    if (!word.trim() && !issue.trim()) return;
    const id = uid("elsa");
    let screenshotId: string | undefined;
    if (file) {
      screenshotId = uid("img");
      await saveImage({ id: screenshotId, blob: file, mime: file.type, name: file.name, addedAt: new Date().toISOString() });
    }
    const accentDifference = accentHits.length > 0 && accent !== "british";
    const theDay = day ?? currentDay(s);
    update((st) => {
      st.elsa.push({
        id,
        createdAt: new Date().toISOString(),
        word: word.trim(),
        issue: issue.trim(),
        score: score ? Number(score) : undefined,
        accentSetting: accent,
        skills,
        accentDifference,
        screenshotId,
        note: note.trim() || undefined,
      });
      if (!accentDifference) {
        for (const sk of skills.length ? skills : ["ipa-basics"]) {
          addErrorDraft(st, { day: theDay, source: "elsa", skill: sk, text: word.trim() || issue.trim(), detail: `ELSA：${issue.trim()}${score ? `（${score}%）` : ""}` });
        }
      }
    });
    setWord(""); setIssue(""); setScore(""); setFile(null); setNote(""); setTouchedSkills(false); setSaved(true);
    if (fileRef.current) fileRef.current.value = "";
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="stack">
      <div className={`grid ${compact ? "grid-2" : "grid-4"}`}>
        <div className="field">
          <label>单词或句子</label>
          <input className="input" value={word} onChange={(e) => setWord(e.target.value)} placeholder="例如 water" />
        </div>
        <div className="field" style={{ gridColumn: compact ? "span 1" : "span 2" }}>
          <label>ELSA 指出的问题</label>
          <input className="input" value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="例如 /t/ sounded like /d/，或 th 发成 s" />
        </div>
        <div className="field">
          <label>ELSA 分数（可选）</label>
          <input className="input" type="number" min={0} max={100} value={score} onChange={(e) => setScore(e.target.value)} placeholder="%" />
        </div>
      </div>
      <div className="row">
        <span className="small muted">ELSA 当时的口音设置：</span>
        {(["british", "american", "unknown"] as const).map((a) => (
          <label key={a} className="row small" style={{ gap: 4 }}>
            <input type="radio" checked={accent === a} onChange={() => setAccent(a)} />
            {a === "british" ? "英式" : a === "american" ? "美式" : "不确定"}
          </label>
        ))}
      </div>
      {accentHits.length ? (
        <div className="notice">
          <b>可能是口音差异，不是 SSBE 错误</b>（规则推断）：
          <ul style={{ margin: "4px 0 0" }}>
            {accentHits.map((h) => <li key={h.id}>{h.why}</li>)}
          </ul>
          {accent === "british" ? <span className="small">你选择了英式设置，所以仍会作为错误记录。</span> : <span className="small">保存后只作记录，不计入弱项和复习。</span>}
        </div>
      ) : null}
      <div className="field">
        <label>归类到训练项目 {suggested.length ? <span className="muted">（已按关键词建议，可修改）</span> : null}</label>
        <div className="row" style={{ gap: 4 }}>
          {SKILLS.map((sk) => (
            <button
              key={sk.id}
              type="button"
              className={`btn sm ${skills.includes(sk.id) ? "dark" : ""}`}
              onClick={() => { setTouchedSkills(true); setSkills((cur) => (cur.includes(sk.id) ? cur.filter((x) => x !== sk.id) : [...cur, sk.id])); }}
            >
              {sk.label} <span className="tiny" style={{ opacity: 0.7 }}>D{sk.day}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="row">
        <input ref={fileRef} type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <input className="input" style={{ flex: 1, minWidth: 200 }} value={note} onChange={(e) => setNote(e.target.value)} placeholder="备注（可选）" />
        <button className="btn primary" onClick={submit} disabled={!word.trim() && !issue.trim()}>保存 ELSA 记录</button>
        {saved ? <span className="badge ok">已保存</span> : null}
      </div>
    </div>
  );
}

export function ElsaList() {
  const s = useAppState();
  if (!s.elsa.length) return <p className="muted small">还没有 ELSA 记录。</p>;
  return (
    <table className="t">
      <thead>
        <tr><th>日期</th><th>内容</th><th>ELSA 指出</th><th>归类</th><th>判定</th><th>截图</th><th></th></tr>
      </thead>
      <tbody>
        {[...s.elsa].reverse().map((e) => (
          <tr key={e.id}>
            <td className="small muted">{new Date(e.createdAt).toLocaleDateString()}</td>
            <td><b>{e.word}</b>{e.score != null ? <span className="tiny muted"> · {e.score}%</span> : null}</td>
            <td className="small">{e.issue}{e.note ? <div className="tiny muted">{e.note}</div> : null}</td>
            <td className="small">{e.skills.map(skillLabel).join("、") || "—"}</td>
            <td>{e.accentDifference ? <span className="badge warn">口音差异</span> : <span className="badge bad">SSBE 错误</span>}</td>
            <td>{e.screenshotId ? <Screenshot id={e.screenshotId} /> : <span className="muted">—</span>}</td>
            <td>
              <button
                className="btn ghost sm danger"
                onClick={() => { if (e.screenshotId) deleteImage(e.screenshotId); update((st) => { st.elsa = st.elsa.filter((x) => x.id !== e.id); }); }}
              >
                删除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Screenshot({ id }: { id: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let u: string | null = null;
    getImage(id).then((r) => { if (r) { u = URL.createObjectURL(r.blob); setUrl(u); } });
    return () => { if (u) URL.revokeObjectURL(u); };
  }, [id]);
  if (!url) return <span className="muted">…</span>;
  return (
    <a href={url} target="_blank" rel="noreferrer">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="ELSA 截图" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, border: "1px solid var(--line)" }} />
    </a>
  );
}
