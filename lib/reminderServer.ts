// Daily practice reminder, run inside the local server (started from
// instrumentation.ts). Once a minute it reads the latest auto-backup of the
// learner's progress; at the chosen time, if nothing has been practised today,
// it shows a macOS notification. Nothing is sent anywhere else.
import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { backupDir, readLatest } from "./backupServer";
import { dateKey, practiceStreak, shouldRemind } from "./practice";
import type { AppState } from "./store";

const SENT_FILE = () => path.join(backupDir(), "reminder.json");

export const notificationsSupported = () => process.platform === "darwin";

export async function lastSent(): Promise<string | null> {
  try { return JSON.parse(await fs.readFile(SENT_FILE(), "utf8")).date ?? null; } catch { return null; }
}

async function markSent(date: string) {
  await fs.mkdir(backupDir(), { recursive: true });
  await fs.writeFile(SENT_FILE(), JSON.stringify({ date, at: new Date().toISOString() }));
}

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

export function notify(title: string, body: string): Promise<boolean> {
  if (!notificationsSupported()) return Promise.resolve(false);
  const script = `display notification "${esc(body)}" with title "${esc(title)}" sound name "Glass"`;
  return new Promise((resolve) => execFile("/usr/bin/osascript", ["-e", script], (err) => resolve(!err)));
}

export function reminderText(s: Partial<AppState>) {
  const streak = practiceStreak({ days: s.days ?? {}, daily: s.daily });
  const keep = streak ? `已经连续 ${streak} 天了，` : "";
  return `${keep}今天还没练：先做 5 分钟每日复习，再上一节短课。打开 localhost:3000`;
}

export async function checkReminder(now = new Date()) {
  const latest = await readLatest();
  if (!latest?.state) return false;
  const s = latest.state as AppState;
  if (!shouldRemind(s, now, await lastSent())) return false;
  await markSent(dateKey(now)); // once a day, even if the notification fails
  return notify("English OS · 该练英语了", reminderText(s));
}

let started = false;
export function startReminderLoop() {
  if (started || process.env.ENGLISH_OS_REMINDER === "off") return;
  started = true;
  const tick = () => { checkReminder().catch(() => {}); };
  setTimeout(tick, 15_000);
  setInterval(tick, 60_000).unref();
}
