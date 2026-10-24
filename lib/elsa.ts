import { matchSkills } from "@/content/skills";

// ELSA Speak is an external tool whose scoring is built primarily around American
// English. Before an ELSA flag counts as an SSBE error, check whether it is really
// an accent difference. These rules are heuristics and are shown to the learner as such.

export interface AccentRule {
  id: string;
  test: (word: string, issue: string) => boolean;
  why: string;
}

const has = (s: string, ...keys: string[]) => keys.some((k) => s.includes(k));

// Common BATH-set words: SSBE /ɑː/, General American /æ/.
const BATH = ["bath", "ask", "after", "answer", "can't", "dance", "fast", "glass", "grass", "half", "last", "laugh", "master", "pass", "past", "path", "plant", "class", "chance", "example", "castle", "rather", "staff", "branch", "demand", "afternoon", "aunt", "banana", "father", "calm"];
// Common LOT-set words: SSBE /ɒ/, General American /ɑː/.
const LOT = ["hot", "not", "got", "stop", "job", "shop", "top", "box", "clock", "doctor", "problem", "possible", "body", "copy", "coffee", "lot", "wanted", "watch", "what", "want", "dog", "god", "rock", "lock", "knowledge", "holiday", "honest", "office", "online", "bottle", "common", "college", "economic", "project", "product", "positive", "process"];
const R_WORDS = /(ar|er|ir|or|ur|ear|eer|air|our|ore|are)(s|ed|d|t|k|n|m|l|ly)?$/;

export const ACCENT_RULES: AccentRule[] = [
  {
    id: "rhotic",
    test: (w, i) => has(i, "r sound", "/r/", "ɚ", "ɝ", "rhotic", "卷舌", "ər", "r音") || (has(i, " r", "r ") && R_WORDS.test(w)),
    why: "SSBE 不卷舌：元音后的 r 不发音（car /kɑː/、bird /bɜːd/）。美式模型会要求卷舌。",
  },
  {
    id: "bath",
    test: (w, i) => BATH.includes(w) && has(i, "æ", "ae", "ɑ", "a:", "/a/"),
    why: "BATH 类词在 SSBE 读 /ɑː/，美式读 /æ/。",
  },
  {
    id: "lot",
    test: (w, i) => LOT.includes(w) && has(i, "ɑ", "ɒ", "a:", "ah", "vowel"),
    why: "LOT 类词在 SSBE 读圆唇短 /ɒ/，美式读 /ɑː/。",
  },
  {
    id: "goat",
    test: (_w, i) => /oʊ|əʊ|\/o\/|\bou\b|\bow\b/.test(i),
    why: "GOAT 元音：SSBE /əʊ/（起点偏央），美式 /oʊ/。",
  },
  {
    id: "flap",
    test: (_w, i) => has(i, "flap", "tap", "ɾ", "t̬", "弹舌", "d sound", "/d/ instead of /t/"),
    why: "SSBE 的元音间 t 是清晰的 [t]（或喉塞），不是美式弹舌 [ɾ]。",
  },
  {
    id: "yod",
    test: (w, i) => ["new", "tune", "student", "duty", "news", "tuesday", "during", "suit", "assume"].includes(w) && has(i, "j", "u", "yod"),
    why: "SSBE 在 new、tune、student 等词中保留 /j/（/njuː/、/tʃuːn/），美式常省略。",
  },
];

export function checkAccentDifference(word: string, issue: string): AccentRule[] {
  const w = word.trim().toLowerCase();
  const i = ` ${issue.toLowerCase()} `;
  return ACCENT_RULES.filter((r) => r.test(w, i));
}

export function suggestSkillsForElsa(word: string, issue: string): string[] {
  return matchSkills(`${word} ${issue}`);
}

export const ELSA_GUIDANCE = [
  "先在 ELSA 的设置里确认口音选项。如果 ELSA 只提供美式评估，它的分数不能直接当作 SSBE 准确度。",
  "把 ELSA 标红的具体音（而不只是总分）记录下来，English OS 会归类到对应课程并安排复习。",
  "涉及 r 是否卷舌、hot/lot 的元音、go 的元音、bath 类词、t 是否弹舌的扣分，很可能是口音差异，而不是错误。",
  "ELSA 截图只保存在本机浏览器里，用来日后回看，English OS 不会读取截图里的文字。",
];
