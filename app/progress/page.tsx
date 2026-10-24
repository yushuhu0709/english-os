"use client";

import { useMemo, useRef, useState } from "react";
import { skillLabel } from "@/content/skills";
import { TakeChip } from "@/components/Recorder";
import { PlayButton } from "@/components/Audio";
import { allImages, allRecordings, allRefAudio, blobToDataUrl, dataUrlToBlob, saveImage, saveRecording, saveRefAudio } from "@/lib/audioDb";
import { resolveError } from "@/lib/progress";
import { buildReport, reportMarkdown, type Report } from "@/lib/report";
import { replaceState, useAppState, type AppState } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

const pct = (x: { n: number; c: number }) => (x.n ? `${Math.round((x.c / x.n) * 100)}%` : "—");

export default function ProgressPage() {
  const s = useAppState();
  const h = useHydrated();
  const r = useMemo(() => buildReport(s), [s]);
  if (!h) return <div className="page-head"><h1>Progress</h1><p className="muted">加载中…</p></div>;
  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Progress</div>
        <h1>训练记录</h1>
        <p>所有数据都来自你在这台设备上的真实训练：计时器时长、辨音题第一次作答、录音、自评、错误和复习。</p>
      </div>
      <div className="stack">
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
      <h2>Day 1 与 Day 7 对比</h2>
      <div className="grid grid-2" style={{ alignItems: "start" }}>
        <div>
          <h3>基线听辨（同一套 26 题）</h3>
          <div className="row" style={{ gap: 28, margin: "6px 0 12px" }}>
            <div className="stat"><b>{pct(r.baseline.d1)}</b><span>Day 1</span></div>
            <div className="stat"><b>{pct(r.baseline.d7)}</b><span>Day 7</span></div>
          </div>
          <table className="t">
            <thead><tr><th>项目</th><th>Day 1</th><th>Day 7</th></tr></thead>
            <tbody>{r.baseline.bySkill.map((b) => <tr key={b.skill}><td className="small">{b.label}</td><td>{pct(b.d1)}</td><td>{pct(b.d7)}</td></tr>)}</tbody>
          </table>
        </div>
        <div>
          <h3>可比录音</h3>
          <div className="stack" style={{ gap: 8 }}>
            {r.recordingPairs.map((p) => (
              <div key={p.id} className="card flat" style={{ padding: 12 }}>
                <div className="small" style={{ marginBottom: 6 }}>{p.text}</div>
                <div className="row">
                  <PlayButton text={p.text} label="示范" />
                  {p.d1 ? <TakeChip id={p.d1} label={`Day 1${p.d1Rating ? ` · ${p.d1Rating}/5` : ""}`} /> : <span className="badge">Day 1 无录音</span>}
                  {p.d7 ? <TakeChip id={p.d7} label={`Day 7${p.d7Rating ? ` · ${p.d7Rating}/5` : ""}`} /> : <span className="badge">Day 7 待录</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
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
    a.download = `week1-pronunciation-report-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
  }
  const improved = r.baseline.items.filter((i) => i.d1 === false && i.d7 === true);
  const still = r.baseline.items.filter((i) => i.d1 === false && i.d7 === false);
  const worse = r.baseline.items.filter((i) => i.d1 === true && i.d7 === false);
  return (
    <section className="card" id="report" style={{ borderColor: r.ready ? "var(--accent)" : undefined }}>
      <div className="row between">
        <div>
          <div className="eyebrow">Week 1 Pronunciation Report</div>
          <h2 style={{ margin: 0 }}>{r.ready ? "第一周发音报告" : "第一周发音报告（完成 Day 7 后生成）"}</h2>
        </div>
        <div className="row no-print">
          <button className="btn sm" onClick={download}>下载 Markdown</button>
          <button className="btn sm" onClick={() => window.print()}>打印 / 存为 PDF</button>
        </div>
      </div>
      {!r.ready ? (
        <div className="notice" style={{ marginTop: 12 }}>
          正式报告需要 Day 7 复测数据。目前未完成：Day {r.missingDays.join("、")}。下面是基于已有数据的中期预览。
        </div>
      ) : null}

      <h3 style={{ marginTop: 18 }}>1. 七天训练结果</h3>
      <p className="small">完成 {r.days.filter((d) => d.completed).length}/7 天，累计 {r.totalMinutes} 分钟，录音 {r.days.reduce((a, d) => a + d.recordings, 0)} 段。每天的详细数据见上方「训练历史」。</p>

      <h3>2. Day 1 和 Day 7 的可比录音</h3>
      <p className="small">{r.recordingPairs.filter((p) => p.d1 && p.d7).length}/{r.recordingPairs.length} 组材料两天都有录音，可在上方「Day 1 与 Day 7 对比」中逐段回放。自评分数：{r.recordingPairs.filter((p) => p.d1Rating && p.d7Rating).map((p) => `${p.d1Rating}→${p.d7Rating}`).join("，") || "—"}。</p>

      <h3>3. 主要辨音错误和变化</h3>
      <p className="small">基线听辨正确率：Day 1 {pct(r.baseline.d1)} → Day 7 {pct(r.baseline.d7)}。</p>
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

      <h3>6. 第二周建议的三个最高优先级项目</h3>
      {r.priorities.length ? (
        <ol className="small">{r.priorities.map((w) => <li key={w.skill}><b>{w.label}</b>。依据：{w.evidence[0]}。练习方向：{w.action}</li>)}</ol>
      ) : <p className="small muted">数据不足，暂无建议。</p>}
      <p className="small muted">这只是建议，第二周课程不会自动开发。用完这一周后，把你的真实感受告诉我，再一起设计。</p>

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
  return (
    <section className="card flat no-print">
      <h3>备份</h3>
      <p className="small muted">所有数据只保存在这个浏览器里（进度在 localStorage，录音和截图在 IndexedDB）。清除浏览器数据会丢失记录，建议每天训练后导出一次备份。</p>
      <div className="row">
        <button className="btn" onClick={exportAll}>导出全部数据（含录音）</button>
        <input ref={input} type="file" accept="application/json" hidden onChange={(e) => importAll(e.target.files?.[0])} />
        <button className="btn" onClick={() => input.current?.click()}>从备份导入</button>
        {msg ? <span className="small muted">{msg}</span> : null}
      </div>
    </section>
  );
}
