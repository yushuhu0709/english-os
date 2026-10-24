// Content model for the Week 1 bootcamp.

export type BlockId = "understand" | "perceive" | "shadow" | "review";
export type StepId = "learn" | "listen" | "identify" | "produce" | "record" | "compare" | "repeat";

export type SkillKind = "vowel" | "diphthong" | "consonant" | "stress" | "connected";

export interface Skill {
  id: string;
  label: string; // short, e.g. "/iː/ vs /ɪ/"
  kind: SkillKind;
  day: number; // lesson day that teaches it
  explain: string; // why it matters / what the contrast is (Chinese)
  action: string; // how to move tongue / lips / airflow (Chinese)
  chineseTrap: string; // typical issue for Mandarin speakers
  words: string[]; // drill words (SSBE-safe)
  sentence?: string; // a practice sentence
  keywords: string[]; // for mapping free-text errors / ELSA notes
}

export type VisualId = "articulators" | "vowelChart" | "diphthongs" | "consonants" | "stressGrid" | "flow";

export interface LearnSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  // phoneme cards: shown with play buttons for example words
  phonemes?: { ipa: string; word: string; wordIpa: string; cue: string }[];
  visual?: VisualId;
  source?: string; // which material this point draws on
}

export interface ListenItem {
  id: string;
  text: string;
  ipa?: string;
  note?: string;
}

export interface QuizItem {
  id: string;
  kind: "hear" | "know"; // hear = play audio then choose; know = knowledge/visual question
  prompt: string;
  say?: string; // what to play (hear items)
  options: string[];
  answer: number;
  skill: string;
  explain: string;
}

export interface DrillItem {
  id: string;
  text: string;
  ipa: string;
  cue: string;
  skill: string;
}

export interface ShadowItem {
  id: string;
  text: string;
  // marked: "|" = pause between sense groups, UPPER = stressed syllable/word, "‿" = linking
  marked?: string;
  ipa?: string;
  focus: string; // what to listen for (Chinese)
  skill: string;
  baseline?: boolean; // part of the Day 1 / Day 7 comparable set
}

export interface DayPlan {
  day: number;
  title: string;
  titleEn: string;
  outcome: string;
  minMinutes: number; // minimum active training time for completion
  blocks: Record<BlockId, number>; // target minutes
  intro: string;
  learn: LearnSection[];
  listen: ListenItem[];
  identify: QuizItem[];
  produce: DrillItem[];
  shadow: ShadowItem[];
  reviewPrompts: string[]; // reflection prompts for the review block
  skills: string[]; // skill ids this day trains
}

export const STEP_ORDER: StepId[] = ["learn", "listen", "identify", "produce", "record", "compare", "repeat"];

export const STEP_LABEL: Record<StepId, { en: string; zh: string }> = {
  learn: { en: "Learn", zh: "理解" },
  listen: { en: "Listen", zh: "听示范" },
  identify: { en: "Identify", zh: "辨音" },
  produce: { en: "Produce", zh: "发音练习" },
  record: { en: "Record", zh: "跟读录音" },
  compare: { en: "Compare", zh: "对比" },
  repeat: { en: "Repeat", zh: "复习与复盘" },
};

export const BLOCK_OF_STEP: Record<StepId, BlockId> = {
  learn: "understand",
  listen: "perceive",
  identify: "perceive",
  produce: "perceive",
  record: "shadow",
  compare: "shadow",
  repeat: "review",
};

export const BLOCK_LABEL: Record<BlockId, { en: string; zh: string }> = {
  understand: { en: "Understand", zh: "理解原理" },
  perceive: { en: "Perceive & Produce", zh: "听辨与发音" },
  shadow: { en: "Shadow & Record", zh: "跟读与录音" },
  review: { en: "Review", zh: "复习与记录" },
};
