import type { DayPlan, QuizItem } from "../types";
import { day1 } from "./day1";
import { day2 } from "./day2";
import { day3 } from "./day3";
import { day4 } from "./day4";
import { day5 } from "./day5";
import { day6 } from "./day6";
import { day7 } from "./day7";

export const DAYS: DayPlan[] = [day1, day2, day3, day4, day5, day6, day7];

export const TOTAL_DAYS = 7;

export const DAY_TITLES: { day: number; title: string; titleEn: string; outcome: string }[] = [
  { day: 1, title: "发声器官与基线测试", titleEn: "Articulators & Baseline", outcome: "认识舌位、唇形、声带、IPA" },
  { day: 2, title: "英式单元音", titleEn: "SSBE Monophthongs", outcome: "掌握口型、舌位和元音差异" },
  { day: 3, title: "双元音与弱读", titleEn: "Diphthongs & Weak Forms", outcome: "理解双元音、/ə/ 和常见弱读" },
  { day: 4, title: "英式辅音", titleEn: "SSBE Consonants", outcome: "练习清浊、气流、辅音和词尾" },
  { day: 5, title: "单词与句子重音", titleEn: "Word & Sentence Stress", outcome: "理解音节、重音和节奏" },
  { day: 6, title: "自然语流", titleEn: "Connected Speech", outcome: "练习连读、意群、语调及跟读" },
  { day: 7, title: "综合训练与复测", titleEn: "Integration & Re-test", outcome: "和 Day 1 比较，生成弱项报告" },
];

export function getDay(n: number): DayPlan | undefined {
  return DAYS.find((d) => d.day === n);
}

export function allQuizItems(): QuizItem[] {
  const seen = new Set<string>();
  const out: QuizItem[] = [];
  for (const d of DAYS) for (const q of d.identify) if (!seen.has(q.id)) { seen.add(q.id); out.push(q); }
  return out;
}
