import { matchSkills, SKILL_MAP } from "@/content/skills";
import type { Skill } from "@/content/types";
import { SKILLS } from "@/content/skills";

// Rule-based coaching. Every output says what kind of evidence it rests on.

export const VERIFY = {
  rules: "规则推断：根据你输入的文字和语音学规则得出，没有听你的录音，无法确认你的实际舌位或发音。",
  text: "依据文字描述：只能根据你的描述归类，需要你回听录音或请老师确认。",
  ai: "AI 生成：模型只读取了文字信息，没有听到你的声音。涉及舌位、口型的判断都未经声学验证。",
};

export interface ErrorAnalysis {
  skills: Skill[];
  verify: string;
}

export function analyzeError(word: string, description: string): ErrorAnalysis {
  const ids = matchSkills(`${word} ${description}`);
  return { skills: ids.map((i) => SKILL_MAP[i]).filter(Boolean), verify: VERIFY.text };
}

// Minimal-pair partners for drills generated from an error.
export function drillFor(skill: Skill): { pairs: string[][]; sentence?: string } {
  const w = skill.words.filter((x) => !x.includes(" "));
  const pairs: string[][] = [];
  for (let i = 0; i + 1 < w.length; i += 2) pairs.push([w[i], w[i + 1]]);
  return { pairs, sentence: skill.sentence };
}

// ── sentence analysis ────────────────────────────────────────────
export const WEAK_FORMS: Record<string, string> = {
  a: "ə", an: "ən", the: "ðə", and: "ən(d)", but: "bət", or: "ə", of: "əv", to: "tə", for: "fə", from: "frəm", at: "ət", as: "əz",
  than: "ðən", that: "ðət", can: "kən", could: "kəd", would: "wəd", should: "ʃəd", must: "məst", shall: "ʃəl", will: "(ə)l",
  have: "(h)əv", has: "(h)əz", had: "(h)əd", do: "də", does: "dəz", was: "wəz", were: "wə", are: "ə", am: "əm", be: "bi",
  been: "bɪn", some: "səm", them: "ðəm", him: "ɪm", her: "(h)ə", his: "ɪz", us: "əs", your: "jə", you: "ju", there: "ðə", just: "dʒəst",
};
const FUNCTION_EXTRA = new Set(["i", "he", "she", "it", "we", "they", "me", "my", "is", "in", "on", "by", "with", "if", "so", "not", "this", "these", "those", "who", "which", "when", "where", "what", "how", "why", "our", "its", "into", "about", "up"]);
const NEGATIVES = new Set(["not", "no", "never", "can't", "don't", "didn't", "isn't", "won't", "wasn't", "aren't", "couldn't", "shouldn't", "wouldn't", "hasn't", "haven't"]);
const BREAK_BEFORE = new Set(["and", "but", "because", "so", "which", "who", "that", "when", "if", "although", "while", "or"]);
const VOWEL_START = /^[aeiou]/i;
const H_SILENT = new Set(["hour", "honest", "honour", "heir"]);

export interface Token {
  word: string;
  clean: string;
  role: "content" | "function" | "negative";
  weak?: string;
  linkNext?: "consonant-vowel" | "linking-r";
  pauseAfter?: boolean;
  nucleus?: boolean;
}

export function analyzeSentence(sentence: string): Token[] {
  const raw = sentence.trim().split(/\s+/).filter(Boolean);
  const toks: Token[] = raw.map((w) => {
    const clean = w.toLowerCase().replace(/[^a-z']/g, "");
    const role: Token["role"] = NEGATIVES.has(clean) ? "negative" : WEAK_FORMS[clean] !== undefined || FUNCTION_EXTRA.has(clean) ? "function" : "content";
    return { word: w, clean, role, weak: role === "function" ? WEAK_FORMS[clean] : undefined };
  });
  // sense groups: punctuation, or before a conjunction once the group is long enough
  let run = 0;
  toks.forEach((t, i) => {
    run++;
    if (/[,;:.!?—]$/.test(t.word) && i < toks.length - 1) { t.pauseAfter = true; run = 0; return; }
    const next = toks[i + 1];
    if (next && BREAK_BEFORE.has(next.clean) && run >= 4) { t.pauseAfter = true; run = 0; }
  });
  // nucleus: last content/negative word in each group
  let groupStart = 0;
  toks.forEach((t, i) => {
    if (t.pauseAfter || i === toks.length - 1) {
      for (let j = i; j >= groupStart; j--) if (toks[j].role !== "function") { toks[j].nucleus = true; break; }
      groupStart = i + 1;
    }
  });
  // linking inside a group (approximation from spelling)
  toks.forEach((t, i) => {
    const n = toks[i + 1];
    if (!n || t.pauseAfter || /[,;:.!?]$/.test(t.word)) return;
    const nextVowel = VOWEL_START.test(n.clean) || H_SILENT.has(n.clean);
    if (!nextVowel) return;
    if (/(r|re)$/.test(t.clean)) t.linkNext = "linking-r";
    else if (/[bcdfgjklmnpqstvxz]$/.test(t.clean) && !/(gh|w|y)$/.test(t.clean)) t.linkNext = "consonant-vowel";
  });
  return toks;
}

export function skillsByKind() {
  return SKILLS;
}

// Prompt for the optional AI coach. The model is told what it can and cannot know.
export const AI_SYSTEM = `你是 English OS 的英式发音教练，学习者是中文母语者，目标口音是现代标准南部英式英语（SSBE，非传统 RP、非 Cockney，不用美式作为标准）。
规则：
1. 用简洁的中文回答，英文例子给出英式 IPA（Cambridge/Oxford UK 风格），注意 SSBE 不卷舌、hot 为 /ɒ/、go 为 /əʊ/、bath 类词为 /ɑː/、t 不弹舌。
2. 你只能看到文字，听不到学习者的声音。任何关于学习者实际舌位、口型、音质的推测，必须在句首标注【未验证】。可以确定的语音学事实不需要标注。
3. 不给出任何发音分数或百分比评分。
4. 给出可执行的练习：具体单词、最小对立对、句子，以及动作提示（舌位、唇形、气流、声带）。
5. 如涉及 ELSA 的反馈，提醒可能存在美式模型与 SSBE 的差异。
6. 训练共四周：第一周练单个的音（Day 1–7）；第二周练语流（Day 8–14：弱读、连读、省音同化与喉塞、节奏与重音转移、语调、长段落跟读）；第三周练日常对话（Day 15–21：寒暄与回应、问句语调、礼貌请求、字母数字日期、-ed 和 -s 词尾、情景对话）；第四周从跟读到自己说（Day 22–28：辅音丛与长单词重音、讲故事、表达观点、长句意群、自我介绍、自由表达）。回答围绕这四周的内容，不另外设计新课程。`;
