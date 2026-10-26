import type { QuizItem } from "@/content/types";
import { SKILL_MAP } from "@/content/skills";
import { update, type AppState, type DailyItem, type DailyState } from "./store";
import { reviewQuizFor } from "./progress";

// Daily review (每日复习): a short, calendar-based spaced-repetition queue built
// from the learner's own mistakes. Unlike the in-lesson review (step 7, scheduled
// by bootcamp day), it runs on real dates, so it keeps going on days without a
// new lesson and after the bootcamp ends.
//
// A skill enters the queue when it has an unresolved error or a review task that
// is not yet mastered. Each correct review pushes it further out; a miss brings it
// back tomorrow. A new mistake on a mastered skill puts it back in the queue.

export const DAILY_INTERVALS = [1, 2, 4, 7, 15]; // days until next review, per stage
export const DAILY_MAX = 8; // about 5–10 minutes

export function localDate(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function addDays(date: string, n: number) {
  const [y, m, d] = date.split("-").map(Number);
  return localDate(new Date(y, m - 1, d + n));
}

const emptyDaily = (): DailyState => ({ items: {}, log: {} });

// How much evidence of trouble there is for each skill right now.
export function evidenceBySkill(s: AppState): Map<string, number> {
  const ev = new Map<string, number>();
  const bump = (k: string, n = 1) => { if (SKILL_MAP[k]) ev.set(k, (ev.get(k) ?? 0) + n); };
  for (const e of s.errors) if (!e.resolved) bump(e.skill);
  for (const r of s.reviews) {
    if (r.mastered) continue;
    bump(r.skill, 1 + r.history.filter((h) => !h.correct).length);
  }
  return ev;
}

// Bring the queue up to date with the learner's errors. Pure: returns a new state.
export function syncDaily(s: AppState, today = localDate()): DailyState {
  const daily: DailyState = structuredClone(s.daily ?? emptyDaily());
  for (const [skill, n] of evidenceBySkill(s)) {
    const it = daily.items[skill];
    if (!it) {
      daily.items[skill] = { skill, addedAt: today, due: today, stage: 0, evidence: n, history: [] };
    } else if (n > it.evidence) {
      // new mistakes since last time: back to the start
      it.evidence = n;
      it.stage = 0;
      it.mastered = false;
      if (it.due > today) it.due = today;
    } else {
      it.evidence = n;
    }
  }
  return daily;
}

export interface DailyQueue {
  today: string;
  items: DailyItem[]; // due today (and those already done today), capped
  doneToday: string[];
  later: DailyItem[]; // scheduled for a later date
  mastered: DailyItem[];
  streak: number;
}

export function dailyQueue(s: AppState, today = localDate()): DailyQueue {
  const daily = syncDaily(s, today);
  const all = Object.values(daily.items);
  const doneToday = daily.log[today] ?? [];
  const done = all.filter((i) => doneToday.includes(i.skill));
  const due = all
    .filter((i) => !i.mastered && i.due <= today && !doneToday.includes(i.skill))
    .sort((a, b) => a.due.localeCompare(b.due) || b.evidence - a.evidence);
  const items = [...done, ...due].slice(0, Math.max(DAILY_MAX, done.length));
  const later = all.filter((i) => !i.mastered && i.due > today && !doneToday.includes(i.skill)).sort((a, b) => a.due.localeCompare(b.due));
  return { today, items, doneToday, later, mastered: all.filter((i) => i.mastered), streak: streak(daily, today) };
}

// Consecutive days with at least one daily review, ending today (or yesterday if
// today's review has not been done yet).
export function streak(daily: DailyState, today = localDate()) {
  let d = (daily.log[today]?.length ?? 0) > 0 ? today : addDays(today, -1);
  let n = 0;
  while ((daily.log[d]?.length ?? 0) > 0) { n++; d = addDays(d, -1); }
  return n;
}

export function applyDailyResult(daily: DailyState, skill: string, correct: boolean, today = localDate()) {
  const it = daily.items[skill];
  if (!it) return;
  it.history.push({ date: today, correct });
  if (correct) {
    it.stage += 1;
    if (it.stage >= DAILY_INTERVALS.length) { it.mastered = true; it.due = addDays(today, DAILY_INTERVALS[DAILY_INTERVALS.length - 1]); }
    else it.due = addDays(today, DAILY_INTERVALS[it.stage]);
  } else {
    it.stage = 0;
    it.due = addDays(today, 1);
  }
  const log = (daily.log[today] ??= []);
  if (!log.includes(skill)) log.push(skill);
}

export function recordDaily(skill: string, correct: boolean) {
  update((s) => {
    const today = localDate();
    s.daily = syncDaily(s, today);
    applyDailyResult(s.daily, skill, correct, today);
  });
}

export function lastResultToday(s: AppState, skill: string, today = localDate()): boolean | undefined {
  const h = s.daily?.items[skill]?.history.filter((x) => x.date === today);
  return h?.length ? h[h.length - 1].correct : undefined;
}

export function dailyQuiz(skill: string): QuizItem | undefined {
  return reviewQuizFor(skill);
}
