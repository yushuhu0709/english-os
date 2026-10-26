import type { DayPlan, QuizItem } from "../types";
import { day1 } from "./day1";
import { day2 } from "./day2";
import { day3 } from "./day3";
import { day4 } from "./day4";
import { day5 } from "./day5";
import { day6 } from "./day6";
import { day7 } from "./day7";
import { day8 } from "./day8";
import { day9 } from "./day9";
import { day10 } from "./day10";
import { day11 } from "./day11";
import { day12 } from "./day12";
import { day13 } from "./day13";
import { day14 } from "./day14";
import { BASELINE_QUIZ, BASELINE_RECORD } from "../baseline";
import { BASELINE2_QUIZ, BASELINE2_RECORD } from "../baseline2";
import type { ShadowItem } from "../types";

export const DAYS: DayPlan[] = [day1, day2, day3, day4, day5, day6, day7, day8, day9, day10, day11, day12, day13, day14];

export const TOTAL_DAYS = 14;

// Each week opens with a baseline and ends with a re-test of the same items.
export interface WeekPlan {
  week: number;
  title: string;
  titleEn: string;
  firstDay: number;
  lastDay: number;
  baselineDay: number;
  retestDay: number;
  baselineQuiz: QuizItem[];
  baselineRecord: ShadowItem[];
  reportTitle: string;
}

export const WEEKS: WeekPlan[] = [
  { week: 1, title: "第一周：单个的音", titleEn: "Sounds", firstDay: 1, lastDay: 7, baselineDay: 1, retestDay: 7, baselineQuiz: BASELINE_QUIZ, baselineRecord: BASELINE_RECORD, reportTitle: "Week 1 Pronunciation Report" },
  { week: 2, title: "第二周：语流", titleEn: "Connected Speech", firstDay: 8, lastDay: 14, baselineDay: 8, retestDay: 14, baselineQuiz: BASELINE2_QUIZ, baselineRecord: BASELINE2_RECORD, reportTitle: "Week 2 Connected Speech Report" },
];

export function weekOf(day: number): WeekPlan {
  return WEEKS.find((w) => day >= w.firstDay && day <= w.lastDay) ?? WEEKS[0];
}

export const DAY_TITLES: { day: number; title: string; titleEn: string; outcome: string }[] = [
  { day: 1, title: "发声器官与基线测试", titleEn: "Articulators & Baseline", outcome: "认识舌位、唇形、声带、IPA" },
  { day: 2, title: "英式单元音", titleEn: "SSBE Monophthongs", outcome: "掌握口型、舌位和元音差异" },
  { day: 3, title: "双元音与弱读", titleEn: "Diphthongs & Weak Forms", outcome: "理解双元音、/ə/ 和常见弱读" },
  { day: 4, title: "英式辅音", titleEn: "SSBE Consonants", outcome: "练习清浊、气流、辅音和词尾" },
  { day: 5, title: "单词与句子重音", titleEn: "Word & Sentence Stress", outcome: "理解音节、重音和节奏" },
  { day: 6, title: "自然语流", titleEn: "Connected Speech", outcome: "练习连读、意群、语调及跟读" },
  { day: 7, title: "综合训练与复测", titleEn: "Integration & Re-test", outcome: "和 Day 1 比较，生成弱项报告" },
  { day: 8, title: "第二周基线：弱读与强读", titleEn: "Week 2 Baseline · Weak & Strong Forms", outcome: "语流基线测试；弱读式、强读式、缩略式" },
  { day: 9, title: "连读与滑音", titleEn: "Linking & Glides", outcome: "辅音 + 元音、滑音 /j/ /w/、连接 r、辅音合并" },
  { day: 10, title: "省音、同化与英式喉塞", titleEn: "Elision, Assimilation & Glottal T", outcome: "听懂消失和变化的音；现代 SSBE 的喉塞 t" },
  { day: 11, title: "节奏、复合词与重音转移", titleEn: "Rhythm, Compounds & Stress Shift", outcome: "重音节拍、复合词、重音转移、-teen 与 -ty" },
  { day: 12, title: "语调：核心重音与附加问句", titleEn: "Intonation: Tonic, Contrast & Tags", outcome: "新信息与对比重音；降调、升调、降升调" },
  { day: 13, title: "长段落跟读", titleEn: "Extended Shadowing", outcome: "完整跟读一段短文，再用自己的话复述" },
  { day: 14, title: "第二周复测与报告", titleEn: "Week 2 Re-test & Report", outcome: "和 Day 8 比较，生成第二周报告" },
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
