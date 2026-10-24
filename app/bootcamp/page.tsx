"use client";

import { DayStrip } from "@/components/DayStrip";
import { useAppState } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { STEP_LABEL, STEP_ORDER } from "@/content/types";

export default function BootcampPage() {
  const s = useAppState();
  const h = useHydrated();
  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Week 1 · Modern Standard Southern British English</div>
        <h1>7-Day Bootcamp</h1>
        <p>每天 60–90 分钟，固定四段：20 分钟理解、40 分钟听辨与发音、20 分钟跟读录音、10 分钟复习。Day 1 与 Day 7 使用同一套听辨题和录音材料，用来比较这一周的变化。</p>
        <div className="row small" style={{ marginTop: 10 }}>
          {STEP_ORDER.map((k, i) => (
            <span key={k} className="badge">{i + 1}. {STEP_LABEL[k].en} · {STEP_LABEL[k].zh}</span>
          ))}
        </div>
      </div>
      {h ? <DayStrip s={s} detailed /> : <p className="muted">加载中…</p>}
      <section className="card flat" style={{ marginTop: 24 }}>
        <h3>教学依据</h3>
        <p className="small">训练流程综合了李笑来《1000小时》（查清每个音 → 慢听标记 → 分段跟读 → 完整跟读 → 录音对比 → 短时间内足量重复 → 每日复盘）与马徐骏《怎样快速提升英语口语能力》笔记（字母不等于音素、先听辨再模仿、元音不只比长短、清浊与 th 的两种读音、重音先查证、保留前后录音）。</p>
        <p className="small">《1000小时》的语音部分以美式英语为目标，本训练营只借用其方法，所有音值、音标和示范按现代 SSBE 校正：不卷舌、hot 用 /ɒ/、go 用 /əʊ/、bath 类词用 /ɑː/、t 不弹舌。完整对比见项目中的 <span className="kbd">docs/METHOD.md</span>。</p>
      </section>
    </div>
  );
}
