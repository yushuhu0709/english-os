"use client";

import { useMemo, useRef, useState } from "react";
import { skillLabel } from "@/content/skills";
import { TakeChip } from "@/components/Recorder";
import { PlayButton } from "@/components/Audio";
import { allImages, allRecordings, allRefAudio, blobToDataUrl, dataUrlToBlob, saveImage, saveRecording, saveRefAudio } from "@/lib/audioDb";
import { resolveError } from "@/lib/progress";
import { buildReport, reportMarkdown, type RecordingPair, type Report } from "@/lib/report";
import { WEEKS } from "@/content/days";
import { activeWeek } from "@/lib/progress";
import { replaceState, useAppState, type AppState } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { practiceStreak, recentDays } from "@/lib/practice";
import { backupNow, restoreFromBackup, useBackupStatus } from "@/lib/backup";

const REPORT_NAMES: Record<number, string> = { 1: "第一周发音报告", 2: "第二周语流报告", 3: "第三周日常对话报告", 4: "第四周与一个月报告" };

const pct = (x: { n: number; c: number }) => (x.n ? `${Math.round((x.c / x.n) * 100)}%` : "—");

export default function ProgressPage() {
  const s = useAppState();
  const h = useHydrated();
  const [picked, setPicked] = useState<number | null>(null);
  const week = WEEKS.find((w) => w.week === picked) ?? activeWeek(s);
  const r = useMemo(() => buildReport(s, week), [s, week]);
  if (!h) return <div className="page-head"><h1>Progress</h1><p className="muted">加载中…</p></div>;
  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Progress</div>
        <h1>训练记录</h1>
        <p>所有数据都来自你在这台设备上的真实训练：计时器时长、辨音题第一次作答、录音、自评、错误和复习。</p>
        <div className="row no-print" style={{ marginTop: 10 }} role="tablist">
          {WEEKS.map((w) => (
            <button key={w.week} role="tab" aria-selected={w.week === week.week} className={`btn sm ${w.week === week.week ? "dark" : ""}`} onClick={() => setPicked(w.week)}>
              Week {w.week} · {w.title.split("：")[1] ?? w.title}
            </button>
          ))}
        </div>
      </div>
      <div className="stack">
        <Calendar s={s} />
        <History r={r} />
        <Weak r={r} />
        <Compare r={r} />
        <Errors s={s} />
        <Report r={r} />
        <Backup s={s} />
      </div>
    </div>
  );
}

// Last 28 days: minutes of lesson time per day, and whether a daily review was done.
function Calendar({ s }: { s: AppState }) {
  const days = recentDays(s, 28);
  const max = Math.max(30, ...days.map((d) => d.minutes));
  const active = days.filter((d) => d.minutes >= 1 || d.reviews > 0).length;
  const streak = practiceStreak(s);
  return (
    <section className="card" data-testid="practice-calendar">
      <div className="row between" style={{ flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ margin: 0 }}>最近 4 周</h2>
        <span className="small muted">练了 {active} 天 · 当前连续 {streak} 天</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(28, 1fr)", gap: 3, alignItems: "end", height: 90, marginTop: 14 }} role="img" aria-label={`最近 28 天练了 ${active} 天`}>
        {days.map((d) => (
          <div
            key={d.date}
            title={`${d.date}：${d.minutes} 分钟${d.reviews ? `，复习 ${d.reviews} 项` : ""}`}
            style={{
              height: d.minutes ? `${Math.max(8, (d.minutes / max) * 100)}%` : d.reviews ? "8%" : "3%",
              background: d.minutes ? "var(--accent)" : d.reviews ? "var(--ok)" : "var(--line)",
              borderRadius: 3,
            }}
          />
        ))}
      </div>
      <div className="row between tiny muted" style={{ marginTop: 4 }}>
        <span>{days[0].date.slice(5)}</span>
        <span>柱子高度 = 当天课程分钟数；绿色 = 只做了每日复习</span>
        <span>今天</span>
      </div>
    </section>
  );
}

function History({ r }: { r: Report }) {
  return (
    <section className="card">
      <h2>训练历史</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="t">
          <thead><tr><th>Day</th><th>主题</th><th>状态</th><th>实际时长</th><th>轮次</th><th>辨音首次正确率</th><th>录音</th><th>对比自评</th><th>今日自评</th><th>错误</th></tr></thead>
          <tbody>
            {r.days.map((d) => (
              <tr key={d.day}>
                <td>{d.day}</td>
                <td>{d.title}</td>
                <td>{d.completed ? <span className="badge ok">完成</span> : d.minutes ? <span className="badge warn">进行中</span> : <span className="badge">未开始</span>}</td>
                <td>{d.minutes} 分钟</td>
                <td>{d.rounds || "—"}</td>
                <td>{d.quizAnswered ? `${Math.round((d.quizCorrect / d.quizAnswered) * 100)}%（${d.quizCorrect}/${d.quizAnswered}）` : "—"}</td>
                <td>{d.recordings}</td>
                <td>{d.compareAvg ? d.compareAvg.toFixed(1) : "—"}</td>
                <td>{d.selfAvg ? d.selfAvg.toFixed(1) : "—"}</td>
                <td>{d.errors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small muted">累计实际训练 {r.totalMinutes} 分钟。</p>
    </section>
  );
}

function Weak({ r }: { r: Report }) {
  const max = Math.max(1, ...r.weaknesses.map((w) => w.score));
  return (
    <section className="card">
      <h2>弱项</h2>
      {r.weaknesses.length ? (
        <div className="stack" style={{ gap: 8 }}>
          {r.weaknesses.slice(0, 10).map((w) => (
            <div key={w.skill}>
              <div className="row between small"><b>{w.label}</b><span className="muted">证据权重 {w.score}</span></div>
              <div className="bar"><i style={{ width: `${(w.score / max) * 100}%`, background: "var(--bad)" }} /></div>
              <div className="tiny muted">{w.evidence.slice(0, 3).join("；")}</div>
            </div>
          ))}
        </div>
      ) : <p className="muted small">还没有记录到弱项。</p>}
    </section>
  );
}

function Compare({ r }: { r: Report }) {
  return (
    <section className="card">
      <h2>Day {r.week.baselineDay} 与 Day {r.week.retestDay} 对比</h2>
      <div className="grid grid-2" style={{ alignItems: "start" }}>
        <div>
          <h3>基线听辨（同一套 {r.week.baselineQuiz.length} 题）</h3>
          <div className="row" style={{ gap: 28, margin: "6px 0 12px" }}>
            <div className="stat"><b>{pct(r.baseline.d1)}</b><span>Day {r.week.baselineDay}</span></div>
            <div className="stat"><b>{pct(r.baseline.d7)}</b><span>Day {r.week.retestDay}</span></div>
          </div>
          <table className="t">
            <thead><tr><th>项目</th><th>Day {r.week.baselineDay}</th><th>Day {r.week.retestDay}</th></tr></thead>
            <tbody>{r.baseline.bySkill.map((b) => <tr key={b.skill}><td className="small">{b.label}</td><td>{pct(b.d1)}</td><td>{pct(b.d7)}</td></tr>)}</tbody>
          </table>
        </div>
        <div>
          <h3>可比录音</h3>
          <Pairs pairs={r.recordingPairs} a={r.week.baselineDay} b={r.week.retestDay} />
        </div>
      </div>
      {r.month ? (
        <div data-testid="month-compare" style={{ marginTop: 18 }}>
          <h3>一个月对比：Day {r.month.firstDay} 与 Day {r.month.lastDay} 的同一段短文</h3>
          <p className="small muted">整个课程完成 {r.month.completedDays}/{r.month.totalDays} 天，累计 {r.month.totalMinutes} 分钟。先听 Day {r.month.firstDay}，再听 Day {r.month.lastDay}：只听元音、词尾、停顿和重音，不用管内容。</p>
          <Pairs pairs={r.month.pairs} a={r.month.firstDay} b={r.month.lastDay} />
        </div>
      ) : null}
    </section>
  );
}

function Pairs({ pairs, a, b }: { pairs: RecordingPair[]; a: number; b: number }) {
  return (
    <div className="stack" style={{ gap: 8 }}>
      {pairs.map((p) => (
        <div key={p.id} className="card flat" style={{ padding: 12 }}>
          <div className="small" style={{ marginBottom: 6 }}>{p.text}</div>
          <div className="row">
            <PlayButton text={p.text} label="示范" />
            {p.d1 ? <TakeChip id={p.d1} label={`Day ${a}${p.d1Rating ? ` · ${p.d1Rating}/5` : ""}`} /> : <span className="badge">Day {a} 无录音</span>}
            {p.d7 ? <TakeChip id={p.d7} label={`Day ${b}${p.d7Rating ? ` · ${p.d7Rating}/5` : ""}`} /> : <span className="badge">Day {b} 待录</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Errors({ s }: { s: AppState }) {
  const [showResolved, setShowResolved] = useState(false);
  const list = s.errors.filter((e) => showResolved || !e.resolved).slice().reverse();
  return (
    <section className="card">
      <div className="row between">
        <h2 style={{ margin: 0 }}>错误记录</h2>
        <label className="row small"><input type="checkbox" checked={showResolved} onChange={(e) => setShowResolved(e.target.checked)} />显示已改正</label>
      </div>
      {list.length ? (
        <div style={{ overflowX: "auto", marginTop: 10 }}>
          <table className="t">
            <thead><tr><th>Day</th><th>来源</th><th>项目</th><th>内容</th><th>说明</th><th></th></tr></thead>
            <tbody>{list.slice(0, 80).map((e) => (
              <tr key={e.id} style={{ opacity: e.resolved ? 0.5 : 1 }}>
                <td>{e.day}</td>
                <td><span className="badge">{({ quiz: "辨音", self: "自查", compare: "对比", elsa: "ELSA", coach: "教练" } as const)[e.source]}</span></td>
                <td className="small">{skillLabel(e.skill)}</td>
                <td>{e.text}</td>
                <td className="small muted">{e.detail}</td>
                <td><button className="btn ghost sm" onClick={() => resolveError(e.id, !e.resolved)}>{e.resolved ? "撤销" : "已改正"}</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : <p className="muted small" style={{ marginTop: 10 }}>没有错误记录。</p>}
    </section>
  );
}

function Report({ r }: { r: Report }) {
  function download() {
    const blob = new Blob([reportMarkdown(r)], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `week${r.week.week}-report-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
  }
  const improved = r.baseline.items.filter((i) => i.d1 === false && i.d7 === true);
  const still = r.baseline.items.filter((i) => i.d1 === false && i.d7 === false);
  const worse = r.baseline.items.filter((i) => i.d1 === true && i.d7 === false);
  return (
    <section className="card" id="report" style={{ borderColor: r.ready ? "var(--accent)" : undefined }}>
      <div className="row between">
        <div>
          <div className="eyebrow">{r.week.reportTitle}</div>
          <h2 style={{ margin: 0 }}>{REPORT_NAMES[r.week.week] ?? r.week.reportTitle}{r.ready ? "" : `（完成 Day ${r.week.retestDay} 后生成）`}</h2>
        </div>
        <div className="row no-print">
          <button className="btn sm" onClick={download}>下载 Markdown</button>
          <button className="btn sm" onClick={() => window.print()}>打印 / 存为 PDF</button>
        </div>
      </div>
      {!r.ready ? (
        <div className="notice" style={{ marginTop: 12 }}>
          正式报告需要 Day {r.week.retestDay} 复测数据。目前未完成：Day {r.missingDays.join("、")}。下面是基于已有数据的中期预览。
        </div>
      ) : null}

      <h3 style={{ marginTop: 18 }}>1. 七天训练结果</h3>
      <p className="small">完成 {r.days.filter((d) => d.completed).length}/{r.days.length} 天，累计 {r.totalMinutes} 分钟，录音 {r.days.reduce((a, d) => a + d.recordings, 0)} 段。每天的详细数据见上方「训练历史」。</p>

      <h3>2. Day {r.week.baselineDay} 和 Day {r.week.retestDay} 的可比录音</h3>
      <p className="small">{r.recordingPairs.filter((p) => p.d1 && p.d7).length}/{r.recordingPairs.length} 组材料两天都有录音，可在上方「Day {r.week.baselineDay} 与 Day {r.week.retestDay} 对比」中逐段回放。自评分数：{r.recordingPairs.filter((p) => p.d1Rating && p.d7Rating).map((p) => `${p.d1Rating}→${p.d7Rating}`).join("，") || "—"}。</p>

      {r.month ? (
        <p className="small">一个月对比：Day 1 短文 {r.month.pairs.filter((p) => p.d1 && p.d7).length}/{r.month.pairs.length} 句两天都有录音，可在上方逐句回放。</p>
      ) : null}

      <h3>3. 主要辨音错误和变化</h3>
      <p className="small">基线听辨正确率：Day {r.week.baselineDay} {pct(r.baseline.d1)} → Day {r.week.retestDay} {pct(r.baseline.d7)}。</p>
      <ul className="small">
        <li>改善：{improved.map((i) => i.word).join("、") || "无"}</li>
        <li>仍然听错：{still.map((i) => i.word).join("、") || "无"}</li>
        <li>新出现的错误：{worse.map((i) => i.word).join("、") || "无"}</li>
      </ul>

      <h3>4. 已练习的发音动作</h3>
      {r.practiced.length ? (
        <ul className="small">{r.practiced.map((p) => <li key={p.skill}><b>{p.label}</b>（Day {p.days.join("/")}，{p.reps} 遍）：{p.action}</li>)}</ul>
      ) : <p className="small muted">还没有记录。</p>}

      <h3>5. 尚未掌握的音素或语流问题</h3>
      {r.weaknesses.length ? (
        <ul className="small">{r.weaknesses.slice(0, 8).map((w) => <li key={w.skill}><b>{w.label}</b>：{w.evidence.slice(0, 3).join("；")}</li>)}</ul>
      ) : <p className="small muted">没有记录到明显弱项。</p>}

      <h3>6. {r.week.week < WEEKS.length ? `第${["一", "二", "三", "四"][r.week.week]}周要特别留意的三个项目` : "接下来的三个优先项目"}</h3>
      {r.priorities.length ? (
        <ol className="small">{r.priorities.map((w) => <li key={w.skill}><b>{w.label}</b>。依据：{w.evidence[0]}。练习方向：{w.action}</li>)}</ol>
      ) : <p className="small muted">数据不足，暂无建议。</p>}
      <p className="small muted">{r.week.week < WEEKS.length ? "这些项目会继续出现在每日复习里，下一周练新内容时也要留意。" : "这些项目会继续出现在每日复习里。下一步练什么，根据这份报告和你的感受一起决定。"}</p>

      <div className="notice info small" style={{ marginTop: 12 }}>
        <b>数据说明：</b>
        <ul style={{ margin: "4px 0 0" }}>{r.caveats.map((c) => <li key={c}>{c}</li>)}</ul>
      </div>
    </section>
  );
}

function Backup({ s }: { s: AppState }) {
  const input = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  async function exportAll() {
    setMsg("正在打包…");
    const recordings = await Promise.all((await allRecordings()).map(async (r) => ({ ...r, blob: await blobToDataUrl(r.blob) })));
    const refAudio = await Promise.all((await allRefAudio()).map(async (r) => ({ ...r, blob: await blobToDataUrl(r.blob) })));
    const images = await Promise.all((await allImages()).map(async (r) => ({ ...r, blob: await blobToDataUrl(r.blob) })));
    const { apiKey: _omit, ...settings } = s.settings;
    void _omit;
    const data = { app: "english-os", exportedAt: new Date().toISOString(), state: { ...s, settings }, recordings, refAudio, images };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: "application/json" }));
    a.download = `english-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setMsg(`已导出：${recordings.length} 段录音、${images.length} 张截图。API key 不会被导出。`);
  }
  async function importAll(f?: File) {
    if (!f) return;
    if (!confirm("导入会覆盖这台设备上的训练记录（录音会合并）。继续吗？")) return;
    const data = JSON.parse(await f.text());
    if (data.app !== "english-os") { setMsg("这不是 English OS 的备份文件。"); return; }
    for (const r of data.recordings ?? []) await saveRecording({ ...r, blob: await dataUrlToBlob(r.blob) });
    for (const r of data.refAudio ?? []) await saveRefAudio({ ...r, blob: await dataUrlToBlob(r.blob) });
    for (const r of data.images ?? []) await saveImage({ ...r, blob: await dataUrlToBlob(r.blob) });
    replaceState({ ...data.state, settings: { ...data.state.settings, apiKey: s.settings.apiKey } });
    setMsg("导入完成。");
  }
  const auto = useBackupStatus();
  async function restore() {
    if (!confirm("从自动备份恢复会用备份里的进度覆盖这台浏览器上的进度（录音会合并）。继续吗？")) return;
    try { setMsg(await restoreFromBackup()); } catch (e) { setMsg(`恢复失败：${(e as Error).message}`); }
  }
  return (
    <section className="card flat no-print">
      <h3>备份</h3>
      <div className={`notice ${auto.phase === "error" ? "" : "info"} small`} style={{ marginBottom: 12 }}>
        <b>自动备份：</b>
        {auto.phase === "ok" ? <>已开启。最近一次 {auto.savedAt ? new Date(auto.savedAt).toLocaleString() : "—"}，共 {auto.files ?? 0} 个录音和文件。位置：<span className="kbd">{auto.dir}</span></>
          : auto.phase === "saving" ? <>正在备份…</>
          : auto.phase === "error" ? <>备份失败：{auto.message}</>
          : auto.phase === "unavailable" ? <>{auto.message}</>
          : <>等待第一次备份…</>}
        <div className="tiny muted" style={{ marginTop: 4 }}>每次进度变化、每段新录音都会自动复制到这台 Mac 的文件夹里，每天另存一份快照（保留 60 天）。API key 不会被备份。</div>
        <div className="row" style={{ marginTop: 8 }}>
          <button className="btn sm" onClick={() => void backupNow()}>立即备份</button>
          <button className="btn sm" onClick={restore}>从自动备份恢复</button>
        </div>
      </div>
      <p className="small muted">进度保存在这个浏览器里（localStorage），录音和截图在 IndexedDB。换浏览器或清除网站数据后，可以用上面的「从自动备份恢复」找回。也可以手动导出一份文件：</p>
      <div className="row">
        <button className="btn" onClick={exportAll}>导出全部数据（含录音）</button>
        <input ref={input} type="file" accept="application/json" hidden onChange={(e) => importAll(e.target.files?.[0])} />
        <button className="btn" onClick={() => input.current?.click()}>从备份导入</button>
        {msg ? <span className="small muted">{msg}</span> : null}
      </div>
    </section>
  );
}
