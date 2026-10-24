"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { DAY_TITLES, getDay, weekOf } from "@/content/days";
import { DaySession } from "@/components/DaySession";
import { isUnlocked } from "@/lib/progress";
import { useAppState } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

export default function DayPage() {
  const params = useParams<{ day: string }>();
  const n = Number(params.day);
  const plan = getDay(n);
  const meta = DAY_TITLES.find((d) => d.day === n);
  const s = useAppState();
  const hydrated = useHydrated();
  const [preview, setPreview] = useState(false);

  if (!meta) return <div className="page-head"><h1>没有这一天</h1><Link href="/bootcamp" className="btn">返回课程</Link></div>;

  return (
    <div>
      <div className="page-head" style={{ paddingBottom: 14 }}>
        <div className="eyebrow"><Link href="/bootcamp" style={{ textDecoration: "none" }}>Bootcamp</Link> / Week {weekOf(n).week} / Day {n}</div>
        <h1>{meta.title} <span className="muted" style={{ fontSize: "1.1rem", fontWeight: 400 }}>{meta.titleEn}</span></h1>
        <p>{meta.outcome}</p>
      </div>
      {!hydrated ? (
        <p className="muted">加载本地进度…</p>
      ) : !plan ? (
        <div className="card"><p>Day {n} 的课程内容还在制作中。</p><Link href="/bootcamp" className="btn">返回课程</Link></div>
      ) : !isUnlocked(s, n) && !preview ? (
        <div className="card">
          <h3>建议先完成 Day {n - 1}</h3>
          <p className="muted">课程按顺序设计：后一天会复习前一天的错误。你也可以先预览内容，但计时和记录会照常保存。</p>
          <div className="row">
            <Link className="btn primary" href={`/bootcamp/${n - 1}`}>去 Day {n - 1}</Link>
            <button className="btn" onClick={() => setPreview(true)}>仍然打开</button>
          </div>
        </div>
      ) : (
        <DaySession plan={plan} />
      )}
    </div>
  );
}
