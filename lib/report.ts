import { BASELINE_QUIZ, BASELINE_RECORD } from "@/content/baseline";
import { DAY_TITLES, DAYS } from "@/content/days";
import { SKILL_MAP, skillLabel } from "@/content/skills";
import type { AppState } from "./store";

// Week 1 Pronunciation Report. Built only from what was recorded in this browser:
// timer data, first-attempt quiz answers, recordings, self-ratings, errors, ELSA notes
// and review history. Nothing here is an acoustic score.

export interface DayRow {
  day: number;
  title: string;
  completed: boolean;
  minutes: number;
  rounds: number;
  quizAnswered: number;
  quizCorrect: number;
  recordings: number;
  selfAvg: number | null;
  compareAvg: number | null;
  errors: number;
}

export interface BaselineSkillRow {
  skill: string;
  label: string;
  d1: { n: number; c: number };
  d7: { n: number; c: number };
}

export interface ItemChange {
  id: string;
  word: string;
  skill: string;
  d1: boolean | null;
  d7: boolean | null;
}

export interface Weakness {
  skill: string;
  label: string;
  score: number;
  evidence: string[];
  action: string;
}

export interface Report {
  generatedAt: string;
  ready: boolean;
  missingDays: number[];
  days: DayRow[];
  totalMinutes: number;
  baseline: { d1: { n: number; c: number }; d7: { n: number; c: number }; bySkill: BaselineSkillRow[]; items: ItemChange[] };
  recordingPairs: { id: string; text: string; d1: string | null; d7: string | null; d1Rating: number | null; d7Rating: number | null }[];
  practiced: { skill: string; label: string; action: string; reps: number; days: number[] }[];
  weaknesses: Weakness[];
  priorities: Weakness[];
  elsa: { total: number; accentDifferences: number; counted: number };
  caveats: string[];
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

export function buildReport(s: AppState): Report {
  const days: DayRow[] = DAY_TITLES.map((t) => {
    const d = s.days[t.day];
    const plan = DAYS.find((p) => p.day === t.day);
    let n = 0;
    let c = 0;
    if (plan && d) for (const q of plan.identify) { const a = d.quiz[q.id]?.[0]; if (a) { n++; if (a.correct) c++; } }
    const sa = d?.selfAssessment;
    return {
      day: t.day,
      title: t.title,
      completed: !!d?.completedAt,
      minutes: d ? Math.round(d.totalMs / 60000) : 0,
      rounds: d ? d.round : 0,
      quizAnswered: n,
      quizCorrect: c,
      recordings: d ? Object.values(d.recordings).reduce((a, b) => a + b.length, 0) : 0,
      selfAvg: sa ? (sa.clarity + sa.confidence + sa.effort) / 3 : null,
      compareAvg: d ? avg(Object.values(d.compared).map((x) => x.rating)) : null,
      errors: s.errors.filter((e) => e.day === t.day).length,
    };
  });

  // ── baseline vs re-test ──
  const d1 = s.days[1];
  const d7 = s.days[7];
  const first = (day: typeof d1, id: string) => day?.quiz[id]?.[0]?.correct ?? null;
  const items: ItemChange[] = BASELINE_QUIZ.map((q) => ({ id: q.id, word: q.say ?? q.prompt, skill: q.skill, d1: first(d1, q.id), d7: first(d7, q.id) }));
  const bySkillMap = new Map<string, BaselineSkillRow>();
  for (const it of items) {
    const row = bySkillMap.get(it.skill) ?? { skill: it.skill, label: skillLabel(it.skill), d1: { n: 0, c: 0 }, d7: { n: 0, c: 0 } };
    if (it.d1 !== null) { row.d1.n++; if (it.d1) row.d1.c++; }
    if (it.d7 !== null) { row.d7.n++; if (it.d7) row.d7.c++; }
    bySkillMap.set(it.skill, row);
  }
  const bySkill = [...bySkillMap.values()];
  const tot = (k: "d1" | "d7") => bySkill.reduce((a, r) => ({ n: a.n + r[k].n, c: a.c + r[k].c }), { n: 0, c: 0 });

  const recordingPairs = BASELINE_RECORD.map((r) => ({
    id: r.id,
    text: r.text,
    d1: d1?.recordings[r.id]?.slice(-1)[0] ?? null,
    d7: d7?.recordings[r.id]?.slice(-1)[0] ?? null,
    d1Rating: d1?.compared[r.id]?.rating ?? null,
    d7Rating: d7?.compared[r.id]?.rating ?? null,
  }));

  // ── practised articulatory actions (from produce reps on days actually trained) ──
  const practicedMap = new Map<string, { reps: number; days: Set<number> }>();
  for (const plan of DAYS) {
    const d = s.days[plan.day];
    if (!d) continue;
    for (const p of plan.produce) {
      const reps = d.produced[p.id] ?? 0;
      if (!reps) continue;
      const v = practicedMap.get(p.skill) ?? { reps: 0, days: new Set<number>() };
      v.reps += reps;
      v.days.add(plan.day);
      practicedMap.set(p.skill, v);
    }
  }
  const practiced = [...practicedMap.entries()]
    .map(([skill, v]) => ({ skill, label: skillLabel(skill), action: SKILL_MAP[skill]?.action ?? "", reps: v.reps, days: [...v.days].sort() }))
    .sort((a, b) => (SKILL_MAP[a.skill]?.day ?? 9) - (SKILL_MAP[b.skill]?.day ?? 9));

  // ── weaknesses: every signal adds weight and leaves an evidence line ──
  const W = new Map<string, Weakness>();
  const bump = (skill: string, pts: number, line: string) => {
    const w = W.get(skill) ?? { skill, label: skillLabel(skill), score: 0, evidence: [], action: SKILL_MAP[skill]?.action ?? "" };
    w.score += pts;
    if (!w.evidence.includes(line)) w.evidence.push(line);
    W.set(skill, w);
  };
  for (const it of items) {
    if (it.d7 === false) bump(it.skill, 3, `Day 7 复测仍听错「${it.word}」`);
    else if (it.d7 === null && it.d1 === false) bump(it.skill, 2, `Day 1 基线听错「${it.word}」，尚无复测数据`);
  }
  // quiz errors on teaching days (2–6), first attempts only
  for (const plan of DAYS.filter((p) => p.day >= 2 && p.day <= 6)) {
    const d = s.days[plan.day];
    if (!d) continue;
    const wrong = plan.identify.filter((q) => d.quiz[q.id]?.[0] && !d.quiz[q.id][0].correct);
    const by = new Map<string, number>();
    for (const q of wrong) by.set(q.skill, (by.get(q.skill) ?? 0) + 1);
    for (const [sk, n] of by) bump(sk, n, `Day ${plan.day} 辨音首次答错 ${n} 题`);
  }
  for (const e of s.errors.filter((e) => !e.resolved && (e.source === "compare" || e.source === "self" || e.source === "elsa"))) {
    const src = e.source === "compare" ? "跟读对比自评" : e.source === "self" ? "自查记录" : "ELSA 记录";
    bump(e.skill, 1, `${src}：${e.text}${e.detail ? `（${e.detail}）` : ""}`.slice(0, 120));
  }
  for (const r of s.reviews.filter((r) => !r.mastered && r.history.length)) {
    const fails = r.history.filter((h) => !h.correct).length;
    if (fails) bump(r.skill, fails, `复习中仍有 ${fails} 次未通过`);
  }
  const weaknesses = [...W.values()].sort((a, b) => b.score - a.score);
  const priorities = weaknesses.slice(0, 3);

  const missingDays = days.filter((d) => !d.completed).map((d) => d.day);
  const caveats = [
    "所有正确率均为辨音题第一次作答的结果；录音没有经过任何自动评分。",
    "跟读对比分数（1–5）是你自己的判断，只能和你自己的其它分数比较。",
    "示范音频为浏览器英式合成语音（除非你导入了真人音频），复测题目与 Day 1 完全相同，存在熟悉度带来的提升。",
  ];
  if (s.elsa.some((e) => e.accentDifference)) caveats.push("被判定为口音差异的 ELSA 反馈没有计入弱项。");

  return {
    generatedAt: new Date().toISOString(),
    ready: !!d7?.completedAt,
    missingDays,
    days,
    totalMinutes: days.reduce((a, d) => a + d.minutes, 0),
    baseline: { d1: tot("d1"), d7: tot("d7"), bySkill, items },
    recordingPairs,
    practiced,
    weaknesses,
    priorities,
    elsa: { total: s.elsa.length, accentDifferences: s.elsa.filter((e) => e.accentDifference).length, counted: s.elsa.filter((e) => !e.accentDifference).length },
    caveats,
  };
}

const pct = (x: { n: number; c: number }) => (x.n ? `${Math.round((x.c / x.n) * 100)}%（${x.c}/${x.n}）` : "—");

export function reportMarkdown(r: Report): string {
  const L: string[] = [];
  L.push(`# Week 1 Pronunciation Report`, ``, `生成时间：${new Date(r.generatedAt).toLocaleString()}　目标口音：Modern Standard Southern British English (SSBE)`, ``);
  if (!r.ready) L.push(`> 注意：Day 7 尚未完成，本报告为中期预览。未完成：Day ${r.missingDays.join(", ")}`, ``);
  L.push(`## 1. 七天训练结果`, ``, `| Day | 主题 | 完成 | 时长(分) | 辨音首次正确率 | 录音 | 自评均分 | 记录错误 |`, `|---|---|---|---|---|---|---|---|`);
  for (const d of r.days) L.push(`| ${d.day} | ${d.title} | ${d.completed ? "✓" : "—"} | ${d.minutes} | ${d.quizAnswered ? `${Math.round((d.quizCorrect / d.quizAnswered) * 100)}%` : "—"} | ${d.recordings} | ${d.selfAvg ? d.selfAvg.toFixed(1) : "—"} | ${d.errors} |`);
  L.push(``, `合计训练 ${r.totalMinutes} 分钟。`, ``);
  L.push(`## 2. Day 1 与 Day 7 可比录音`, ``, `| 材料 | Day 1 | Day 7 | 自评 D1→D7 |`, `|---|---|---|---|`);
  for (const p of r.recordingPairs) L.push(`| ${p.text} | ${p.d1 ? "有录音" : "缺"} | ${p.d7 ? "有录音" : "缺"} | ${p.d1Rating ?? "—"} → ${p.d7Rating ?? "—"} |`);
  L.push(``, `录音保存在本机浏览器中，请在 English OS 的 Progress 页面回放对比。`, ``);
  L.push(`## 3. 主要辨音错误和变化`, ``, `基线听辨总正确率：Day 1 ${pct(r.baseline.d1)} → Day 7 ${pct(r.baseline.d7)}`, ``, `| 项目 | Day 1 | Day 7 |`, `|---|---|---|`);
  for (const b of r.baseline.bySkill) L.push(`| ${b.label} | ${pct(b.d1)} | ${pct(b.d7)} |`);
  const improved = r.baseline.items.filter((i) => i.d1 === false && i.d7 === true).map((i) => i.word);
  const still = r.baseline.items.filter((i) => i.d1 === false && i.d7 === false).map((i) => i.word);
  const worse = r.baseline.items.filter((i) => i.d1 === true && i.d7 === false).map((i) => i.word);
  L.push(``, `- 改善：${improved.join("、") || "无"}`, `- 仍然听错：${still.join("、") || "无"}`, `- 新出现的错误：${worse.join("、") || "无"}`, ``);
  L.push(`## 4. 已练习的发音动作`, ``);
  for (const p of r.practiced) L.push(`- **${p.label}**（Day ${p.days.join("/")}，大声练习 ${p.reps} 遍）：${p.action}`);
  L.push(``, `## 5. 尚未掌握的音素或语流问题`, ``);
  if (!r.weaknesses.length) L.push(`没有记录到明显弱项。`);
  for (const w of r.weaknesses) L.push(`- **${w.label}**（证据权重 ${w.score}）：${w.evidence.slice(0, 4).join("；")}`);
  L.push(``, `## 6. 第二周建议的三个最高优先级项目`, ``, `以下只是建议，第二周课程尚未开发，等你反馈后再一起设计。`, ``);
  r.priorities.forEach((w, i) => L.push(`${i + 1}. **${w.label}**：${w.evidence[0] ?? ""}。练习方向：${w.action}`));
  L.push(``, `## 数据说明`, ``, ...r.caveats.map((c) => `- ${c}`));
  if (r.elsa.total) L.push(`- ELSA 记录 ${r.elsa.total} 条，其中 ${r.elsa.accentDifferences} 条判定为口音差异未计入。`);
  return L.join("\n");
}
