// Practice history by calendar date: which days the learner actually trained
// (any lesson time or daily review), for the dashboard streak, the Progress
// chart and the reminder. Pure and free of browser code, so the server's
// reminder loop can use it on the backed-up state.
import type { AppState } from "./store";

export function dateKey(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const shift = (date: string, n: number) => {
  const [y, m, d] = date.split("-").map(Number);
  return dateKey(new Date(y, m - 1, d + n));
};

type Practice = Pick<AppState, "days"> & Partial<Pick<AppState, "daily">>;

// Lesson minutes per local date, plus the dates with a daily review.
export function practiceByDate(s: Practice): Map<string, { minutes: number; reviews: number }> {
  const out = new Map<string, { minutes: number; reviews: number }>();
  const at = (k: string) => out.get(k) ?? (out.set(k, { minutes: 0, reviews: 0 }), out.get(k)!);
  for (const d of Object.values(s.days ?? {})) {
    for (const seg of d.log ?? []) {
      const t = new Date(seg.start);
      if (!isNaN(+t)) at(dateKey(t)).minutes += seg.ms / 60000;
    }
  }
  for (const [date, skills] of Object.entries(s.daily?.log ?? {})) if (skills.length) at(date).reviews += skills.length;
  return out;
}

// A day counts once there is at least a minute of lesson time or one review.
export const practicedOn = (s: Practice, date: string) => {
  const p = practiceByDate(s).get(date);
  return !!p && (p.minutes >= 1 || p.reviews > 0);
};

// Consecutive practice days ending today (or yesterday, if today is still open).
export function practiceStreak(s: Practice, today = dateKey(new Date())) {
  const by = practiceByDate(s);
  const ok = (k: string) => { const p = by.get(k); return !!p && (p.minutes >= 1 || p.reviews > 0); };
  let d = ok(today) ? today : shift(today, -1);
  let n = 0;
  while (ok(d)) { n++; d = shift(d, -1); }
  return n;
}

export function lastPracticed(s: Practice): string | null {
  const days = [...practiceByDate(s).entries()].filter(([, p]) => p.minutes >= 1 || p.reviews > 0).map(([k]) => k).sort();
  return days.at(-1) ?? null;
}

// The last n dates (oldest first) with their minutes and review counts.
export function recentDays(s: Practice, n = 14, today = dateKey(new Date())) {
  const by = practiceByDate(s);
  return Array.from({ length: n }, (_, i) => {
    const date = shift(today, i - n + 1);
    const p = by.get(date) ?? { minutes: 0, reviews: 0 };
    return { date, minutes: Math.round(p.minutes), reviews: p.reviews };
  });
}

// ── reminder ─────────────────────────────────────────────────────
export interface ReminderSettings { enabled: boolean; time: string } // "HH:MM", local time
export const DEFAULT_REMINDER: ReminderSettings = { enabled: false, time: "20:00" };
export const REMINDER_UNTIL_HOUR = 23; // don't nag late at night if the Mac wakes up late

// True when the reminder should fire now: switched on, time reached, not sent
// today and nothing practised today.
export function shouldRemind(s: Practice & { settings?: { reminder?: ReminderSettings } }, now: Date, lastSent: string | null) {
  const r = s.settings?.reminder;
  if (!r?.enabled || !/^\d{2}:\d{2}$/.test(r.time)) return false;
  const today = dateKey(now);
  if (lastSent === today) return false;
  const [h, m] = r.time.split(":").map(Number);
  const mins = now.getHours() * 60 + now.getMinutes();
  if (mins < h * 60 + m || now.getHours() >= REMINDER_UNTIL_HOUR) return false;
  return !practicedOn(s, today);
}
