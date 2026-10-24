"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SKILL_MAP } from "@/content/skills";
import { PlayButton } from "@/components/Audio";
import { QuizCard } from "@/components/DaySession";
import { drillFor } from "@/lib/coach";
import { dailyQueue, dailyQuiz, lastResultToday, recordDaily, DAILY_INTERVALS } from "@/lib/daily";
import { useAppState } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

const fmtDate = (d: string) => {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "short" });
};

export default function ReviewPage() {
  const s = useAppState();
  const h = useHydrated();
  if (!h) return <div className="page-head"><h1>每日复习</h1><p className="muted">加载本地进度…</p></div>;
  const q = dailyQueue(s);
  const left = q.items.filter((i) => !q.doneToday.includes(i.skill)).length;

  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Daily Review · {fmtDate(q.today)}</div>
        <h1>每日复习</h1>
        <p>从你自己的错题里挑出今天该复习的音，每天 5–10 分钟。答对了，下次间隔变长（{DAILY_INTERVALS.join(" → ")} 天）；答错了，明天再来。不练新课的日子也可以做。</p>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="card flat"><div className="stat"><b>{left}</b><span>今天还剩</span></div></div>
        <div className="card flat"><div className="stat"><b>{q.streak}</b><span>连续复习天数</span></div></div>
        <div className="card flat"><div className="stat"><b>{q.mastered.length}</b><span>已掌握（完成 {DAILY_INTERVALS.length} 次间隔）</span></div></div>
      </div>

      {q.items.length ? (
        <div className="stack">
          {q.items.map((it, i) => <DailyCard key={it.skill} n={i + 1} skill={it.skill} done={q.doneToday.includes(it.skill)} />)}
          {!left ? <div className="notice info">今天的复习做完了。明天会根据今天的结果自动排好新的内容。</div> : null}
        </div>
      ) : (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>今天没有到期的复习</h3>
          <p className="small muted">每日复习来自你的错题：辨音题第一次答错、跟读对比时标记的问题、自己记录的错误和 ELSA 记录。{Object.keys(s.daily?.items ?? {}).length || s.errors.length ? "" : "目前还没有错题记录。"}</p>
          <Link href="/" className="btn">回到今天的训练</Link>
        </div>
      )}

      {q.later.length ? (
        <section className="card flat" style={{ marginTop: 20 }}>
          <h3>之后的复习安排</h3>
          <ul className="small" style={{ margin: 0 }}>
            {q.later.slice(0, 12).map((it) => <li key={it.skill}>{fmtDate(it.due)}：{SKILL_MAP[it.skill]?.label ?? it.skill}</li>)}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function DailyCard({ n, skill, done }: { n: number; skill: string; done: boolean }) {
  const s = useAppState();
  const sk = SKILL_MAP[skill];
  const quiz = useMemo(() => dailyQuiz(skill), [skill]);
  const drill = useMemo(() => (sk ? drillFor(sk) : { pairs: [] }), [sk]);
  const [answered, setAnswered] = useState(false);
  const last = lastResultToday(s, skill);
  const it = s.daily?.items[skill];
  if (!sk) return null;
  return (
    <section className="card">
      <div className="row between">
        <div className="row"><span className="badge">{n}</span><b>{sk.label}</b><span className="tiny muted">Day {sk.day}</span></div>
        {done ? <span className={`badge ${last ? "ok" : "bad"}`}>{last ? `通过 · 下次 ${it?.due ?? ""}` : "明天再练"}</span> : <span className="badge warn">待复习</span>}
      </div>
      <p className="small" style={{ margin: "8px 0 4px" }}><b>动作：</b>{sk.action}</p>
      <p className="tiny muted" style={{ margin: "0 0 8px" }}>常见问题：{sk.chineseTrap}</p>
      <div className="row" style={{ gap: 4, marginBottom: 8 }}>
        {drill.pairs.length
          ? drill.pairs.slice(0, 4).map((p) => <span key={p.join("-")} className="row" style={{ gap: 2 }}>{p.map((w) => <PlayButton key={w} text={w} label={w} />)}<span className="tiny muted" style={{ margin: "0 6px" }}>·</span></span>)
          : sk.words.slice(0, 6).map((w) => <PlayButton key={w} text={w} label={w} />)}
        {sk.sentence ? <PlayButton text={sk.sentence} label="句子" /> : null}
      </div>
      <p className="tiny muted">先听，再跟着大声说三遍，然后做下面的题。</p>
      {done && !answered ? null : quiz ? (
        <QuizCard q={quiz} day={0} attempts={[]} onAnswer={(c) => { if (!answered && !done) { setAnswered(true); recordDaily(skill, c); } }} />
      ) : (
        <div className="row">
          <button className="btn sm" disabled={done} onClick={() => recordDaily(skill, true)}>说三遍，自评已改善</button>
          <button className="btn sm" disabled={done} onClick={() => recordDaily(skill, false)}>还不行，明天再练</button>
        </div>
      )}
    </section>
  );
}
