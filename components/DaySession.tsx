"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { BlockId, DayPlan, QuizItem, ShadowItem, StepId } from "@/content/types";
import { BLOCK_LABEL, BLOCK_OF_STEP, STEP_LABEL, STEP_ORDER } from "@/content/types";
import { SKILL_MAP, SKILLS, matchSkills, skillLabel } from "@/content/skills";
import { TOTAL_DAYS, weekOf } from "@/content/days";
import {
  addError, answerQuiz, canComplete, completeDay, dueReviews, fmtMin, heartbeat, liveBlockMs, liveRoundMs,
  liveTotalMs, pauseTimer, recordReview, requirements, REQUIRED_REPS, resolveError, reviewQuizFor, startNewRound,
  startTimer, stepStatus, switchBlock, upcomingReviews,
} from "@/lib/progress";
import { ensureDay, update, useAppState, type AppState, type DayRecord } from "@/lib/store";
import { useNow } from "@/lib/useHydrated";
import { playModel, stopAll, ttsWeakContrast } from "@/lib/tts";
import { getRecording } from "@/lib/audioDb";
import { ModelPair, PlayButton, RefAudioImport, VoiceStatus } from "./Audio";
import { Recorder, playRecording } from "./Recorder";
import { AsrCheck, ASR_DISCLAIMER } from "./AsrCheck";
import { Visual } from "./Visuals";
import { ElsaForm } from "./Elsa";

const STEP_KEY = (day: number) => `english-os:step:${day}`;

export function DaySession({ plan }: { plan: DayPlan }) {
  const s = useAppState();
  const rec = s.days[plan.day];
  const [step, setStep] = useState<StepId>("learn");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STEP_KEY(plan.day)) as StepId | null;
      if (saved && STEP_ORDER.includes(saved)) setStep(saved);
    } catch { /* ignore */ }
  }, [plan.day]);

  function go(next: StepId) {
    setStep(next);
    stopAll();
    try { localStorage.setItem(STEP_KEY(plan.day), next); } catch { /* ignore */ }
    if (rec?.running) switchBlock(plan.day, BLOCK_OF_STEP[next]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const idx = STEP_ORDER.indexOf(step);

  useEffect(() => {
    (window as unknown as { __plan?: DayPlan }).__plan = plan; // handy for debugging and e2e tests
  }, [plan]);

  return (
    <div>
      <SessionBar plan={plan} rec={rec} step={step} />
      <VoiceStatus />
      <div className="steps" role="tablist">
        {STEP_ORDER.map((k, i) => {
          const st = stepStatus(plan, rec, k, s);
          return (
            <button key={k} className={`step-pill ${step === k ? "active" : ""}`} onClick={() => go(k)} role="tab" aria-selected={step === k}>
              <span className={`dot ${st.complete && (st.total > 0) ? "done" : ""}`} />
              {i + 1}. {STEP_LABEL[k].en}
              <span className="tiny" style={{ opacity: 0.7 }}>{st.done}/{st.total}</span>
            </button>
          );
        })}
      </div>

      {!rec?.running && !rec?.completedAt ? (
        <div className="notice info" style={{ marginBottom: 16 }}>
          计时器没有运行。点上方「开始训练」后，时长才会计入今天的训练记录。
        </div>
      ) : null}

      <div className="eyebrow" style={{ marginBottom: 6 }}>
        {BLOCK_LABEL[BLOCK_OF_STEP[step]].en} · Step {idx + 1} {STEP_LABEL[step].en} · {STEP_LABEL[step].zh}
      </div>

      {step === "learn" && <LearnStep plan={plan} rec={rec} />}
      {step === "listen" && <ListenStep plan={plan} rec={rec} />}
      {step === "identify" && <IdentifyStep plan={plan} rec={rec} />}
      {step === "produce" && <ProduceStep plan={plan} rec={rec} />}
      {step === "record" && <RecordStep plan={plan} rec={rec} />}
      {step === "compare" && <CompareStep plan={plan} rec={rec} />}
      {step === "repeat" && <RepeatStep plan={plan} rec={rec} s={s} />}

      <div className="row between" style={{ marginTop: 22 }}>
        <button className="btn" disabled={idx === 0} onClick={() => go(STEP_ORDER[idx - 1])}>← 上一步</button>
        {idx < STEP_ORDER.length - 1 ? (
          <button className="btn dark" onClick={() => go(STEP_ORDER[idx + 1])}>下一步：{STEP_LABEL[STEP_ORDER[idx + 1]].zh} →</button>
        ) : null}
      </div>

      <CompletionPanel plan={plan} s={s} />
    </div>
  );
}

// ── Session bar: timer, blocks, pause/resume ─────────────────────
function SessionBar({ plan, rec, step }: { plan: DayPlan; rec?: DayRecord; step: StepId }) {
  const running = !!rec?.running;
  const now = useNow(1000, running);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => heartbeat(plan.day), 10000);
    const onHide = () => heartbeat(plan.day);
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onHide);
    return () => { clearInterval(t); window.removeEventListener("pagehide", onHide); document.removeEventListener("visibilitychange", onHide); };
  }, [running, plan.day]);

  const round = rec ? liveRoundMs(rec, now) : 0;
  const target = Object.values(plan.blocks).reduce((a, b) => a + b, 0);
  const block = rec?.activeBlock ?? BLOCK_OF_STEP[step];

  return (
    <div className="session-bar no-print">
      <div className="row between" style={{ marginBottom: 10 }}>
        <div className="row">
          <span className="clock" aria-live="off">{fmtMin(round)}</span>
          <div className="small muted">
            本轮 / 目标 {target} 分钟 · 最少 {plan.minMinutes} 分钟
            {rec && rec.round > 1 ? ` · 第 ${rec.round} 轮` : ""}
            {rec && rec.totalMs > 0 && rec.round > 1 ? ` · 累计 ${fmtMin(liveTotalMs(rec, now))}` : ""}
          </div>
        </div>
        <div className="row">
          {running ? (
            <button className="btn" onClick={() => pauseTimer(plan.day)}>❚❚ 暂停</button>
          ) : (
            <button className="btn primary" onClick={() => startTimer(plan.day, BLOCK_OF_STEP[step])}>
              ▶ {rec?.startedAt ? "继续训练" : "开始训练"}
            </button>
          )}
        </div>
      </div>
      <div className="blocks">
        {(Object.keys(plan.blocks) as BlockId[]).map((b) => {
          const ms = rec ? liveBlockMs(rec, b, now) : 0;
          const pct = Math.min(100, (ms / (plan.blocks[b] * 60000)) * 100);
          return (
            <button key={b} className={`block-tab ${block === b ? "active" : ""}`} onClick={() => running ? switchBlock(plan.day, b) : update((st) => { ensureDay(st, plan.day).activeBlock = b; })}>
              <div className="t1">{BLOCK_LABEL[b].en}</div>
              <div className="t2">{fmtMin(ms)} / {plan.blocks[b]}:00</div>
              <div className="bar" style={{ marginTop: 4 }}><i style={{ width: `${pct}%` }} /></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── marked text renderer ─────────────────────────────────────────
const norm = (w: string) => w.toLowerCase().replace(/[^a-z']/g, "");

// Renders "|" pauses, "‿" links and UPPERCASE stressed syllables. Letters are taken
// from the plain sentence when given, so proper nouns keep their capitals.
export function Marked({ text, original }: { text: string; original?: string }) {
  const orig = (original ?? "").split(/\s+/).flatMap((w) => w.split("‿")).filter(Boolean);
  let oi = 0;
  const parts = text.split(/(\s+|‿|\|)/).filter((p) => p !== "");
  return (
    <span className="marked">
      {parts.map((p, i) => {
        if (p === "|") return <span key={i} className="pause">|</span>;
        if (p === "‿") return <span key={i} className="link">‿</span>;
        if (/^\s+$/.test(p)) return <span key={i}> </span>;
        if (/^[↗↘]+$/.test(p)) return <span key={i} className="pause">{p}</span>;
        const core = p.replace(/[↗↘]/g, "");
        let src = core.toLowerCase();
        const k = orig.findIndex((w, j) => j >= oi && norm(w) === norm(core));
        if (k >= 0 && orig[k].length === core.length) { src = orig[k]; oi = k + 1; }
        const mask = core.split("").map(() => false);
        for (const m of core.matchAll(/[A-Z]{2,}/g)) for (let c = m.index!; c < m.index! + m[0].length; c++) mask[c] = true;
        const out: { t: string; hi: boolean }[] = [];
        core.split("").forEach((_, c) => {
          const ch = src[c] ?? core[c];
          const last = out[out.length - 1];
          if (last && last.hi === mask[c]) last.t += ch;
          else out.push({ t: ch, hi: mask[c] });
        });
        return <span key={i}>{out.map((o, j) => (o.hi ? <span key={j} className="str">{o.t}</span> : <span key={j}>{o.t}</span>))}{p.match(/[↗↘]+/)?.[0] ? <span className="pause">{p.match(/[↗↘]+/)![0]}</span> : null}</span>;
      })}
    </span>
  );
}

// ── Learn ────────────────────────────────────────────────────────
function LearnStep({ plan, rec }: { plan: DayPlan; rec?: DayRecord }) {
  return (
    <div className="stack">
      <div className="card tint">
        <h2>Day {plan.day} · {plan.title}</h2>
        <p style={{ marginBottom: 0 }}>{plan.intro}</p>
      </div>
      {plan.learn.map((sec, i) => {
        const read = rec?.learnRead.includes(sec.id);
        return (
          <section key={sec.id} className="card">
            <div className="row between">
              <h3>{i + 1}. {sec.title}</h3>
              {read ? <span className="badge ok">已读</span> : null}
            </div>
            {sec.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
            {sec.visual ? <div style={{ margin: "10px 0 14px" }}><Visual id={sec.visual} /></div> : null}
            {sec.phonemes ? (
              <div className="grid grid-3" style={{ margin: "8px 0 12px" }}>
                {sec.phonemes.map((ph) => (
                  <div key={ph.ipa + ph.word} className="phoneme-card">
                    <div className="row between">
                      <span className="sym">/{ph.ipa}/</span>
                      <PlayButton text={ph.word} label={ph.word} />
                    </div>
                    <div className="ipa small muted">/{ph.wordIpa}/</div>
                    <div className="small">{ph.cue}</div>
                  </div>
                ))}
              </div>
            ) : null}
            {sec.bullets ? <ul>{sec.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul> : null}
            {sec.source ? <p className="tiny muted">依据：{sec.source}</p> : null}
            <button
              className={`btn sm ${read ? "" : "primary"}`}
              onClick={() => update((st) => {
                const d = ensureDay(st, plan.day);
                d.learnRead = read ? d.learnRead.filter((x) => x !== sec.id) : [...d.learnRead, sec.id];
              })}
            >
              {read ? "标记为未读" : "我已理解这一节"}
            </button>
          </section>
        );
      })}
    </div>
  );
}

// ── Listen ───────────────────────────────────────────────────────
function ListenStep({ plan, rec }: { plan: DayPlan; rec?: DayRecord }) {
  const mark = (id: string) => update((st) => { const d = ensureDay(st, plan.day); d.listened[id] = (d.listened[id] ?? 0) + 1; });
  return (
    <div className="stack">
      <p className="muted">先只听，不跟读。每组至少听一次正常速度、一次慢速，注意示范之间的差别在哪里。《1000小时》的建议是「放慢速度仔细听，很多遍」。</p>
      {plan.listen.map((it) => (
        <div key={it.id} className="card flat">
          <div className="row between">
            <div>
              <div style={{ fontSize: "1.15rem", fontWeight: 600 }}>{it.text}</div>
              {it.ipa ? <div className="ipa muted">/{it.ipa}/</div> : null}
              {it.note ? <div className="small">{it.note}</div> : null}
            </div>
            <div className="row">
              <ModelPair text={it.text} onPlayed={() => mark(it.id)} showSource />
              <span className="badge">{rec?.listened[it.id] ?? 0} 次</span>
            </div>
          </div>
          <RefAudioImport text={it.text} />
        </div>
      ))}
    </div>
  );
}

// ── Identify (quiz) ──────────────────────────────────────────────
function IdentifyStep({ plan, rec }: { plan: DayPlan; rec?: DayRecord }) {
  const answered = plan.identify.filter((q) => rec?.quiz[q.id]?.length).length;
  const firstCorrect = plan.identify.filter((q) => rec?.quiz[q.id]?.[0]?.correct).length;
  return (
    <div className="stack">
      <div className="row between">
        <p className="muted" style={{ margin: 0 }}>听音选词。每题可以重听，但第一次作答计入正确率。答错的题会自动记入错误和复习。</p>
        <span className="badge accent">首次正确 {firstCorrect}/{answered || 0}</span>
      </div>
      {plan.identify.map((q, i) => <QuizCard key={q.id} q={q} n={i + 1} day={plan.day} attempts={rec?.quiz[q.id] ?? []} />)}
    </div>
  );
}

export function QuizCard({ q, n, day, attempts, onAnswer }: { q: QuizItem; n?: number; day: number; attempts: { choice: number; correct: boolean }[]; onAnswer?: (correct: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const last = picked ?? (attempts.length ? attempts[attempts.length - 1].choice : null);
  const done = last !== null;
  const first = attempts[0];
  const weak = q.kind === "hear" ? ttsWeakContrast(q.options) : null;
  return (
    <div className="card flat">
      <div className="row between">
        <div className="row">
          {n ? <span className="badge">{n}</span> : null}
          {/^(base|b2)-/.test(q.id) ? <span className="badge accent">基线</span> : null}
          <b>{q.prompt}</b>
          <span className="tiny muted">{skillLabel(q.skill)}</span>
        </div>
        {q.kind === "hear" && q.say ? <ModelPair text={q.say} /> : null}
      </div>
      {weak ? <div className="tiny muted" style={{ marginTop: 6 }}>⚠ 这组音（{weak}）在 Mac 合成声音里差别很小，真人发音也主要靠后面元音的过渡来分辨。答错不一定是你的耳朵问题；答完可以对比每个词，或导入真人音频。</div> : null}
      <div className="row" style={{ marginTop: 10 }}>
        {q.options.map((o, i) => {
          const cls = done ? (i === q.answer ? "right" : i === last ? "wrong" : "") : "";
          return (
            <button
              key={i}
              className={`opt ${cls}`}
              onClick={() => {
                setPicked(i);
                if (onAnswer) onAnswer(i === q.answer);
                else answerQuiz(day, q, i);
              }}
            >
              <span className={/[ɪʊəɜɑɒɔæʌθðʃʒŋː]/.test(o) ? "ipa" : ""}>{o}</span>
            </button>
          );
        })}
      </div>
      {done ? (
        <div className="small" style={{ marginTop: 8 }}>
          {first && !first.correct ? <span className="badge bad">首次答错</span> : first ? <span className="badge ok">首次答对</span> : null}{" "}
          {q.explain}
          {q.kind === "hear" && q.options.every((o) => /^[a-z ]+$/i.test(o)) ? (
            <div className="row" style={{ marginTop: 6 }}>
              <span className="tiny muted">逐个对比：</span>
              {q.options.map((o, i) => <PlayButton key={o} text={o} label={i === q.answer ? `${o} ✓` : o} />)}
            </div>
          ) : null}
          {q.kind === "hear" && weak ? <div className="row" style={{ marginTop: 4 }}>{q.options.map((o) => <span key={o} className="row tiny" style={{ display: "inline-flex", gap: 4 }}>{o}<RefAudioImport text={o} /></span>)}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

// ── Produce ──────────────────────────────────────────────────────
function ProduceStep({ plan, rec }: { plan: DayPlan; rec?: DayRecord }) {
  const inc = (id: string, by: number) => update((st) => { const d = ensureDay(st, plan.day); d.produced[id] = Math.max(0, (d.produced[id] ?? 0) + by); });
  return (
    <div className="stack">
      <p className="muted">听示范 → 按提示做动作 → 大声说出来。每说一遍点一次「+1」，每项至少 {REQUIRED_REPS} 遍。适当夸张，音量正常即可（《1000小时》）。可以对着镜子观察唇形。</p>
      <p className="tiny muted">{ASR_DISCLAIMER}</p>
      {plan.produce.map((it) => {
        const n = rec?.produced[it.id] ?? 0;
        return (
          <div key={it.id} className="card flat">
            <div className="row between">
              <div>
                <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{it.text}</div>
                <div className="ipa muted">/{it.ipa}/</div>
              </div>
              <ModelPair text={it.text} />
            </div>
            <p className="small" style={{ margin: "8px 0" }}><b>动作：</b>{it.cue} <span className="tiny muted">· {skillLabel(it.skill)}</span></p>
            <div className="row">
              <button className="btn" onClick={() => inc(it.id, -1)} disabled={!n}>−</button>
              <span className={`badge ${n >= REQUIRED_REPS ? "ok" : ""}`} style={{ minWidth: 70, justifyContent: "center" }}>说了 {n} 遍</span>
              <button className="btn primary" onClick={() => inc(it.id, 1)}>+1 我说了一遍</button>
              <AsrCheck target={it.text.split(" ")[0]} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Record ───────────────────────────────────────────────────────
function RecordStep({ plan, rec }: { plan: DayPlan; rec?: DayRecord }) {
  const round = rec?.round ?? 1;
  const anyBaseline = plan.shadow.some((x) => x.baseline);
  return (
    <div className="stack">
      <p className="muted">
        先听示范 2–3 遍，再跟读，最后独立录音。录音可以录多次，Compare 一步会用最近一次录音。
        {anyBaseline ? ` 标有「可比录音」的项目会在 Day ${weekOf(plan.day).baselineDay} 和 Day ${weekOf(plan.day).retestDay} 各录一次，用于对比。` : ""}
      </p>
      {plan.shadow.map((it) => <ShadowCard key={it.id} plan={plan} item={it} round={round} takes={rec?.recordings[it.id] ?? []} />)}
    </div>
  );
}

function ShadowCard({ plan, item, round, takes }: { plan: DayPlan; item: ShadowItem; round: number; takes: string[] }) {
  return (
    <div className="card flat">
      <div className="row between">
        <div className="row">{item.baseline ? <span className="badge accent">可比录音</span> : null}<span className="tiny muted">{skillLabel(item.skill)}</span></div>
        <ModelPair text={item.text} showSource />
      </div>
      <div style={{ margin: "8px 0" }}>{item.marked ? <Marked text={item.marked} original={item.text} /> : <span style={{ fontSize: "1.15rem" }}>{item.text}</span>}</div>
      {item.ipa ? <div className="ipa muted small">/{item.ipa}/</div> : null}
      <p className="small"><b>听什么：</b>{item.focus}</p>
      <Recorder
        day={plan.day}
        round={round}
        itemId={item.id}
        text={item.text}
        takes={takes}
        onSaved={(id) => update((st) => { const d = ensureDay(st, plan.day); (d.recordings[item.id] ??= []).push(id); })}
        onDeleted={(id) => update((st) => { const d = ensureDay(st, plan.day); d.recordings[item.id] = (d.recordings[item.id] ?? []).filter((x) => x !== id); })}
      />
      <RefAudioImport text={item.text} />
    </div>
  );
}

// ── Compare ──────────────────────────────────────────────────────
const COMPARE_DIMENSIONS = ["word-stress", "sentence-stress", "weak-forms", "linking", "chunking", "intonation"];

function CompareStep({ plan, rec }: { plan: DayPlan; rec?: DayRecord }) {
  return (
    <div className="stack">
      <p className="muted">
        先播放示范，紧接着播放自己的录音（或用「示范 → 我」连续播放）。逐项检查，勾出仍然不像的地方。勾选的项目会进入错误记录和复习。这是你自己的判断，English OS 不会对录音打分。
      </p>
      {plan.shadow.map((it) => <CompareCard key={it.id} plan={plan} item={it} rec={rec} />)}
    </div>
  );
}

function CompareCard({ plan, item, rec }: { plan: DayPlan; item: ShadowItem; rec?: DayRecord }) {
  const takes = rec?.recordings[item.id] ?? [];
  const latest = takes[takes.length - 1];
  const saved = rec?.compared[item.id];
  const [rating, setRating] = useState(saved?.rating ?? 0);
  const [issues, setIssues] = useState<string[]>(saved?.issues ?? []);
  const [note, setNote] = useState(saved?.note ?? "");
  const options = useMemo(() => Array.from(new Set([item.skill, ...plan.skills, ...COMPARE_DIMENSIONS])).filter((x) => SKILL_MAP[x]), [item.skill, plan.skills]);

  async function abPlay() {
    await playModel(item.text);
    await new Promise((r) => setTimeout(r, 400));
    if (latest) await playRecording(latest);
  }

  function save() {
    update((st) => {
      const d = ensureDay(st, plan.day);
      const prev = d.compared[item.id]?.issues ?? [];
      d.compared[item.id] = { rating, issues, note: note.trim() || undefined, at: new Date().toISOString() };
      for (const sk of issues.filter((x) => !prev.includes(x))) {
        st.errors.push({ id: `err-${Date.now().toString(36)}-${sk}`, createdAt: new Date().toISOString(), day: plan.day, source: "compare", skill: sk, text: item.text, detail: note.trim() || "跟读对比时自评仍有差距" });
        const ex = st.reviews.find((r) => r.skill === sk && !r.mastered);
        if (ex) { ex.stage = 0; ex.dueDay = Math.min(ex.dueDay, plan.day + 1); }
        else st.reviews.push({ id: `rev-${Date.now().toString(36)}-${sk}`, skill: sk, label: skillLabel(sk), createdDay: plan.day, dueDay: plan.day + 1, stage: 0, history: [] });
      }
    });
  }

  return (
    <div className="card flat">
      <div className="row between">
        <div style={{ fontSize: "1.05rem" }}>{item.text}</div>
        {saved ? <span className="badge ok">已对比 · {saved.rating}/5</span> : null}
      </div>
      {!latest ? (
        <div className="notice small" style={{ marginTop: 8 }}>这一项还没有录音。回到 Record 先录一次。</div>
      ) : (
        <>
          <div className="row" style={{ margin: "10px 0" }}>
            <PlayButton text={item.text} label="示范" />
            <button className="btn sm" onClick={() => playRecording(latest)}>▶ 我的录音</button>
            <button className="btn sm dark" onClick={abPlay}>▶ 示范 → 我</button>
            <DurationHint id={latest} />
          </div>
          <div className="row small" style={{ marginBottom: 8 }}>
            <span>和示范有多接近：</span>
            <span className="rating">
              {[1, 2, 3, 4, 5].map((n) => <button key={n} className={rating === n ? "on" : ""} onClick={() => setRating(n)}>{n}</button>)}
            </span>
            <span className="tiny muted">1 = 差别很大，5 = 几乎听不出差别</span>
          </div>
          <div className="small muted" style={{ marginBottom: 4 }}>仍然不像的地方（可多选）：</div>
          <div className="row" style={{ gap: 4 }}>
            {options.map((o) => (
              <button key={o} className={`btn sm ${issues.includes(o) ? "dark" : ""}`} onClick={() => setIssues((c) => (c.includes(o) ? c.filter((x) => x !== o) : [...c, o]))}>
                {skillLabel(o)}
              </button>
            ))}
          </div>
          <div className="row" style={{ marginTop: 8 }}>
            <input className="input" style={{ flex: 1, minWidth: 220 }} value={note} onChange={(e) => setNote(e.target.value)} placeholder="具体听到了什么差别（可选），例如：worth 的 th 发成了 s" />
            <button className="btn primary" disabled={!rating} onClick={save}>{saved ? "更新对比" : "保存对比"}</button>
          </div>
        </>
      )}
    </div>
  );
}

function DurationHint({ id }: { id: string }) {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => { getRecording(id).then((r) => setMs(r?.durationMs ?? null)); }, [id]);
  return ms ? <span className="tiny muted">录音 {(ms / 1000).toFixed(1)}s</span> : null;
}

// ── Repeat / Review ──────────────────────────────────────────────
function RepeatStep({ plan, rec, s }: { plan: DayPlan; rec?: DayRecord; s: AppState }) {
  const due = dueReviews(s, plan.day);
  const todayErrors = s.errors.filter((e) => e.day === plan.day);
  const upcoming = upcomingReviews(s, plan.day);
  return (
    <div className="stack">
      <section className="card">
        <h3>1. 到期复习</h3>
        {due.length ? (
          <div className="stack">
            <p className="small muted">这些是前几天出错的项目。每项听一题、说三遍。答对会推迟下次复习，答错明天再练。</p>
            {due.map((t) => <ReviewTaskCard key={t.id} day={plan.day} taskId={t.id} skill={t.skill} done={!!rec?.reviewed[t.id]} last={t.history.filter((h) => h.day === plan.day).slice(-1)[0]?.correct} />)}
          </div>
        ) : (
          <p className="small muted" style={{ margin: 0 }}>今天没有到期的复习任务。{plan.day === 1 ? "Day 1 的错误会从明天开始进入复习。" : ""}</p>
        )}
      </section>

      <section className="card">
        <h3>2. 今天发现的错误</h3>
        {todayErrors.length ? (
          <table className="t">
            <thead><tr><th>来源</th><th>项目</th><th>内容</th><th>说明</th><th></th></tr></thead>
            <tbody>
              {todayErrors.map((e) => (
                <tr key={e.id} style={{ opacity: e.resolved ? 0.5 : 1 }}>
                  <td><span className="badge">{({ quiz: "辨音", self: "自查", compare: "对比", elsa: "ELSA", coach: "教练" } as const)[e.source]}</span></td>
                  <td className="small">{skillLabel(e.skill)}</td>
                  <td>{e.text}</td>
                  <td className="small muted">{e.detail}</td>
                  <td><button className="btn ghost sm" onClick={() => resolveError(e.id, !e.resolved)}>{e.resolved ? "撤销" : "已改正"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="small muted">辨音和对比步骤还没有产生错误记录。</p>}
        <SelfErrorForm day={plan.day} />
        <label className="row small" style={{ marginTop: 10 }}>
          <input type="checkbox" checked={!!rec?.noNewErrors} onChange={(e) => update((st) => { ensureDay(st, plan.day).noNewErrors = e.target.checked; })} />
          我检查过了，今天没有需要额外补充的错误
        </label>
      </section>

      <section className="card">
        <h3>3. ELSA 反馈（可选）</h3>
        <p className="small muted">如果今天用 ELSA 练了相关内容，把它指出的问题记在这里。English OS 不依赖 ELSA，这一项不影响完成。</p>
        <ElsaForm day={plan.day} compact />
      </section>

      <section className="card">
        <h3>4. 自评与复盘</h3>
        <SelfAssessment plan={plan} rec={rec} />
      </section>

      <section className="card">
        <h3>5. 下一次复习任务</h3>
        {upcoming.length ? (
          <ul>{upcoming.map((t) => <li key={t.id}><b>Day {t.dueDay}</b> · {t.label} <span className="tiny muted">（第 {t.stage + 1} 轮复习）</span></li>)}</ul>
        ) : <p className="small muted">目前没有安排复习。完成今天的辨音和对比后，出错的项目会出现在这里。</p>}
      </section>
    </div>
  );
}

function ReviewTaskCard({ day, taskId, skill, done, last }: { day: number; taskId: string; skill: string; done: boolean; last?: boolean }) {
  const q = useMemo(() => reviewQuizFor(skill), [skill]);
  const sk = SKILL_MAP[skill];
  return (
    <div className="card flat" style={{ background: "var(--bg)" }}>
      <div className="row between">
        <b>{sk?.label ?? skill}</b>
        {done ? <span className={`badge ${last ? "ok" : "bad"}`}>{last ? "复习通过" : "需要再练"}</span> : <span className="badge warn">待复习</span>}
      </div>
      {sk ? <p className="small" style={{ margin: "6px 0" }}>{sk.action}</p> : null}
      {sk ? (
        <div className="row" style={{ gap: 4, marginBottom: 8 }}>
          {sk.words.slice(0, 6).map((w) => <PlayButton key={w} text={w} label={w} />)}
        </div>
      ) : null}
      {q ? <QuizCard q={q} day={day} attempts={[]} onAnswer={(c) => recordReview(day, taskId, c)} /> : (
        <div className="row">
          <button className="btn sm" onClick={() => recordReview(day, taskId, true)}>说三遍，自评已改善</button>
          <button className="btn sm" onClick={() => recordReview(day, taskId, false)}>还不行</button>
        </div>
      )}
    </div>
  );
}

function SelfErrorForm({ day }: { day: number }) {
  const [text, setText] = useState("");
  const [skill, setSkill] = useState("");
  const suggested = useMemo(() => (text ? matchSkills(text) : []), [text]);
  const chosen = skill || suggested[0] || "";
  return (
    <div className="row" style={{ marginTop: 10 }}>
      <input className="input" style={{ flex: 2, minWidth: 220 }} value={text} onChange={(e) => setText(e.target.value)} placeholder="补充一个自己发现的问题，例如：three 发成了 free" />
      <select className="input" style={{ flex: 1, minWidth: 160 }} value={chosen} onChange={(e) => setSkill(e.target.value)}>
        <option value="">选择归类…</option>
        {SKILLS.map((sk) => <option key={sk.id} value={sk.id}>{sk.label}（D{sk.day}）</option>)}
      </select>
      <button className="btn" disabled={!text.trim() || !chosen} onClick={() => { addError({ day, source: "self", skill: chosen, text: text.trim() }); setText(""); setSkill(""); }}>记录</button>
    </div>
  );
}

function SelfAssessment({ plan, rec }: { plan: DayPlan; rec?: DayRecord }) {
  const sa = rec?.selfAssessment;
  const [clarity, setClarity] = useState(sa?.clarity ?? 0);
  const [confidence, setConfidence] = useState(sa?.confidence ?? 0);
  const [effort, setEffort] = useState(sa?.effort ?? 0);
  const [note, setNote] = useState(sa?.note ?? "");
  const Rate = ({ v, set }: { v: number; set: (n: number) => void }) => (
    <span className="rating">{[1, 2, 3, 4, 5].map((n) => <button key={n} className={v === n ? "on" : ""} onClick={() => set(n)}>{n}</button>)}</span>
  );
  return (
    <div className="stack">
      <div className="grid grid-3">
        <div className="field"><label>今天的发音清晰度</label><Rate v={clarity} set={setClarity} /></div>
        <div className="field"><label>对今天内容的把握</label><Rate v={confidence} set={setConfidence} /></div>
        <div className="field"><label>专注程度</label><Rate v={effort} set={setEffort} /></div>
      </div>
      <div className="small muted">复盘提示（《1000小时》每日 5–10 分钟复盘）：{plan.reviewPrompts.join(" ")} 已经克服了什么？还没克服什么？明天想换什么方法？</div>
      <textarea className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="写下今天的复盘" />
      <div className="row">
        <button
          className="btn primary"
          disabled={!clarity || !confidence || !effort}
          onClick={() => update((st) => { ensureDay(st, plan.day).selfAssessment = { clarity, confidence, effort, note: note.trim(), at: new Date().toISOString() }; })}
        >
          {sa ? "更新自评" : "保存自评"}
        </button>
        {sa ? <span className="badge ok">已保存</span> : null}
      </div>
    </div>
  );
}

// ── Completion ───────────────────────────────────────────────────
function CompletionPanel({ plan, s }: { plan: DayPlan; s: AppState }) {
  const rec = s.days[plan.day];
  const now = useNow(5000, !!rec?.running);
  const reqs = requirements(plan, s, now);
  const ok = canComplete(plan, s);
  const doneCount = reqs.filter((r) => r.done).length;
  return (
    <section className="card" style={{ marginTop: 28 }}>
      <div className="row between">
        <h3 style={{ margin: 0 }}>今日完成标准</h3>
        {rec?.completedAt ? <span className="badge ok">已于 {new Date(rec.completedAt).toLocaleString()} 完成</span> : <span className="badge">{doneCount}/{reqs.length}</span>}
      </div>
      <p className="small muted">只有真实完成训练才能结束这一天：计时、练习、正确率、录音、自评和复习都会被记录。</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {reqs.map((r) => (
          <li key={r.id} className="row small" style={{ gap: 8 }}>
            <span style={{ color: r.done ? "var(--ok)" : "var(--muted)", width: 16 }}>{r.done ? "✓" : "○"}</span>
            <span style={{ flex: 1 }}>{r.label}</span>
            <span className="tiny muted">{r.detail}</span>
          </li>
        ))}
      </ul>
      <div className="row">
        {!rec?.completedAt ? (
          <button className="btn primary lg" disabled={!ok} onClick={() => completeDay(plan.day)}>完成 Day {plan.day}</button>
        ) : (
          <>
            {plan.day === weekOf(plan.day).retestDay ? <Link className="btn primary" href="/progress#report">查看 Week {weekOf(plan.day).week} 报告 →</Link> : null}
            {plan.day < TOTAL_DAYS ? <Link className={`btn ${plan.day === weekOf(plan.day).retestDay ? "" : "primary"}`} href={`/bootcamp/${plan.day + 1}`}>进入 Day {plan.day + 1} →</Link> : null}
            <button className="btn" onClick={() => { if (confirm("开始新一轮会清空本轮的勾选状态（录音和历史会保留）。继续吗？")) startNewRound(plan.day); }}>再练一轮</button>
          </>
        )}
        {rec?.running ? <button className="btn" onClick={() => pauseTimer(plan.day)}>暂停并稍后继续</button> : null}
      </div>
      {rec?.rounds.length ? (
        <p className="tiny muted" style={{ marginTop: 8 }}>
          历史轮次：{rec.rounds.map((r) => `第 ${r.round} 轮 ${Math.round(r.activeMs / 60000)} 分钟${r.quizFirstAccuracy != null ? `，辨音 ${Math.round(r.quizFirstAccuracy * 100)}%` : ""}`).join("；")}
        </p>
      ) : null}
    </section>
  );
}
