"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { dailyQueue } from "@/lib/daily";
import { dateKey, DEFAULT_REMINDER, lastPracticed, practiceByDate, practiceStreak } from "@/lib/practice";
import { isShort, requirements } from "@/lib/progress";
import { update, type AppState } from "@/lib/store";
import type { DayPlan } from "@/content/types";

const daysBetween = (a: string, b: string) => {
  const [y1, m1, d1] = a.split("-").map(Number), [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((+new Date(y2, m2 - 1, d2) - +new Date(y1, m1 - 1, d1)) / 86400000);
};

// The first thing on the dashboard: a small, finishable plan for today.
export function TodayPlan({ s, day, plan, now }: { s: AppState; day: number; plan?: DayPlan; now: number }) {
  const today = dateKey(new Date(now));
  const q = dailyQueue(s, today);
  const left = q.items.filter((i) => !q.doneToday.includes(i.skill)).length;
  const rec = s.days[day];
  const reqs = plan ? requirements(plan, s, now) : [];
  const reqDone = reqs.filter((r) => r.done).length;
  const minutes = Math.round(practiceByDate(s).get(today)?.minutes ?? 0);
  const streak = practiceStreak(s, today);
  const last = lastPracticed(s);
  const gap = last ? daysBetween(last, today) : null;
  const reviewDone = q.items.length > 0 && left === 0;

  return (
    <section className="card" style={{ marginTop: 8, borderColor: "var(--accent)" }} data-testid="today-plan">
      <div className="row between" style={{ flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ margin: 0 }}>今天这样练 · 15–30 分钟</h2>
        <div className="row" style={{ gap: 6 }}>
          <span className={`badge ${streak ? "ok" : ""}`}>{streak ? `连续 ${streak} 天` : "今天开始新的连续记录"}</span>
          <span className="badge">今天已练 {minutes} 分钟</span>
        </div>
      </div>
      {gap !== null && gap >= 3 ? (
        <p className="small muted" style={{ margin: "8px 0 0" }}>上次练习是 {gap} 天前。没关系，不用补，从下面两步接着来就行。</p>
      ) : null}
      <ol className="stack" style={{ listStyle: "none", padding: 0, margin: "12px 0 0" }}>
        <li className="row between" style={{ gap: 8, flexWrap: "wrap" }}>
          <span className="row" style={{ gap: 8 }}>
            <span style={{ width: 18, color: reviewDone ? "var(--ok)" : "var(--muted)" }}>{reviewDone ? "✓" : "1"}</span>
            <span>
              <b>复习自己的错题</b>
              <span className="small muted">
                {" "}· {left ? `今天 ${left} 项，约 ${Math.max(3, left)} 分钟` : q.items.length ? "今天已完成" : "还没有错题需要复习，可以跳过"}
              </span>
            </span>
          </span>
          {left ? <Link href="/review" className="btn primary sm">开始复习 →</Link> : null}
        </li>
        <li className="row between" style={{ gap: 8, flexWrap: "wrap" }}>
          <span className="row" style={{ gap: 8 }}>
            <span style={{ width: 18, color: rec?.completedAt ? "var(--ok)" : "var(--muted)" }}>{rec?.completedAt ? "✓" : "2"}</span>
            <span>
              <b>Day {day} {isShort(rec) ? "短课" : "完整版"}</b>
              <span className="small muted">
                {" "}· {rec?.completedAt ? "今天的课已完成" : plan ? `${isShort(rec) ? "约 30 分钟" : "60–90 分钟"}，完成条件 ${reqDone}/${reqs.length}` : "内容制作中"}
                {rec?.startedAt && !rec.completedAt ? "，从上次停下的地方继续" : ""}
              </span>
            </span>
          </span>
          {plan && !rec?.completedAt ? <Link href={`/bootcamp/${day}`} className={`btn sm ${left ? "" : "primary"}`}>{rec?.startedAt ? "继续" : "开始"} →</Link> : null}
        </li>
      </ol>
      <ReminderSettings s={s} />
    </section>
  );
}

function ReminderSettings({ s }: { s: AppState }) {
  const r = s.settings.reminder ?? DEFAULT_REMINDER;
  const [status, setStatus] = useState<{ supported: boolean; lastSent: string | null } | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/reminder", { cache: "no-store" }).then((x) => (x.ok ? x.json() : null)).then(setStatus).catch(() => setStatus(null));
  }, []);

  const set = (patch: Partial<typeof r>) => update((st) => { st.settings.reminder = { ...r, ...patch }; });

  async function test() {
    setMsg(null);
    const res = await fetch("/api/reminder", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "test" }) }).catch(() => null);
    const body = res && (await res.json().catch(() => null));
    setMsg(body?.ok ? "已发送。如果没看到，请在「系统设置 → 通知」里允许「脚本编辑器」发送通知。" : body?.supported === false ? "只有在 Mac 上运行时才能弹出通知。" : "通知没有发出去，请看一下网站日志。");
  }

  return (
    <div className="row" style={{ gap: 8, flexWrap: "wrap", marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
      <label className="row small" style={{ gap: 6 }}>
        <input type="checkbox" checked={r.enabled} onChange={(e) => set({ enabled: e.target.checked })} aria-label="每天提醒我练习" />
        每天
        <input type="time" className="input" style={{ width: 140, padding: "4px 8px" }} value={r.time} onChange={(e) => e.target.value && set({ time: e.target.value })} aria-label="提醒时间" />
        如果还没练，就提醒我
      </label>
      <button className="btn ghost sm" onClick={test}>发一条测试通知</button>
      <span className="tiny muted">
        {status && !status.supported ? "通知只在 Mac 上可用。" : r.enabled ? "网站在后台运行时会准时提醒，当天练过就不再提醒。" : ""}
      </span>
      {msg ? <div className="tiny" style={{ width: "100%" }}>{msg}</div> : null}
    </div>
  );
}
