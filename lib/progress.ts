"use client";

import type { BlockId, DayPlan, QuizItem, StepId } from "@/content/types";
import { allQuizItems, DAYS, TOTAL_DAYS, WEEKS } from "@/content/days";
import { SKILL_MAP } from "@/content/skills";
import { ensureDay, uid, update, type AppState, type DayRecord, type ErrorSource } from "./store";

// ── timer ────────────────────────────────────────────────────────
export function liveBlockMs(d: DayRecord, block: BlockId, now = Date.now()): number {
  const base = d.blocks[block];
  if (d.running && d.activeBlock === block && d.runStartedAt) return base + Math.max(0, now - d.runStartedAt);
  return base;
}

export function liveRoundMs(d: DayRecord, now = Date.now()): number {
  return (Object.keys(d.blocks) as BlockId[]).reduce((s, b) => s + liveBlockMs(d, b, now), 0);
}

export function liveTotalMs(d: DayRecord, now = Date.now()): number {
  return d.totalMs + (d.running && d.runStartedAt ? Math.max(0, now - d.runStartedAt) : 0);
}

function flush(d: DayRecord, now: number) {
  if (!d.running || !d.runStartedAt) return;
  const ms = Math.max(0, now - d.runStartedAt);
  d.blocks[d.activeBlock] += ms;
  d.totalMs += ms;
  if (ms > 0) d.log.push({ start: new Date(d.runStartedAt).toISOString(), end: new Date(now).toISOString(), ms, block: d.activeBlock });
  d.runStartedAt = now;
  d.heartbeatAt = now;
}

export function startTimer(day: number, block?: BlockId) {
  update((s) => {
    const d = ensureDay(s, day);
    const now = Date.now();
    // only one day can run at a time
    for (const other of Object.values(s.days)) if (other.day !== day && other.running) { flush(other, now); other.running = false; other.runStartedAt = undefined; }
    if (d.running) flush(d, now);
    if (block) d.activeBlock = block;
    d.running = true;
    d.runStartedAt = now;
    d.heartbeatAt = now;
    d.startedAt ??= new Date(now).toISOString();
  });
}

export function pauseTimer(day: number) {
  update((s) => {
    const d = ensureDay(s, day);
    flush(d, Date.now());
    d.running = false;
    d.runStartedAt = undefined;
  });
}

export function switchBlock(day: number, block: BlockId) {
  update((s) => {
    const d = ensureDay(s, day);
    if (d.activeBlock === block) return;
    flush(d, Date.now());
    d.activeBlock = block;
  });
}

// Called periodically while running so a crash or closed tab loses at most a few seconds.
export function heartbeat(day: number) {
  update((s) => {
    const d = s.days[day];
    if (d?.running) d.heartbeatAt = Date.now();
  });
}

// ── step state ───────────────────────────────────────────────────
export interface StepStatus {
  done: number;
  total: number;
  complete: boolean;
}

export const REQUIRED_REPS = 3;

export function stepStatus(plan: DayPlan, d: DayRecord | undefined, step: StepId, s?: AppState): StepStatus {
  const r = d;
  const mk = (done: number, total: number): StepStatus => ({ done, total, complete: total === 0 ? true : done >= total });
  switch (step) {
    case "learn":
      return mk(plan.learn.filter((x) => r?.learnRead.includes(x.id)).length, plan.learn.length);
    case "listen":
      return mk(plan.listen.filter((x) => (r?.listened[x.id] ?? 0) > 0).length, plan.listen.length);
    case "identify":
      return mk(plan.identify.filter((x) => (r?.quiz[x.id]?.length ?? 0) > 0).length, plan.identify.length);
    case "produce":
      return mk(plan.produce.filter((x) => (r?.produced[x.id] ?? 0) >= REQUIRED_REPS).length, plan.produce.length);
    case "record":
      return mk(plan.shadow.filter((x) => (r?.recordings[x.id]?.length ?? 0) > 0).length, plan.shadow.length);
    case "compare":
      return mk(plan.shadow.filter((x) => !!r?.compared[x.id]).length, plan.shadow.length);
    case "repeat": {
      const due = s ? dueReviews(s, plan.day) : [];
      const reviewDone = due.filter((t) => r?.reviewed[t.id]).length;
      const reflect = (r?.selfAssessment ? 1 : 0) + (r?.noNewErrors || hasDayErrors(s, plan.day, "self") ? 1 : 0);
      return mk(reviewDone + reflect, due.length + 2);
    }
  }
}

function hasDayErrors(s: AppState | undefined, day: number, source: ErrorSource) {
  return !!s?.errors.some((e) => e.day === day && e.source === source);
}

export interface Requirement {
  id: string;
  label: string;
  done: boolean;
  detail: string;
}

export function requirements(plan: DayPlan, s: AppState, now = Date.now()): Requirement[] {
  const d = s.days[plan.day];
  const mins = d ? liveRoundMs(d, now) / 60000 : 0;
  const steps: StepId[] = ["learn", "listen", "identify", "produce", "record", "compare", "repeat"];
  const st = Object.fromEntries(steps.map((k) => [k, stepStatus(plan, d, k, s)])) as Record<StepId, StepStatus>;
  return [
    { id: "time", label: `实际训练时长 ≥ ${plan.minMinutes} 分钟`, done: mins >= plan.minMinutes, detail: `${Math.floor(mins)} / ${plan.minMinutes} 分钟（仅计时器运行时累计）` },
    { id: "learn", label: "读完全部讲解", done: st.learn.complete, detail: `${st.learn.done}/${st.learn.total}` },
    { id: "listen", label: "听完全部示范", done: st.listen.complete, detail: `${st.listen.done}/${st.listen.total}` },
    { id: "identify", label: "完成全部辨音题", done: st.identify.complete, detail: `${st.identify.done}/${st.identify.total}` },
    { id: "produce", label: `每个发音练习大声说 ${REQUIRED_REPS} 遍以上`, done: st.produce.complete, detail: `${st.produce.done}/${st.produce.total}` },
    { id: "record", label: "每段跟读都有录音", done: st.record.complete, detail: `${st.record.done}/${st.record.total}` },
    { id: "compare", label: "每段录音都和示范对比并自评", done: st.compare.complete, detail: `${st.compare.done}/${st.compare.total}` },
    { id: "repeat", label: "完成到期复习、自评和错误记录", done: st.repeat.complete, detail: `${st.repeat.done}/${st.repeat.total}` },
  ];
}

export function canComplete(plan: DayPlan, s: AppState) {
  return requirements(plan, s).every((r) => r.done);
}

export function completeDay(day: number) {
  update((s) => {
    const d = ensureDay(s, day);
    flush(d, Date.now());
    d.running = false;
    d.runStartedAt = undefined;
    d.completedAt ??= new Date().toISOString();
    scheduleFromDay(s, day);
  });
}

// "Repeat training": archive this round and start a fresh pass of the same day.
export function startNewRound(day: number) {
  update((s) => {
    const d = ensureDay(s, day);
    flush(d, Date.now());
    const plan = DAYS.find((p) => p.day === day);
    d.rounds.push({
      round: d.round,
      finishedAt: new Date().toISOString(),
      activeMs: Object.values(d.blocks).reduce((a, b) => a + b, 0),
      quizFirstAccuracy: plan ? quizAccuracy(plan.identify, d).accuracy : null,
      recordings: Object.values(d.recordings).reduce((a, b) => a + b.length, 0),
    });
    d.round += 1;
    d.running = false;
    d.runStartedAt = undefined;
    d.blocks = { understand: 0, perceive: 0, shadow: 0, review: 0 };
    d.learnRead = [];
    d.listened = {};
    d.quiz = {};
    d.produced = {};
    d.compared = {};
    d.reviewed = {};
    d.selfAssessment = undefined;
    d.noNewErrors = undefined;
    // recordings from earlier rounds stay in IndexedDB and in the report; this map is per round
    d.recordings = {};
  });
}

export function currentDay(s: AppState): number {
  for (let i = 1; i <= TOTAL_DAYS; i++) if (!s.days[i]?.completedAt) return i;
  return TOTAL_DAYS;
}

// The week whose report to show: Week 2 once it has been started, else Week 1.
export function activeWeek(s: AppState) {
  return [...WEEKS].reverse().find((w) => w.week === 1 || s.days[w.firstDay]?.startedAt) ?? WEEKS[0];
}

export function isUnlocked(s: AppState, day: number) {
  return day === 1 || !!s.days[day - 1]?.completedAt;
}

// ── quiz ─────────────────────────────────────────────────────────
export function quizAccuracy(items: QuizItem[], d: DayRecord | undefined) {
  let answered = 0;
  let correct = 0;
  for (const q of items) {
    const a = d?.quiz[q.id]?.[0];
    if (!a) continue;
    answered++;
    if (a.correct) correct++;
  }
  return { answered, correct, accuracy: answered ? correct / answered : null };
}

export function answerQuiz(day: number, q: QuizItem, choice: number) {
  update((s) => {
    const d = ensureDay(s, day);
    const correct = choice === q.answer;
    const first = !(d.quiz[q.id]?.length);
    (d.quiz[q.id] ??= []).push({ choice, correct, at: new Date().toISOString() });
    if (first && !correct) {
      addErrorDraft(s, {
        day,
        source: "quiz",
        skill: q.skill,
        text: q.say ?? q.prompt,
        detail: `选了「${q.options[choice]}」，正确是「${q.options[q.answer]}」`,
      });
    }
  });
}

// ── errors & spaced review ───────────────────────────────────────
const INTERVALS = [1, 2, 3]; // training days until the next review, per stage

export function addErrorDraft(
  s: AppState,
  e: { day: number; source: ErrorSource; skill: string; text: string; detail?: string },
) {
  const id = uid("err");
  s.errors.push({ id, createdAt: new Date().toISOString(), ...e });
  upsertReview(s, e.skill, e.day, id);
  return id;
}

export function addError(e: { day: number; source: ErrorSource; skill: string; text: string; detail?: string }) {
  update((s) => {
    addErrorDraft(s, e);
  });
}

export function resolveError(id: string, resolved: boolean) {
  update((s) => {
    const e = s.errors.find((x) => x.id === id);
    if (e) e.resolved = resolved;
  });
}

function upsertReview(s: AppState, skill: string, day: number, errorId?: string) {
  const existing = s.reviews.find((r) => r.skill === skill && !r.mastered);
  if (existing) {
    existing.stage = 0;
    existing.dueDay = Math.min(existing.dueDay, day + INTERVALS[0]);
    return;
  }
  s.reviews.push({
    id: uid("rev"),
    skill,
    label: SKILL_MAP[skill]?.label ?? skill,
    createdDay: day,
    dueDay: day + INTERVALS[0],
    stage: 0,
    history: [],
    sourceErrorId: errorId,
  });
}

// Skills scored below 80% on the first try today also get a review task.
function scheduleFromDay(s: AppState, day: number) {
  const plan = DAYS.find((p) => p.day === day);
  const d = s.days[day];
  if (!plan || !d) return;
  const bySkill = new Map<string, { n: number; c: number }>();
  for (const q of plan.identify) {
    const a = d.quiz[q.id]?.[0];
    if (!a) continue;
    const v = bySkill.get(q.skill) ?? { n: 0, c: 0 };
    v.n++;
    if (a.correct) v.c++;
    bySkill.set(q.skill, v);
  }
  for (const [skill, v] of bySkill) if (v.c / v.n < 0.8) upsertReview(s, skill, day);
}

export const MAX_REVIEWS_PER_DAY = 6;

// At most six review tasks a day (the review block is 10 minutes); the rest roll over.
export function dueReviews(s: AppState, day: number) {
  const touched = s.reviews.filter((r) => r.history.some((h) => h.day === day));
  const pending = s.reviews
    .filter((r) => !r.mastered && r.dueDay <= day && !touched.includes(r))
    .sort((a, b) => a.dueDay - b.dueDay || a.createdDay - b.createdDay);
  return [...touched, ...pending].slice(0, Math.max(MAX_REVIEWS_PER_DAY, touched.length));
}

export function upcomingReviews(s: AppState, afterDay: number) {
  return s.reviews.filter((r) => !r.mastered && r.dueDay > afterDay).sort((a, b) => a.dueDay - b.dueDay);
}

export function recordReview(day: number, taskId: string, correct: boolean) {
  update((s) => {
    const t = s.reviews.find((r) => r.id === taskId);
    const d = ensureDay(s, day);
    if (!t) return;
    t.history.push({ day, correct, at: new Date().toISOString() });
    if (correct) {
      t.stage += 1;
      if (t.stage >= INTERVALS.length) t.mastered = true;
      else t.dueDay = day + INTERVALS[t.stage];
    } else {
      t.stage = 0;
      t.dueDay = day + INTERVALS[0];
    }
    d.reviewed[taskId] = true;
  });
}

export function reviewQuizFor(skill: string, exclude: string[] = []): QuizItem | undefined {
  const pool = allQuizItems().filter((q) => q.skill === skill && q.kind === "hear" && !exclude.includes(q.id));
  const any = pool.length ? pool : allQuizItems().filter((q) => q.skill === skill);
  return any[Math.floor(Math.random() * any.length)];
}

export function fmtMin(ms: number) {
  ms = Math.max(0, ms);
  const m = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
