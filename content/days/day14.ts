import type { DayPlan } from "../types";
import { BASELINE2_QUIZ, BASELINE2_RECORD } from "../baseline2";
import { OXFORD_PASSAGE } from "./day13";

export const day14: DayPlan = {
  day: 14,
  title: "第二周复测与报告",
  titleEn: "Week 2 Re-test & Report",
  outcome: "用 Day 8 的同一套材料复测，生成 Week 2 Connected Speech Report，和第一周的结果放在一起看。",
  minMinutes: 45,
  blocks: { understand: 10, perceive: 30, shadow: 35, review: 10 },
  intro: "今天先花几分钟回顾第二周的六个主题，然后在和 Day 8 相同的条件下复测。复测题目和 Day 8 完全一样，第一次作答进入报告。",
  learn: [
    {
      id: "d14-recap",
      title: "回顾：第二周练过的语流现象",
      paragraphs: [
        "弱读与强读（Day 8）：功能词在句中弱读成 /ə/；句末、对比、简短回答用强读式；can /kən/ 与 can't /kɑːnt/；缩略式 I'll、I'd、won't。",
        "连读（Day 9）：辅音 + 元音挪过去；元音 + 元音加滑音 [j] [w] 或连接 r；相同辅音合并，爆破音不释放。",
        "省音、同化、喉塞（Day 10）：next week、tell him、camera；ten boys → [tem]；辅音前的 t 可读 [ʔ]，元音之间的 t 保持清楚。",
        "节奏（Day 11）：重音拍子稳定；复合词前重；重音转移；-teen 与 -ty。",
        "语调（Day 12）：核心重音落在新信息和对比项上；降调、升调、降升调；附加问句。",
        "长段落跟读（Day 13）：标记 → 分段 → 完整 → 录音对比 → 重复。",
      ],
      phonemes: [
        { ipa: "kən / kɑːnt", word: "I can. I can't.", wordIpa: "aɪ kən ˈkʌm / aɪ ˈkɑːnt", cue: "Day 8" },
        { ipa: "ʷ", word: "go out", wordIpa: "ɡəʊ ˈaʊt", cue: "Day 9" },
        { ipa: "ʔ", word: "not now", wordIpa: "nɒt ˈnaʊ", cue: "Day 10" },
        { ipa: "ˈ", word: "afternoon tea", wordIpa: "ˌɑːftənuːn ˈtiː", cue: "Day 11" },
        { ipa: "↘ / ↗", word: "isn't it", wordIpa: "ˈɪznt ɪt", cue: "Day 12" },
      ],
    },
    {
      id: "d14-retest",
      title: "怎样复测才可比",
      paragraphs: [
        "和 Day 8 一样：同一个房间、同一个麦克风或耳机、同样的距离。录音前不要先反复练这几句。",
        "辨音题第一次作答进入报告。答完可以重听、再选，用于学习，但不改变成绩。",
        "复测题目和 Day 8 相同，成绩里会包含「做过一次」的熟悉度，报告会注明这一点。",
      ],
    },
    {
      id: "d14-report",
      title: "第二周报告包含什么",
      paragraphs: [
        "完成今天后，Progress 页面会生成 Week 2 Connected Speech Report：七天训练结果、Day 8 与 Day 14 的可比录音和听辨对比、已练习的语流动作、尚未掌握的问题，以及接下来的三个优先项目。",
        "报告只使用你在这台设备上真实留下的数据。之后练什么，我们根据报告和你的感受一起决定。",
      ],
    },
  ],
  listen: [
    { id: "d14-l1", text: "I was going to ask for some of them.", note: "Day 8 弱读。" },
    { id: "d14-l2", text: "I agree. Let's go out and do it again.", note: "Day 9 滑音。" },
    { id: "d14-l3", text: "It's not that bad, but it's quite late.", note: "Day 10 辅音前的 t。" },
    { id: "d14-l4", text: "We had afternoon tea at a Japanese restaurant.", note: "Day 11 重音转移。" },
    { id: "d14-l5", text: "You've met Anna, haven't you?", note: "Day 12 附加问句升调。" },
    { id: "d14-l6", text: OXFORD_PASSAGE[1].text, note: "Day 13 段落。" },
  ],
  identify: [
    ...BASELINE2_QUIZ,
    {
      id: "d14-k1", kind: "know", prompt: "「I didn't say she TOOK it.」表达的是？", options: ["她借了，不是拿了", "是别人拿的", "我根本没说"], answer: 0, skill: "tonic",
      explain: "重音在 TOOK：对比的是动作。",
    },
    {
      id: "d14-k2", kind: "hear", prompt: "你听到的数字是？", say: "nineteen", options: ["19", "90"], answer: 0, skill: "teen-ty",
      explain: "nineteen：-teen 重读、长、有 n。",
    },
  ],
  produce: [
    { id: "d14-p1", text: "I can come, but I can't stay long.", ipa: "aɪ kən ˈkʌm | bət aɪ ˈkɑːnt steɪ ˈlɒŋ", cue: "can 弱、can't 强。", skill: "strong-forms" },
    { id: "d14-p2", text: "I agree. Let's go out and do it.", ipa: "aɪ əˈɡriː. lets ɡəʊ ˈaʊt ən ˈduː ɪt", cue: "滑音，不停顿。", skill: "glides" },
    { id: "d14-p3", text: "football, not now; water, better", ipa: "ˈfʊtbɔːl, nɒt ˈnaʊ; ˈwɔːtə, ˈbetə", cue: "辅音前可用喉塞；元音之间 t 清楚。", skill: "glottal-t" },
    { id: "d14-p4", text: "thirteen, thirty; afternoon, afternoon tea", ipa: "ˌθɜːˈtiːn, ˈθɜːti; ˌɑːftəˈnuːn, ˌɑːftənuːn ˈtiː", cue: "-teen 与 -ty；重音转移。", skill: "teen-ty" },
    { id: "d14-p5", text: "It's a lovely day, isn't it. You've met Anna, haven't you?", ipa: "ɪts ə ˈlʌvli ˈdeɪ | ˈɪznt ɪt ↘. juv ˈmet ˈænə | ˈhævnt ju ↗", cue: "降调寒暄，升调确认。", skill: "question-tags" },
  ],
  shadow: [
    ...BASELINE2_RECORD,
    { id: "d14-s1", text: OXFORD_PASSAGE[6].text, marked: OXFORD_PASSAGE[6].marked, ipa: OXFORD_PASSAGE[6].ipa, focus: "综合：意群、弱读、喉塞、核心重音。", skill: "chunking" },
    { id: "d14-s2", text: "I said blue, not black.", marked: "I said BLUE, ↘ | not BLACK. ↘", focus: "综合：对比重音。", skill: "tonic" },
  ],
  reviewPrompts: ["和 Day 8 的录音相比，你自己听到的最大变化是什么？", "第二周哪个主题最有用？哪个最难？", "接下来你更想练什么：真实材料跟读、日常对话、工作场景，还是继续打磨某几个音？"],
  skills: ["weak-forms", "strong-forms", "contractions", "glides", "glottal-t", "teen-ty", "compound-stress", "tonic", "question-tags", "fluency"],
};
