"use client";

import { DayStrip } from "@/components/DayStrip";
import { useAppState } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { STEP_LABEL, STEP_ORDER } from "@/content/types";
import { WEEKS } from "@/content/days";

export default function BootcampPage() {
  const s = useAppState();
  const h = useHydrated();
  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Modern Standard Southern British English</div>
        <h1>Bootcamp</h1>
        <p>两周，每天 60–90 分钟，固定四段：理解、听辨与发音、跟读录音、复习。第一周练单个的音，第二周练语流。每周第一天做基线测试，最后一天用同一套材料复测，用来比较这一周的变化。</p>
        <div className="row small" style={{ marginTop: 10 }}>
          {STEP_ORDER.map((k, i) => (
            <span key={k} className="badge">{i + 1}. {STEP_LABEL[k].en} · {STEP_LABEL[k].zh}</span>
          ))}
        </div>
      </div>
      {h ? WEEKS.map((w) => (
        <section key={w.week} style={{ marginBottom: 28 }}>
          <h2 style={{ marginBottom: 4 }}>Week {w.week} · {w.titleEn}</h2>
          <p className="small muted" style={{ marginTop: 0 }}>{w.title}。Day {w.baselineDay} 基线，Day {w.retestDay} 复测并生成 {w.reportTitle}。</p>
          <DayStrip s={s} detailed week={w} />
        </section>
      )) : <p className="muted">加载中…</p>}
      <section className="card flat" style={{ marginTop: 24 }}>
        <h3>教学依据</h3>
        <p className="small">训练流程综合了李笑来《1000小时》（查清每个音 → 慢听标记 → 分段跟读 → 完整跟读 → 录音对比 → 短时间内足量重复 → 每日复盘）与马徐骏《怎样快速提升英语口语能力》笔记（字母不等于音素、先听辨再模仿、元音不只比长短、清浊与 th 的两种读音、重音先查证、保留前后录音）。</p>
        <p className="small">第二周的语流内容（弱读、连读、省音同化、喉塞、节奏、语调）参照 Cruttenden《Gimson's Pronunciation of English》与 Lindsey《English After RP》对现代 SSBE 的描述。</p>
        <p className="small">《1000小时》的语音部分以美式英语为目标，本训练营只借用其方法，所有音值、音标和示范按现代 SSBE 校正：不卷舌、hot 用 /ɒ/、go 用 /əʊ/、bath 类词用 /ɑː/、t 不弹舌。完整对比见项目中的 <span className="kbd">docs/METHOD.md</span>。</p>
      </section>
    </div>
  );
}
