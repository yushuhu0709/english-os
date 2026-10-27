import type { DayPlan } from "../types";
import { BASELINE4_QUIZ, BASELINE4_RECORD } from "../baseline4";
import { BASELINE_RECORD } from "../baseline";

// The Day 1 passage, recorded again so the month report can play Day 1 next to Day 28.
export const MONTH_RECORD = BASELINE_RECORD.filter((s) => s.id.startsWith("base-p"));

export const day28: DayPlan = {
  day: 28,
  title: "月度复测与一个月报告",
  titleEn: "Month Re-test & Report",
  outcome: "用 Day 22 的材料复测第四周，再读一遍 Day 1 的短文，生成一个月报告：第一天和最后一天的录音放在一起对比。",
  minMinutes: 45,
  blocks: { understand: 10, perceive: 25, shadow: 40, review: 10 },
  intro: "这是一个月训练的最后一天。今天做两件事：第一，用和 Day 22 相同的条件复测第四周；第二，再读一遍 Day 1 的那段短文（Last week I asked my brother Peter…）。读之前不要先听 Day 1 的录音，按你现在自然的状态读。完成后，Progress 页面会把 Day 1 和 Day 28 的录音并排放好。",
  learn: [
    {
      id: "d28-recap",
      title: "回顾：一个月练了什么",
      paragraphs: [
        "第一周 · 单个的音：舌位和唇形、英式单元音和双元音、辅音和词尾、单词与句子重音。",
        "第二周 · 语流：弱读与强读、连读和滑音、省音、同化与喉塞、节奏、语调。",
        "第三周 · 日常对话：寒暄与回应、问句语调、礼貌请求、字母和数字、-ed 和 -s、情景对话。",
        "第四周 · 自己说：辅音丛和长单词、讲故事、表达观点、长句意群、自我介绍、自由表达。",
      ],
    },
    {
      id: "d28-retest",
      title: "怎样复测才可比",
      paragraphs: [
        "和 Day 1、Day 22 一样：同一个房间、同一个麦克风或耳机、同样的距离。",
        "第四周的 16 道辨音题第一次作答进入报告；Day 1 的四句短文只录音，用于一个月对比。",
        "录音对比只能靠你自己的耳朵。网站不会给你的发音打分；报告里列出的是你真实留下的数据。",
      ],
    },
    {
      id: "d28-next",
      title: "一个月之后",
      paragraphs: [
        "报告会列出这个月仍然最常出错的几个技能。接下来最有效的做法通常是：每天 15–30 分钟的「每日复习」保持习惯，再选一个真实材料（播客、剧集、工作录音）做长期跟读。",
        "Day 26 的自我介绍录音值得一个月后再录一次。",
      ],
    },
  ],
  listen: [
    { id: "d28-l1", text: "She asked for the texts from the last six months.", note: "Day 22 辅音丛。" },
    { id: "d28-l2", text: "But actually, after a couple of weeks, I really started to enjoy it.", note: "Day 23 讲故事。" },
    { id: "d28-l3", text: "It's a good idea, but I'm not sure it would work.", note: "Day 24 降升调。" },
    { id: "d28-l4", text: "My brother, who lives in Bristol, is coming to visit.", note: "Day 25 插入语。" },
    { id: "d28-l5", text: "Anyway, that's a bit about me. It's really nice to meet you.", note: "Day 26 自我介绍。" },
  ],
  identify: [
    ...BASELINE4_QUIZ,
    {
      id: "d28-k1", kind: "know", prompt: "说到一半想不起一个词，最自然的处理是？", options: ["长时间沉默", "It's a kind of… 换一种说法"], answer: 1, skill: "fluency",
      explain: "换一种说法，让对话继续。",
    },
  ],
  produce: [
    { id: "d28-p1", text: "texts, months, sixth, asked", ipa: "teksts, mʌnθs, sɪksθ, ɑːskt", cue: "辅音丛不加元音。", skill: "clusters" },
    { id: "d28-p2", text: "photography, economic, information, possibility", ipa: "fəˈtɒɡrəfi, ˌiːkəˈnɒmɪk, ˌɪnfəˈmeɪʃn, ˌpɒsəˈbɪləti", cue: "后缀前一个音节重读。", skill: "long-word-stress" },
    { id: "d28-p3", text: "To be honest, it depends.", ipa: "tə bi ˈɒnɪst ↘↗ | ɪt dɪˈpendz ↘", cue: "降升调 + 降调。", skill: "fall-rise" },
  ],
  shadow: [
    ...BASELINE4_RECORD,
    ...MONTH_RECORD,
    { id: "d28-s1", text: "Tell me a bit about yourself.", focus: "最后一次：不看文本说你的 1 分钟自我介绍。和 Day 26 的录音比一比。", skill: "fluency" },
  ],
  reviewPrompts: ["把 Day 1 和 Day 28 的录音放在一起听，你听到的最大变化是什么？", "这个月哪个部分对你最有用？哪个最难坚持？", "下个月你想怎么练：继续每日复习、换真实材料，还是专门打磨某几个音？"],
  skills: ["clusters", "long-word-stress", "discourse-markers", "fall-rise", "chunking", "fluency"],
};
