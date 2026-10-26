"use client";

import Link from "next/link";
import { DAY_TITLES, getDay, type WeekPlan } from "@/content/days";
import { currentDay, quizAccuracy } from "@/lib/progress";
import type { AppState } from "@/lib/store";

export function DayStrip({ s, detailed = false, week }: { s: AppState; detailed?: boolean; week?: WeekPlan }) {
  const cur = currentDay(s);
  const titles = week ? DAY_TITLES.filter((d) => d.day >= week.firstDay && d.day <= week.lastDay) : DAY_TITLES;
  return (
    <div className={`grid ${detailed ? "grid-2" : "grid-4"}`} style={detailed ? undefined : { gridTemplateColumns: "repeat(7, minmax(0,1fr))" }}>
      {titles.map((d) => {
        const rec = s.days[d.day];
        const plan = getDay(d.day);
        const done = !!rec?.completedAt;
        const started = !!rec?.startedAt;
        const acc = plan && rec ? quizAccuracy(plan.identify, rec).accuracy : null;
        const status = done ? "已完成" : d.day === cur ? (started ? "进行中" : "今天") : started ? "进行中" : "未开始";
        return (
          <Link
            key={d.day}
            href={`/bootcamp/${d.day}`}
            className="card flat"
            style={{
              textDecoration: "none",
              padding: detailed ? 20 : 12,
              borderColor: d.day === cur ? "var(--accent)" : undefined,
              background: done ? "var(--ok-soft)" : undefined,
            }}
          >
            <div className="row between">
              <span className="eyebrow">Day {d.day}</span>
              <span className={`badge ${done ? "ok" : d.day === cur ? "accent" : ""}`}>{status}</span>
            </div>
            <div className="serif" style={{ fontWeight: 600, fontSize: detailed ? "1.2rem" : "0.95rem", marginTop: 4 }}>{d.title}</div>
            {detailed ? (
              <>
                <div className="small muted">{d.titleEn}</div>
                <p className="small" style={{ margin: "8px 0" }}>{d.outcome}</p>
                <div className="row tiny muted">
                  {plan ? <span>{Object.values(plan.blocks).reduce((a, b) => a + b, 0)} 分钟</span> : <span>内容制作中</span>}
                  {rec ? <span>· 已练 {Math.round(rec.totalMs / 60000)} 分钟</span> : null}
                  {acc != null ? <span>· 辨音 {Math.round(acc * 100)}%</span> : null}
                  {rec && rec.round > 1 ? <span>· 第 {rec.round} 轮</span> : null}
                </div>
              </>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
