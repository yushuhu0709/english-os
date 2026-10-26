"use client";

import { useMemo, useState } from "react";
import { SKILLS, SKILL_MAP, skillLabel } from "@/content/skills";
import { PlayButton } from "@/components/Audio";
import { SLOW_RATE } from "@/lib/tts";
import { ElsaForm, ElsaList } from "@/components/Elsa";
import { analyzeError, analyzeSentence, drillFor, VERIFY } from "@/lib/coach";
import { ELSA_GUIDANCE } from "@/lib/elsa";
import { activeWeek, addError, currentDay } from "@/lib/progress";
import { buildReport } from "@/lib/report";
import { WEEKS } from "@/content/days";
import { uid, update, useAppState } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

const TABS = [
  { id: "explain", label: "发音讲解" },
  { id: "error", label: "错误分析" },
  { id: "sentence", label: "句子重音与语流" },
  { id: "elsa", label: "ELSA 辅助记录" },
  { id: "review", label: "复习建议" },
  { id: "ai", label: "AI 设置与提问" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default function CoachPage() {
  const h = useHydrated();
  const [tab, setTab] = useState<Tab>("explain");
  const [aiQuestion, setAiQuestion] = useState("");
  const askAi = (q: string) => { setAiQuestion(q); setTab("ai"); window.scrollTo({ top: 0 }); };
  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">AI Pronunciation Coach</div>
        <h1>AI Coach</h1>
        <p>解释发音原理、分析错误、生成专项练习、记录 ELSA 反馈。默认使用内置的语音学规则；填写 API key 后可以向 AI 追问。教练只看得到文字和你的训练记录，听不到你的声音，所有无法验证的判断都会标注。</p>
      </div>
      <div className="steps">
        {TABS.map((t) => <button key={t.id} className={`step-pill ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>
      {!h ? <p className="muted">加载中…</p> : (
        <>
          {tab === "explain" && <ExplainTab askAi={askAi} />}
          {tab === "error" && <ErrorTab askAi={askAi} />}
          {tab === "sentence" && <SentenceTab askAi={askAi} />}
          {tab === "elsa" && <ElsaTab />}
          {tab === "review" && <ReviewTab askAi={askAi} />}
          {tab === "ai" && <AiTab initial={aiQuestion} />}
        </>
      )}
    </div>
  );
}

function SkillCard({ id }: { id: string }) {
  const sk = SKILL_MAP[id];
  if (!sk) return null;
  const drill = drillFor(sk);
  return (
    <div className="card">
      <div className="row between"><h3 style={{ margin: 0 }}>{sk.label}</h3><span className="badge">Day {sk.day}</span></div>
      <p style={{ marginTop: 10 }}><b>是什么：</b>{sk.explain}</p>
      <p><b>怎么做：</b>{sk.action}</p>
      <p><b>中文母语者常见问题：</b>{sk.chineseTrap}</p>
      {drill.pairs.length ? (
        <div className="stack" style={{ gap: 6 }}>
          <b className="small">对比练习</b>
          <div className="row">{drill.pairs.map((p) => <span key={p.join()} className="row" style={{ gap: 2, display: "inline-flex" }}>{p.map((w) => <PlayButton key={w} text={w} label={w} />)}<span className="muted" style={{ margin: "0 6px" }}>·</span></span>)}</div>
        </div>
      ) : (
        <div className="stack" style={{ gap: 6 }}>{sk.words.map((w) => <span key={w} className="row"><PlayButton text={w.replace(/[↗↘]/g, "")} label="听" /> {w}</span>)}</div>
      )}
      {drill.sentence ? <div className="row" style={{ marginTop: 8 }}><PlayButton text={drill.sentence} label="句子" /> <span>{drill.sentence}</span></div> : null}
      <p className="tiny muted" style={{ marginTop: 10 }}>内容依据：Cruttenden《Gimson&apos;s Pronunciation of English》、Lindsey《English After RP》等 SSBE 描述，以及《1000小时》、马徐骏课程笔记中的训练方法。</p>
    </div>
  );
}

function ExplainTab({ askAi }: { askAi: (q: string) => void }) {
  const [id, setId] = useState(SKILLS[2].id);
  return (
    <div className="grid" style={{ gridTemplateColumns: "minmax(0,260px) minmax(0,1fr)", alignItems: "start" }}>
      <div className="stack" style={{ gap: 4 }}>
        {[1, 2, 3, 4, 5, 6].map((d) => (
          <div key={d}>
            <div className="eyebrow" style={{ margin: "8px 0 4px" }}>Day {d}</div>
            {SKILLS.filter((s) => s.day === d).map((s) => (
              <button key={s.id} className={`btn sm ${id === s.id ? "dark" : "ghost"}`} style={{ width: "100%", justifyContent: "flex-start" }} onClick={() => setId(s.id)}>{s.label}</button>
            ))}
          </div>
        ))}
      </div>
      <div className="stack">
        <SkillCard id={id} />
        <button className="btn" onClick={() => askAi(`请更详细地解释 ${skillLabel(id)}：它和中文里最接近的音有什么不同？给我一组循序渐进的练习。`)}>向 AI 追问这个音</button>
      </div>
    </div>
  );
}

function ErrorTab({ askAi }: { askAi: (q: string) => void }) {
  const s = useAppState();
  const [word, setWord] = useState("");
  const [desc, setDesc] = useState("");
  const [result, setResult] = useState<ReturnType<typeof analyzeError> | null>(null);
  const [added, setAdded] = useState<string[]>([]);
  return (
    <div className="stack">
      <div className="card">
        <h3>描述一个发音问题</h3>
        <p className="small muted">可以是你自己听出来的、老师指出的或 ELSA 标出的。例如：「three 听起来像 free」「water 的 t 我读成了 d」「bed 和 bad 分不清」。</p>
        <div className="grid grid-3">
          <input className="input" value={word} onChange={(e) => setWord(e.target.value)} placeholder="单词或短语" />
          <input className="input" style={{ gridColumn: "span 2" }} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="哪里不对" />
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          <button className="btn primary" disabled={!word && !desc} onClick={() => { setResult(analyzeError(word, desc)); setAdded([]); }}>分析</button>
        </div>
      </div>
      {result ? (
        <>
          <div className="notice">{result.verify}</div>
          {result.skills.length ? result.skills.map((sk) => (
            <div key={sk.id} className="stack">
              <SkillCard id={sk.id} />
              <div className="row">
                <button className="btn" disabled={added.includes(sk.id)} onClick={() => { addError({ day: currentDay(s), source: "coach", skill: sk.id, text: word || desc, detail: desc }); setAdded((a) => [...a, sk.id]); }}>
                  {added.includes(sk.id) ? "已加入错误记录和复习" : "加入错误记录和复习"}
                </button>
                <button className="btn ghost" onClick={() => askAi(`我读 "${word}" 时的问题：${desc}。可能的原因是什么？请给我一个 5 分钟的专项练习。`)}>向 AI 追问</button>
              </div>
            </div>
          )) : <p className="muted">没有匹配到具体的训练项目。试着写出具体的音（如 th、/æ/、重音），或者向 AI 追问。</p>}
        </>
      ) : null}
    </div>
  );
}

function SentenceTab({ askAi }: { askAi: (q: string) => void }) {
  const [text, setText] = useState("I was going to ask for some of them, but they were sold out.");
  const toks = useMemo(() => analyzeSentence(text), [text]);
  return (
    <div className="stack">
      <div className="card">
        <h3>分析一个句子</h3>
        <textarea className="input" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="row" style={{ marginTop: 8 }}><PlayButton text={text} label="听示范" /><PlayButton text={text} label="慢" rate={SLOW_RATE} /></div>
      </div>
      <div className="card">
        <div className="marked" style={{ lineHeight: 2.6 }}>
          {toks.map((t, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "flex-start" }}>
              <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", marginRight: t.linkNext ? 0 : 8 }}>
                <span style={{ fontWeight: t.role !== "function" ? 700 : 400, color: t.nucleus ? "var(--bad)" : t.role === "function" ? "var(--muted)" : "var(--accent)", textDecoration: t.nucleus ? "underline" : undefined }}>
                  {t.word}{t.linkNext ? <span className="link" title={t.linkNext === "linking-r" ? "连接 r" : "辅音 + 元音连读"}>‿</span> : null}
                </span>
                <span className="ipa tiny muted" style={{ lineHeight: 1.2 }}>{t.weak ? `/${t.weak}/` : t.linkNext === "linking-r" ? "+r" : "\u00a0"}</span>
              </span>
              {t.pauseAfter ? <span className="pause" style={{ marginRight: 8 }}>|</span> : null}
            </span>
          ))}
        </div>
        <div className="row small" style={{ marginTop: 10 }}>
          <span className="badge accent">绿色粗体：实词，通常重读</span>
          <span className="badge bad">红色下划线：可能的核心重音</span>
          <span className="badge">灰色：功能词，给出弱读式</span>
          <span className="badge warn">| 意群停顿</span>
          <span className="badge">‿ 可能连读</span>
        </div>
        <div className="notice" style={{ marginTop: 10 }}>{VERIFY.rules} 句子重音最终由语境决定：如果你要强调对比（例如 <i>I</i> did it, not him），重音会移动；功能词在强调或句末时用强读式。连读按拼写推断，以示范音频为准。</div>
      </div>
      <button className="btn" onClick={() => askAi(`请分析这句话的句子重音、弱读、意群和语调，并说明在 SSBE 里怎么读：「${text}」`)}>向 AI 追问这句话</button>
    </div>
  );
}

function ElsaTab() {
  return (
    <div className="stack">
      <div className="card tint">
        <h3>使用 ELSA 前请注意</h3>
        <ul>{ELSA_GUIDANCE.map((g) => <li key={g} className="small">{g}</li>)}</ul>
        <p className="small" style={{ margin: 0 }}>ELSA 不提供可导入的报告文件，所以这里用手动记录 + 截图。如果你之后找到可导出的数据，可以发给我再加导入功能。</p>
      </div>
      <div className="card"><h3>新增 ELSA 记录</h3><ElsaForm /></div>
      <div className="card"><h3>全部记录</h3><ElsaList /></div>
    </div>
  );
}

function ReviewTab({ askAi }: { askAi: (q: string) => void }) {
  const s = useAppState();
  const r = useMemo(() => buildReport(s, activeWeek(s)), [s]);
  const active = s.reviews.filter((x) => !x.mastered).sort((a, b) => a.dueDay - b.dueDay);
  return (
    <div className="stack">
      <div className="notice info">根据你本周（Week {r.week.week}）的训练记录排序：Day {r.week.retestDay} 复测错误、每天辨音首次答错、跟读对比自评、自查和 ELSA 记录、复习未通过的次数。只使用这台设备上保存的数据。</div>
      <div className="grid grid-2" style={{ alignItems: "start" }}>
        <div className="card">
          <h3>当前弱项</h3>
          {r.weaknesses.length ? (
            <ol>{r.weaknesses.slice(0, 8).map((w) => <li key={w.skill}><b>{w.label}</b> <span className="tiny muted">权重 {w.score}</span><div className="small muted">{w.evidence.slice(0, 2).join("；")}</div></li>)}</ol>
          ) : <p className="muted small">还没有足够的训练记录。</p>}
        </div>
        <div className="card">
          <h3>复习排期</h3>
          {active.length ? (
            <table className="t"><thead><tr><th>项目</th><th>下次</th><th>进度</th></tr></thead><tbody>
              {active.map((t) => <tr key={t.id}><td>{t.label}</td><td>Day {t.dueDay}</td><td className="small">{t.stage}/3 {t.history.length ? `· 最近${t.history[t.history.length - 1].correct ? "通过" : "未通过"}` : ""}</td></tr>)}
            </tbody></table>
          ) : <p className="muted small">没有待复习的项目。</p>}
          <p className="tiny muted">复习间隔按训练日计：答对后 1 → 2 → 3 天，三次通过即视为掌握；答错回到 1 天。</p>
        </div>
      </div>
      {r.weaknesses.length ? <button className="btn" onClick={() => askAi("根据我的训练记录，接下来几天的复习应该怎么安排？每天 10 分钟。")}>请 AI 根据记录建议复习安排</button> : null}
    </div>
  );
}

function contextSummary(s: ReturnType<typeof useAppState>): string {
  const pc = (x: { n: number; c: number }) => (x.n ? Math.round((x.c / x.n) * 100) + "%" : "无");
  const reports = WEEKS.filter((w) => w.week === 1 || s.days[w.firstDay]?.startedAt).map((w) => buildReport(s, w));
  const lines = reports.flatMap((r) => [
    `Week ${r.week.week}：已完成 ${r.days.filter((d) => d.completed).map((d) => `Day ${d.day}`).join("、") || "无"}；累计 ${r.totalMinutes} 分钟。`,
    `Week ${r.week.week} 基线听辨正确率：Day ${r.week.baselineDay} ${pc(r.baseline.d1)}，Day ${r.week.retestDay} ${pc(r.baseline.d7)}。`,
    `Week ${r.week.week} 弱项：${r.weaknesses.slice(0, 5).map((w) => `${w.label}（${w.evidence.slice(0, 2).join("；")}）`).join(" | ") || "暂无"}`,
  ]);
  lines.push(
    `ELSA 记录：${s.elsa.slice(-5).map((e) => `${e.word}: ${e.issue}${e.accentDifference ? "（判定为口音差异）" : ""}`).join("；") || "无"}`,
  );
  return lines.join("\n");
}

function AiTab({ initial }: { initial: string }) {
  const s = useAppState();
  const [q, setQ] = useState(initial);
  const [withContext, setWithContext] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [key, setKey] = useState(s.settings.apiKey ?? "");
  const [model, setModel] = useState(s.settings.model);

  async function ask() {
    setBusy(true); setErr(null);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "content-type": "application/json", ...(s.settings.apiKey ? { "x-user-api-key": s.settings.apiKey } : {}) },
        body: JSON.stringify({ question: q, model: s.settings.model, context: withContext ? contextSummary(s) : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      update((st) => { st.coach.push({ id: uid("coach"), createdAt: new Date().toISOString(), question: q, answer: data.text, source: "ai", model: data.model }); });
    } catch (e) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  }

  return (
    <div className="stack">
      <div className="card">
        <h3>AI 设置（可选）</h3>
        <p className="small muted">AI 教练通过本机运行的 English OS 服务调用 Anthropic API。key 只保存在这个浏览器的本地存储中；也可以不在这里填写，改为启动前设置环境变量 <span className="kbd">ANTHROPIC_API_KEY</span>。不配置时，其它所有功能照常使用。</p>
        <div className="grid grid-3">
          <input className="input" type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="sk-ant-…" />
          <input className="input" value={model} onChange={(e) => setModel(e.target.value)} placeholder="模型 ID" />
          <button className="btn" onClick={() => update((st) => { st.settings.apiKey = key.trim() || undefined; st.settings.model = model.trim() || "claude-sonnet-5-5"; })}>保存设置</button>
        </div>
      </div>
      <div className="card">
        <h3>向 AI 提问</h3>
        <textarea className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="例如：为什么我的 /æ/ 总被 ELSA 判错？" />
        <div className="row" style={{ marginTop: 8 }}>
          <label className="row small"><input type="checkbox" checked={withContext} onChange={(e) => setWithContext(e.target.checked)} />附上训练记录摘要（完成天数、正确率、弱项、ELSA）</label>
          <button className="btn primary" disabled={!q.trim() || busy} onClick={ask}>{busy ? "思考中…" : "提问"}</button>
        </div>
        {err ? <div className="notice bad" style={{ marginTop: 10 }}>{err}</div> : null}
      </div>
      {s.coach.length ? (
        <div className="stack">
          {[...s.coach].reverse().map((c) => (
            <div key={c.id} className="card flat">
              <div className="row between"><b>{c.question}</b><span className="badge warn">AI 生成 · 未经声学验证</span></div>
              <div className="small" style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{c.answer}</div>
              <div className="row between" style={{ marginTop: 6 }}>
                <span className="tiny muted">{new Date(c.createdAt).toLocaleString()} · {c.model}</span>
                <button className="btn ghost sm danger" onClick={() => update((st) => { st.coach = st.coach.filter((x) => x.id !== c.id); })}>删除</button>
              </div>
            </div>
          ))}
          <div className="notice small">{VERIFY.ai}</div>
        </div>
      ) : null}
    </div>
  );
}
