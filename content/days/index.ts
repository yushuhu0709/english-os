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
import { day15 } from "./day15";
import { day16 } from "./day16";
import { day17 } from "./day17";
import { day18 } from "./day18";
import { day19 } from "./day19";
import { day20 } from "./day20";
import { day21 } from "./day21";
import { day22 } from "./day22";
import { day23 } from "./day23";
import { day24 } from "./day24";
import { day25 } from "./day25";
import { day26 } from "./day26";
import { day27 } from "./day27";
import { day28 } from "./day28";
import { BASELINE_QUIZ, BASELINE_RECORD } from "../baseline";
import { BASELINE2_QUIZ, BASELINE2_RECORD } from "../baseline2";
import { BASELINE3_QUIZ, BASELINE3_RECORD } from "../baseline3";
import { BASELINE4_QUIZ, BASELINE4_RECORD } from "../baseline4";
import type { ShadowItem } from "../types";

export const DAYS: DayPlan[] = [day1, day2, day3, day4, day5, day6, day7, day8, day9, day10, day11, day12, day13, day14,
  day15, day16, day17, day18, day19, day20, day21, day22, day23, day24, day25, day26, day27, day28];

export const TOTAL_DAYS = 28;

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
  { week: 3, title: "第三周：日常对话", titleEn: "Everyday Conversation", firstDay: 15, lastDay: 21, baselineDay: 15, retestDay: 21, baselineQuiz: BASELINE3_QUIZ, baselineRecord: BASELINE3_RECORD, reportTitle: "Week 3 Everyday Conversation Report" },
  { week: 4, title: "第四周：从跟读到自己说", titleEn: "Speaking for Yourself", firstDay: 22, lastDay: 28, baselineDay: 22, retestDay: 28, baselineQuiz: BASELINE4_QUIZ, baselineRecord: BASELINE4_RECORD, reportTitle: "Week 4 Speaking Report" },
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
  { day: 15, title: "第三周基线：问候、寒暄与回应", titleEn: "Week 3 Baseline · Greetings & Responses", outcome: "对话基线测试；寒暄、回问和 Really 的语调" },
  { day: 16, title: "提问的语调", titleEn: "Asking Questions", outcome: "wh- 问句降调、一般疑问句升调、请对方重复" },
  { day: 17, title: "礼貌与委婉", titleEn: "Polite Requests & Softening", outcome: "Could you / Would you mind / I'm afraid" },
  { day: 18, title: "字母、数字、日期和时间", titleEn: "Letters, Numbers, Dates & Times", outcome: "拼写、电话号码、英式日期、时间和价格" },
  { day: 19, title: "-ed 和 -s 词尾", titleEn: "-ed & -s Endings", outcome: "/t/ /d/ /ɪd/ 与 /s/ /z/ /ɪz/，词尾不丢" },
  { day: 20, title: "情景对话跟读", titleEn: "Dialogues · Café, Directions, Restaurant", outcome: "咖啡店、问路、餐厅三段对话" },
  { day: 21, title: "第三周复测与报告", titleEn: "Week 3 Re-test & Report", outcome: "和 Day 15 比较，生成第三周报告" },
  { day: 22, title: "第四周基线：辅音丛与长单词重音", titleEn: "Week 4 Baseline · Clusters & Long-Word Stress", outcome: "基线测试；辅音丛不加元音；按后缀找重音" },
  { day: 23, title: "讲故事", titleEn: "Telling a Story", outcome: "过去时、连接词和节奏" },
  { day: 24, title: "表达观点", titleEn: "Giving Opinions", outcome: "强调、对比和降升调的「但是」" },
  { day: 25, title: "长句的意群和停顿", titleEn: "Chunking Long Sentences", outcome: "长主语、从句、插入语和列举" },
  { day: 26, title: "1 分钟自我介绍", titleEn: "One-Minute Self-Introduction", outcome: "先跟读示范，再改成自己的版本" },
  { day: 27, title: "自由表达", titleEn: "Free Speaking from Prompts", outcome: "看提示说 1 分钟" },
  { day: 28, title: "月度复测与一个月报告", titleEn: "Month Re-test & Report", outcome: "和 Day 22、Day 1 比较，生成一个月报告" },
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
