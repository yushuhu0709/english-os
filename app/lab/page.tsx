"use client";

import { useEffect, useMemo, useState } from "react";
import { SKILLS, SKILL_MAP } from "@/content/skills";
import { allQuizItems } from "@/content/days";
import { ArticulatorDiagram, ConsonantTable, DiphthongChart, VowelChart } from "@/components/Visuals";
import { ModelPair, PlayButton, RefAudioImport, VoiceStatus } from "@/components/Audio";
import { Recorder, playRecording } from "@/components/Recorder";
import { AsrCheck, ASR_DISCLAIMER } from "@/components/AsrCheck";
import { britishVoices, playModel, speakTTS } from "@/lib/tts";
import { update, useAppState } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

const TABS = [
  { id: "ipa", label: "SSBE 音标" },
  { id: "organs", label: "发音器官" },
  { id: "pairs", label: "辨音练习" },
  { id: "free", label: "自由跟读录音" },
  { id: "voice", label: "示范声音设置" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default function LabPage() {
  const h = useHydrated();
  const [tab, setTab] = useState<Tab>("ipa");
  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Pronunciation Lab</div>
        <h1>Pronunciation Lab</h1>
        <p>随时查音标、看发音器官、做辨音练习和自由录音。这里的练习不计入每日完成标准，但辨音时可以把错误加入复习。</p>
      </div>
      <VoiceStatus />
      <div className="steps">
        {TABS.map((t) => <button key={t.id} className={`step-pill ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>
      {!h ? <p className="muted">加载中…</p> : (
        <>
          {tab === "ipa" && (
            <div className="stack">
              <section className="card"><h3>单元音（12 个）</h3><VowelChart /></section>
              <section className="card"><h3>双元音（8 个）</h3><DiphthongChart /></section>
              <section className="card"><h3>辅音（24 个）</h3><ConsonantTable /></section>
            </div>
          )}
          {tab === "organs" && <section className="card"><h3>发音器官</h3><ArticulatorDiagram /></section>}
          {tab === "pairs" && <PairsPractice />}
          {tab === "free" && <FreePractice />}
          {tab === "voice" && <VoiceSettings />}
        </>
      )}
    </div>
  );
}

function PairsPractice() {
  const skills = useMemo(() => SKILLS.filter((s) => allQuizItems().some((q) => q.skill === s.id && q.kind === "hear")), []);
  const [skill, setSkill] = useState(skills[0]?.id ?? "");
  const pool = useMemo(() => allQuizItems().filter((q) => q.skill === skill && q.kind === "hear"), [skill]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ n: 0, c: 0 });
  const q = pool[i % Math.max(1, pool.length)];
  useEffect(() => { setI(Math.floor(Math.random() * 100)); setPicked(null); setScore({ n: 0, c: 0 }); }, [skill]);
  return (
    <div className="stack">
      <div className="row" style={{ gap: 4 }}>
        {skills.map((s) => <button key={s.id} className={`btn sm ${skill === s.id ? "dark" : ""}`} onClick={() => setSkill(s.id)}>{s.label}</button>)}
      </div>
      {q ? (
        <div className="card">
          <div className="row between">
            <b>{q.prompt}</b>
            <span className="badge accent">本组 {score.c}/{score.n}</span>
          </div>
          <div className="row" style={{ margin: "12px 0" }}><ModelPair text={q.say ?? ""} /></div>
          <div className="row">
            {q.options.map((o, k) => (
              <button key={k} className={`opt ${picked !== null ? (k === q.answer ? "right" : k === picked ? "wrong" : "") : ""}`} disabled={picked !== null}
                onClick={() => { setPicked(k); setScore((s) => ({ n: s.n + 1, c: s.c + (k === q.answer ? 1 : 0) })); }}>
                {o}
              </button>
            ))}
          </div>
          {picked !== null ? (
            <div className="stack" style={{ marginTop: 10 }}>
              <div className="small">{q.explain}</div>
              <div className="row">{q.options.map((o) => /^[a-z ]+$/i.test(o) ? <PlayButton key={o} text={o} label={o} /> : null)}</div>
              <button className="btn dark" onClick={() => { setI((x) => x + 1 + Math.floor(Math.random() * 3)); setPicked(null); }}>下一题 →</button>
            </div>
          ) : null}
          <p className="tiny muted" style={{ marginTop: 10 }}>{SKILL_MAP[skill]?.action}</p>
        </div>
      ) : <p className="muted">这个项目还没有辨音题。</p>}
    </div>
  );
}

function FreePractice() {
  const [text, setText] = useState("Would you like a cup of tea?");
  const [takes, setTakes] = useState<string[]>([]);
  return (
    <div className="stack">
      <div className="card">
        <h3>任意文本跟读</h3>
        <p className="small muted">输入任何单词或句子，听英式示范，录音并对比。录音保存在本机，但不计入每日训练。</p>
        <textarea className="input" value={text} onChange={(e) => { setText(e.target.value); setTakes([]); }} />
        <div className="row" style={{ marginTop: 10 }}>
          <ModelPair text={text} showSource />
          <RefAudioImport text={text} />
        </div>
        <div className="divider" />
        <Recorder day={0} round={1} itemId="lab-free" text={text} takes={takes} onSaved={(id) => setTakes((t) => [...t, id])} onDeleted={(id) => setTakes((t) => t.filter((x) => x !== id))} />
        {takes.length ? (
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn dark sm" onClick={async () => { await playModel(text); await new Promise((r) => setTimeout(r, 400)); await playRecording(takes[takes.length - 1]); }}>▶ 示范 → 我（最近一次）</button>
          </div>
        ) : null}
        <div className="row" style={{ marginTop: 10 }}><AsrCheck target={text} /></div>
        <p className="tiny muted">{ASR_DISCLAIMER}</p>
      </div>
    </div>
  );
}

function VoiceSettings() {
  const s = useAppState();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => { britishVoices().then(setVoices); }, []);
  const selected = (s.settings.voicePicked && voices.find((v) => v.voiceURI === s.settings.voiceURI)?.voiceURI) || voices[0]?.voiceURI;
  return (
    <div className="stack">
      <div className="card">
        <h3>英式示范声音</h3>
        {voices.length ? (
          <div className="stack">
            {voices.map((v) => (
              <label key={v.voiceURI} className="row">
                <input type="radio" checked={selected === v.voiceURI} onChange={() => update((st) => { st.settings.voiceURI = v.voiceURI; st.settings.voicePicked = true; })} />
                <span style={{ minWidth: 220 }}>{v.name}</span>
                <span className="badge">{v.lang}</span>
                <button className="btn sm" onClick={async () => { update((st) => { st.settings.voiceURI = v.voiceURI; st.settings.voicePicked = true; }); await speakTTS("The rain in Spain stays mainly in the plain. Would you like a cup of tea?"); }}>试听</button>
              </label>
            ))}
          </div>
        ) : <p className="muted">没有找到 en-GB 声音，见上方提示。</p>}
        <div className="field" style={{ marginTop: 14, maxWidth: 360 }}>
          <label>正常语速：{s.settings.rate.toFixed(2)}</label>
          <input type="range" min={0.6} max={1.1} step={0.05} value={s.settings.rate} onChange={(e) => update((st) => { st.settings.rate = Number(e.target.value); })} />
        </div>
      </div>
      <div className="card flat">
        <h3>关于示范音频</h3>
        <ul className="small">
          <li>示范由浏览器的英式语音合成生成，不是真人录音。macOS 上推荐在「系统设置 → 辅助功能 → 朗读内容 → 系统声音 → 管理声音」中下载 English (United Kingdom) 的 Serena / Daniel / Kate 的「增强」或「高级」版本，音质更自然。</li>
          <li>应用只使用 en-GB 声音；没有英式声音时宁可不播放，也不会用美式声音代替。</li>
          <li>合成语音对单个元音的独立发音不可靠，所以音标图点击后播放的是例词。</li>
          <li>任何示范项都可以「导入真人音频」，例如在 Cambridge Dictionary 选择 UK 发音后保存的音频文件，导入后优先播放。</li>
        </ul>
      </div>
    </div>
  );
}
