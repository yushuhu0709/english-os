"use client";

import { useState } from "react";
import { playModel } from "@/lib/tts";

// ── Articulators (schematic mid-sagittal section) ────────────────
const ORGANS = [
  { id: "lips", n: 1, x: 52, y: 196, name: "嘴唇 lips", role: "圆唇（/uː/ /ɔː/ /w/ /ʃ/）或展唇（/iː/）；双唇音 /p b m/；唇齿音 /f v/ 用下唇。", demo: "pea bee me" },
  { id: "teeth", n: 2, x: 84, y: 178, name: "牙齿 teeth", role: "/θ ð/ 舌尖轻触上齿；/f v/ 上齿碰下唇。", demo: "think then" },
  { id: "alveolar", n: 3, x: 110, y: 160, name: "齿龈 alveolar ridge", role: "上门牙后的凸起。/t d n l s z/ 都在这里形成，是英语最繁忙的位置。", demo: "tea dog no low" },
  { id: "hard", n: 4, x: 165, y: 140, name: "硬腭 hard palate", role: "/j/（yes）和 /ʃ ʒ/ 时舌面靠近这里；/iː/ 时舌前部抬向硬腭。", demo: "yes she" },
  { id: "soft", n: 5, x: 232, y: 150, name: "软腭 soft palate (velum)", role: "抬起时堵住鼻腔通道（口腔音）；放下时气流走鼻腔（/m n ŋ/）。/k ɡ ŋ/ 舌后部抵住软腭。", demo: "king go sing" },
  { id: "tip", n: 6, x: 112, y: 202, name: "舌尖 tongue tip", role: "英语最需要精确控制的部位：齿间（th）、齿龈（t d n l s z）、齿龈后（r）。", demo: "think sink" },
  { id: "front", n: 7, x: 165, y: 188, name: "舌前部 front", role: "抬高形成前元音 /iː ɪ e æ/。", demo: "sheep ship bed bad" },
  { id: "back", n: 8, x: 225, y: 192, name: "舌后部 back", role: "抬高形成后元音 /uː ʊ ɔː/；下压后缩形成 /ɑː/。", demo: "food port cart" },
  { id: "pharynx", n: 9, x: 285, y: 240, name: "咽 pharynx", role: "/ɑː/ 等后元音时舌根后缩，咽腔变窄。", demo: "cart" },
  { id: "larynx", n: 10, x: 285, y: 300, name: "喉与声带 larynx / vocal folds", role: "声带振动 = 浊音；不振动 = 清音。手放喉结可以感觉到。", demo: "sue zoo" },
  { id: "nasal", n: 11, x: 175, y: 95, name: "鼻腔 nasal cavity", role: "/m n ŋ/ 的气流出口。捏住鼻子就发不出这三个音。", demo: "man sing" },
];

export function ArticulatorDiagram() {
  const [sel, setSel] = useState(ORGANS[2]);
  return (
    <div className="grid grid-2" style={{ alignItems: "start" }}>
      <svg viewBox="0 0 340 330" role="img" aria-label="发声器官示意图" style={{ width: "100%", maxWidth: 420 }}>
        {/* nasal cavity */}
        <path d="M70 120 Q120 70 230 85 Q262 92 262 128 L230 142 Q170 128 112 142 Z" fill="var(--surface-2)" stroke="var(--line-strong)" />
        {/* palate line */}
        <path d="M100 168 Q108 152 125 150 Q175 138 228 146 Q252 152 262 176" fill="none" stroke="var(--ink-2)" strokeWidth="3" strokeLinecap="round" />
        {/* uvula */}
        <path d="M262 176 Q268 190 258 192" fill="none" stroke="var(--ink-2)" strokeWidth="3" strokeLinecap="round" />
        {/* upper lip & teeth */}
        <path d="M70 150 Q46 168 50 186 L74 184" fill="var(--surface-2)" stroke="var(--ink-2)" strokeWidth="2" />
        <rect x="78" y="166" width="12" height="20" rx="3" fill="var(--surface)" stroke="var(--ink-2)" />
        {/* lower teeth & lip & jaw */}
        <rect x="80" y="206" width="12" height="18" rx="3" fill="var(--surface)" stroke="var(--ink-2)" />
        <path d="M74 206 L50 206 Q46 226 72 240 Q120 262 180 268" fill="none" stroke="var(--ink-2)" strokeWidth="2" />
        {/* tongue */}
        <path d="M98 205 Q110 192 140 186 Q200 172 240 186 Q268 200 272 240 Q274 270 268 300" fill="color-mix(in srgb, var(--bad) 18%, transparent)" stroke="var(--bad)" strokeWidth="2" />
        {/* pharynx back wall */}
        <path d="M292 150 Q302 220 296 320" fill="none" stroke="var(--ink-2)" strokeWidth="2" />
        {/* vocal folds */}
        <path d="M270 300 L292 296" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" />
        {ORGANS.map((o) => (
          <g key={o.id} onClick={() => setSel(o)} style={{ cursor: "pointer" }}>
            <circle cx={o.x} cy={o.y} r={sel.id === o.id ? 11 : 9} fill={sel.id === o.id ? "var(--accent)" : "var(--surface)"} stroke="var(--accent)" strokeWidth="1.5" />
            <text x={o.x} y={o.y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={sel.id === o.id ? "var(--accent-ink)" : "var(--accent)"}>
              {o.n}
            </text>
          </g>
        ))}
        <text x="10" y="322" fontSize="10" className="svg-text">示意图（面朝左），比例不精确</text>
      </svg>
      <div className="stack">
        <div className="row" style={{ gap: 4 }}>
          {ORGANS.map((o) => (
            <button key={o.id} className={`btn sm ${sel.id === o.id ? "dark" : ""}`} onClick={() => setSel(o)}>
              {o.n}. {o.name.split(" ")[0]}
            </button>
          ))}
        </div>
        <div className="card flat">
          <h3>{sel.name}</h3>
          <p>{sel.role}</p>
          <button className="btn sm" onClick={() => playModel(sel.demo)}>▶ 例词：{sel.demo}</button>
        </div>
      </div>
    </div>
  );
}

// ── Vowel chart (SSBE monophthongs, approximate positions) ───────
const VOWELS = [
  { ipa: "iː", x: 58, y: 30, word: "fleece" },
  { ipa: "ɪ", x: 98, y: 62, word: "kit" },
  { ipa: "e", x: 112, y: 118, word: "dress" },
  { ipa: "æ", x: 152, y: 200, word: "trap" },
  { ipa: "ʌ", x: 212, y: 178, word: "strut" },
  { ipa: "ɑː", x: 280, y: 205, word: "palm" },
  { ipa: "ɒ", x: 290, y: 172, word: "lot" },
  { ipa: "ɔː", x: 288, y: 88, word: "thought" },
  { ipa: "ʊ", x: 222, y: 64, word: "foot" },
  { ipa: "uː", x: 182, y: 32, word: "goose" },
  { ipa: "ɜː", x: 180, y: 112, word: "nurse" },
  { ipa: "ə", x: 196, y: 145, word: "about" },
];

const Trapezoid = () => (
  <>
    <path d="M40 20 L300 20 L300 220 L140 220 Z" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
    <path d="M73 86 L300 86 M107 153 L300 153 M170 20 L220 220" stroke="var(--line)" strokeDasharray="3 4" />
    <text x="40" y="12" fontSize="10" className="svg-text">前 front</text>
    <text x="262" y="12" fontSize="10" className="svg-text">后 back</text>
    <text x="306" y="26" fontSize="10" className="svg-text">高</text>
    <text x="306" y="222" fontSize="10" className="svg-text">低</text>
  </>
);

export function VowelChart({ onPick }: { onPick?: (ipa: string) => void }) {
  const [hi, setHi] = useState<string | null>(null);
  return (
    <div>
      <svg viewBox="0 0 330 240" role="img" aria-label="SSBE 单元音舌位图" style={{ width: "100%", maxWidth: 520 }}>
        <Trapezoid />
        {VOWELS.map((v) => (
          <g
            key={v.ipa}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setHi(v.ipa);
              playModel(v.word);
              onPick?.(v.ipa);
            }}
          >
            <circle cx={v.x} cy={v.y} r="15" fill={hi === v.ipa ? "var(--accent)" : "var(--surface)"} stroke="var(--accent)" />
            <text x={v.x} y={v.y + 6} textAnchor="middle" fontSize="16" fontFamily="var(--ipa)" fill={hi === v.ipa ? "var(--accent-ink)" : "var(--ink)"}>
              {v.ipa}
            </text>
          </g>
        ))}
      </svg>
      <p className="tiny muted">
        位置参考 Cruttenden（2014）与 Lindsey（2019）对现代 SSBE 的描述：/uː/ /ʊ/ 前移，/æ/ 接近 [a]。点击音标会播放该元音的标准关键词（fleece、kit…），因为合成语音不能可靠地单独发出一个元音。
      </p>
    </div>
  );
}

// ── Diphthong glides ─────────────────────────────────────────────
const GLIDES = [
  { ipa: "eɪ", from: [115, 112], to: [98, 66], word: "face" },
  { ipa: "aɪ", from: [165, 208], to: [102, 70], word: "price" },
  { ipa: "ɔɪ", from: [282, 96], to: [108, 66], word: "choice" },
  { ipa: "əʊ", from: [192, 140], to: [224, 70], word: "goat" },
  { ipa: "aʊ", from: [172, 206], to: [222, 72], word: "mouth" },
  { ipa: "ɪə", from: [98, 62], to: [184, 140], word: "near" },
  { ipa: "eə", from: [118, 132], to: [140, 138], word: "square" },
  { ipa: "ʊə", from: [222, 64], to: [192, 140], word: "cure" },
];

export function DiphthongChart() {
  const [hi, setHi] = useState("eɪ");
  return (
    <div>
      <svg viewBox="0 0 330 240" role="img" aria-label="SSBE 双元音滑动图" style={{ width: "100%", maxWidth: 520 }}>
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--accent)" />
          </marker>
        </defs>
        <Trapezoid />
        {GLIDES.map((g) => (
          <g key={g.ipa} style={{ cursor: "pointer" }} onClick={() => { setHi(g.ipa); playModel(g.word); }} opacity={hi === g.ipa ? 1 : 0.35}>
            <line x1={g.from[0]} y1={g.from[1]} x2={g.to[0]} y2={g.to[1]} stroke="var(--accent)" strokeWidth={hi === g.ipa ? 3 : 2} markerEnd="url(#arr)" />
            <text x={g.from[0]} y={g.from[1] + 16} textAnchor="middle" fontSize="14" fontFamily="var(--ipa)" fill="var(--ink)">{g.ipa}</text>
          </g>
        ))}
      </svg>
      <div className="row" style={{ gap: 4 }}>
        {GLIDES.map((g) => (
          <button key={g.ipa} className={`btn sm ${hi === g.ipa ? "dark" : ""}`} onClick={() => { setHi(g.ipa); playModel(g.word); }}>
            <span className="ipa">{g.ipa}</span>&nbsp;{g.word}
          </button>
        ))}
      </div>
      <p className="tiny muted">箭头从起点指向终点。现代 SSBE 的 /eə/ 多读成长单元音 [ɛː]（所以箭头很短），/ʊə/ 多数人读成 /ɔː/。</p>
    </div>
  );
}

// ── Consonant table ──────────────────────────────────────────────
const PLACES = ["双唇", "唇齿", "齿间", "齿龈", "齿龈后", "硬腭", "软腭", "声门"];
const MANNERS: { name: string; cells: (string[] | null)[] }[] = [
  { name: "塞音", cells: [["p", "pin"], null, null, ["t", "tin"], null, null, ["k", "kit"], null].map((c, i) => (c ? c : null)) as (string[] | null)[] },
  { name: "", cells: [["b", "bin"], null, null, ["d", "din"], null, null, ["ɡ", "get"], null] },
  { name: "擦音", cells: [null, ["f", "fan"], ["θ", "thin"], ["s", "sip"], ["ʃ", "ship"], null, null, ["h", "hat"]] },
  { name: "", cells: [null, ["v", "van"], ["ð", "then"], ["z", "zip"], ["ʒ", "measure"], null, null, null] },
  { name: "塞擦音", cells: [null, null, null, null, ["tʃ", "chip"], null, null, null] },
  { name: "", cells: [null, null, null, null, ["dʒ", "jam"], null, null, null] },
  { name: "鼻音", cells: [["m", "man"], null, null, ["n", "net"], null, null, ["ŋ", "sing"], null] },
  { name: "近音", cells: [["w", "wet"], null, null, ["l", "let"], ["r", "red"], ["j", "yes"], null, null] },
];

export function ConsonantTable() {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="t" style={{ minWidth: 640 }}>
        <thead>
          <tr>
            <th></th>
            {PLACES.map((p) => <th key={p}>{p}</th>)}
          </tr>
        </thead>
        <tbody>
          {MANNERS.map((m, ri) => (
            <tr key={ri} style={{ background: ri % 2 ? "var(--bg)" : undefined }}>
              <th>{m.name || <span className="tiny muted">{ri < 6 ? "浊" : ""}</span>}</th>
              {m.cells.map((c, ci) => (
                <td key={ci}>
                  {c ? (
                    <button className="btn ghost sm" onClick={() => playModel(c[1])} title={`例词 ${c[1]}`}>
                      <span className="ipa" style={{ fontSize: "1.1rem" }}>{c[0]}</span>
                      <span className="tiny muted">{c[1]}</span>
                    </button>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="tiny muted">成对出现时，上一行是清音，下一行是浊音。/w/ 同时有双唇收圆和软腭靠近两个动作。SSBE 的 /r/ 只在元音前出现。</p>
    </div>
  );
}

// ── Stress pattern dots ──────────────────────────────────────────
export function StressDots({ pattern }: { pattern: string }) {
  // pattern like "oOo" : O = primary, o = unstressed, ( . ) = secondary
  return (
    <span className="row" style={{ gap: 4, display: "inline-flex", alignItems: "center" }}>
      {pattern.split("").map((c, i) => (
        <span
          key={i}
          style={{
            width: c === "O" ? 18 : c === "." ? 12 : 9,
            height: c === "O" ? 18 : c === "." ? 12 : 9,
            borderRadius: "50%",
            background: c === "O" ? "var(--accent)" : c === "." ? "color-mix(in srgb, var(--accent) 45%, transparent)" : "var(--line-strong)",
            display: "inline-block",
          }}
        />
      ))}
    </span>
  );
}

const STRESS_WORDS = [
  { w: "photograph", p: "O.o", ipa: "ˈfəʊtəɡrɑːf" },
  { w: "photographer", p: "oOoo", ipa: "fəˈtɒɡrəfə" },
  { w: "photographic", p: ".oOo", ipa: "ˌfəʊtəˈɡræfɪk" },
  { w: "economy", p: "oOoo", ipa: "ɪˈkɒnəmi" },
  { w: "economic", p: ".oOo", ipa: "ˌiːkəˈnɒmɪk" },
  { w: "comfortable", p: "Ooo", ipa: "ˈkʌmftəbl" },
];

export function StressGrid() {
  return (
    <div className="grid grid-3">
      {STRESS_WORDS.map((s) => (
        <button key={s.w} className="card flat" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => playModel(s.w)}>
          <div className="row between">
            <b>{s.w}</b>
            <StressDots pattern={s.p} />
          </div>
          <div className="ipa muted">/{s.ipa}/</div>
        </button>
      ))}
    </div>
  );
}

export function Visual({ id }: { id: string }) {
  switch (id) {
    case "articulators":
      return <ArticulatorDiagram />;
    case "vowelChart":
      return <VowelChart />;
    case "diphthongs":
      return <DiphthongChart />;
    case "consonants":
      return <ConsonantTable />;
    case "stressGrid":
      return <StressGrid />;
    default:
      return null;
  }
}
