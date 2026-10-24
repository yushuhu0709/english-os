"use client";

import Link from "next/link";
import { DAY_TITLES, getDay } from "@/content/days";
import { STEP_LABEL, STEP_ORDER } from "@/content/types";
import { DayStrip } from "@/components/DayStrip";
import { VoiceStatus } from "@/components/Audio";
import { currentDay, dueReviews, fmtMin, liveRoundMs, requirements, stepStatus } from "@/lib/progress";
import { useAppState } from "@/lib/store";
import { useHydrated, useNow } from "@/lib/useHydrated";
import { dailyQueue } from "@/lib/daily";

export default function Dashboard() {
  const s = useAppState();
  const h = useHydrated();
  const now = useNow(1000, h);
  if (!h) return <div className="page-head"><h1>English OS</h1><p className="muted">加载本地进度…</p></div>;

  const day = currentDay(s);
  const plan = getDay(day);
  const meta = DAY_TITLES[day - 1];
  const rec = s.days[day];
  const allDone = Object.values(s.days).filter((d) => d.completedAt).length;
  const weekDone = !!s.days[7]?.completedAt;
  const due = dueReviews(s, day).filter((t) => !rec?.reviewed[t.id]);
  const totalMs = Object.values(s.days).reduce((a, d) => a + d.totalMs, 0);
  const recCount = Object.values(s.days).reduce((a, d) => a + Object.values(d.recordings).reduce((x, y) => x + y.length, 0), 0);
  const openErrors = s.errors.filter((e) => !e.resolved).length;
  const reqs = plan ? requirements(plan, s, now) : [];

  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">English OS · Phase 1 · {new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" })}</div>
        <h1>{weekDone ? "第一周训练已完成" : `今天：Day ${day} · ${meta.title}`}</h1>
        <p>{weekDone ? "Week 1 Pronunciation Report 已经可以查看。第二周的内容等你提供真实反馈后再设计。" : meta.outcome}</p>
      </div>

      <VoiceStatus />

      <div className="grid grid-2" style={{ alignItems: "start", marginTop: 8 }}>
        <section className="card">
          <div className="row between">
            <h2 style={{ margin: 0 }}>今日任务</h2>
            {rec?.running ? <span className="badge accent">计时中 {fmtMin(liveRoundMs(rec, now))}</span> : rec?.startedAt ? <span className="badge warn">已暂停 {fmtMin(liveRoundMs(rec, now))}</span> : null}
          </div>
          {weekDone ? (
            <div className="stack" style={{ marginTop: 12 }}>
              <Link href="/progress#report" className="btn primary lg">查看 Week 1 报告</Link>
              <Link href="/bootcamp" className="btn">回看任意一天或再练一轮</Link>
            </div>
          ) : plan ? (
            <>
              <ul style={{ listStyle: "none", padding: 0, margin: "12px 0" }}>
                {STEP_ORDER.map((k, i) => {
                  const st = stepStatus(plan, rec, k, s);
                  return (
                    <li key={k} className="row small" style={{ gap: 8, padding: "3px 0" }}>
                      <span style={{ width: 16, color: st.complete && st.total ? "var(--ok)" : "var(--muted)" }}>{st.complete && st.total ? "✓" : "○"}</span>
                      <span style={{ flex: 1 }}>{i + 1}. {STEP_LABEL[k].en} · {STEP_LABEL[k].zh}</span>
                      <span className="tiny muted">{st.done}/{st.total}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="bar" style={{ marginBottom: 12 }}><i style={{ width: `${(reqs.filter((r) => r.done).length / reqs.length) * 100}%` }} /></div>
              <Link href={`/bootcamp/${day}`} className="btn primary lg" style={{ width: "100%" }}>
                {rec?.startedAt ? "继续今天的训练" : "开始今天的训练"} →
              </Link>
              <p className="tiny muted" style={{ marginTop: 8 }}>
                目标 {Object.values(plan.blocks).reduce((a, b) => a + b, 0)} 分钟：{plan.blocks.understand} 理解 · {plan.blocks.perceive} 听辨与发音 · {plan.blocks.shadow} 跟读录音 · {plan.blocks.review} 复习
              </p>
            </>
          ) : (
            <p className="muted">Day {day} 的内容还在制作中。</p>
          )}
        </section>

        <div className="stack">
          <section className="card">
            <div className="grid grid-2">
              <div className="stat"><b>{allDone}/7</b><span>完成天数</span></div>
              <div className="stat"><b>{Math.round(totalMs / 60000)}</b><span>累计训练分钟</span></div>
              <div className="stat"><b>{recCount}</b><span>发音录音</span></div>
              <div className="stat"><b>{openErrors}</b><span>未解决的错误</span></div>
            </div>
          </section>
          <DailyCard s={s} />
          <section className="card">
            <div className="row between"><h3 style={{ margin: 0 }}>课内复习（第 7 步）</h3><span className="badge">{due.length}</span></div>
            {due.length ? (
              <ul className="small" style={{ marginTop: 8 }}>{due.map((t) => <li key={t.id}>{t.label}</li>)}</ul>
            ) : <p className="small muted" style={{ marginTop: 8, marginBottom: 0 }}>没有到期的复习。复习会出现在每天训练的第 7 步。</p>}
          </section>
          <section className="card flat">
            <h3>辅助工具</h3>
            <div className="row">
              <Link href="/lab" className="btn sm">IPA 与发音器官</Link>
              <Link href="/coach" className="btn sm">AI 教练 / 记录 ELSA</Link>
              <Link href="/progress" className="btn sm">训练记录</Link>
            </div>
          </section>
        </div>
      </div>

      <h3 style={{ marginTop: 32 }}>本周进度</h3>
      <DayStrip s={s} />
    </div>
  );
}

function DailyCard({ s }: { s: ReturnType<typeof useAppState> }) {
  const q = dailyQueue(s);
  const left = q.items.filter((i) => !q.doneToday.includes(i.skill)).length;
  return (
    <section className="card" style={{ borderColor: left ? "var(--accent)" : undefined }}>
      <div className="row between">
        <h3 style={{ margin: 0 }}>每日复习</h3>
        <span className={`badge ${left ? "accent" : "ok"}`}>{left ? `今天 ${left} 项` : q.items.length ? "今天已完成" : "暂无"}</span>
      </div>
      <p className="small muted" style={{ margin: "8px 0" }}>
        {left ? `按你的错题排好的 5–10 分钟复习。${q.streak ? `已连续 ${q.streak} 天。` : ""}` : q.items.length ? `已连续 ${q.streak} 天，明天再来。` : "答错的题和记录的问题会自动排进来。"}
      </p>
      {left ? <Link href="/review" className="btn primary" style={{ width: "100%" }}>开始每日复习 →</Link> : <Link href="/review" className="btn sm">查看复习安排</Link>}
    </section>
  );
}
