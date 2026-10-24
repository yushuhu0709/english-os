import type { DayPlan } from "../types";
import { BASELINE_QUIZ, BASELINE_RECORD } from "../baseline";

export const day7: DayPlan = {
  day: 7,
  title: "综合训练与复测",
  titleEn: "Integration & Re-test",
  outcome: "用 Day 1 的同一套听辨题和录音材料复测，生成 Week 1 Pronunciation Report。",
  minMinutes: 45,
  blocks: { understand: 10, perceive: 35, shadow: 35, review: 10 },
  intro: "今天先快速回顾一周的要点和动作，然后在和 Day 1 相同的条件下复测。复测题目和 Day 1 完全一样，请第一次作答时认真听，第一次的答案才会进入报告。",
  learn: [
    {
      id: "d7-recap-sounds",
      title: "回顾：这一周练过的发音动作",
      paragraphs: [
        "元音：/iː/ 与 /ɪ/ 的松紧，/æ/ 与 /e/ 的开口度，/ʌ/ /ɑː/ /ɒ/ /ɔː/ 的前后与圆唇，/ʊ/ 与 /uː/，不卷舌的 /ɜː/；浊音前元音更长。",
        "双元音与弱读：滑动要完整；SSBE 的 /əʊ/ 起点偏央；非重读音节用 /ə/；功能词用弱读式。",
        "辅音：清浊（喉部振动），/θ ð/ 舌尖碰上齿，/v/ 与 /w/，/l n r/，送气与清晰的英式 t，完整的词尾辅音。",
        "重音与语流：查词典确认单词重音；每个意群一个核心重音；意群内连读；连接 r；降调与升调。",
      ],
      phonemes: [
        { ipa: "ɪ", word: "ship", wordIpa: "ʃɪp", cue: "Day 2" },
        { ipa: "əʊ", word: "home", wordIpa: "həʊm", cue: "Day 3" },
        { ipa: "θ", word: "think", wordIpa: "θɪŋk", cue: "Day 4" },
        { ipa: "ˈ", word: "photographer", wordIpa: "fəˈtɒɡrəfə", cue: "Day 5" },
        { ipa: "r‿", word: "far away", wordIpa: "ˈfɑːr əˈweɪ", cue: "Day 6" },
        { ipa: "ə", word: "a cup of tea", wordIpa: "ə ˈkʌp əv ˈtiː", cue: "Day 3" },
      ],
    },
    {
      id: "d7-retest",
      title: "怎样复测才可比",
      paragraphs: [
        "和 Day 1 一样：同一个房间、同一个麦克风或耳机、同样的距离。录音前不要先反复练这几句，按你现在自然的状态读。",
        "听辨题第一次作答进入报告。答完后可以重听、再选，用于学习，但不会改变成绩。",
        "Day 7 的复测题目与 Day 1 相同，所以成绩里会包含「做过一次」带来的熟悉度。报告会如实说明这一点。",
      ],
    },
    {
      id: "d7-report",
      title: "Week 1 Pronunciation Report 包含什么",
      paragraphs: [
        "完成今天之后，Progress 页面会生成报告：七天训练结果、Day 1 与 Day 7 的可比录音、主要辨音错误和变化、已练习的发音动作、尚未掌握的问题，以及第二周要特别留意的三个项目。",
        "报告只使用你在这台设备上真实留下的数据。看完报告就可以进入第二周（Day 8–14，语流）。你的弱项会继续出现在每日复习里。",
      ],
    },
  ],
  listen: [
    { id: "d7-l1", text: "sheep ship bad bed cart cut", note: "Day 2 元音对比快速回顾。" },
    { id: "d7-l2", text: "caught cot full fool bird work" },
    { id: "d7-l3", text: "late let go home near care", note: "Day 3 双元音。" },
    { id: "d7-l4", text: "think then very west rise asked", note: "Day 4 辅音。" },
    { id: "d7-l5", text: "The photographer took a photograph.", note: "Day 5 重音。" },
    { id: "d7-l6", text: "There are four of us here and there.", note: "Day 6 连接 r。" },
  ],
  identify: [
    ...BASELINE_QUIZ,
    {
      id: "d7-k1", kind: "hear", prompt: "这句话是肯定还是否定？", say: "I can't come tomorrow.", options: ["I can come", "I can't come"], answer: 1, skill: "weak-forms",
      explain: "can't /kɑːnt/ 长而重读；can 在肯定句中弱读为 /kən/。",
    },
    {
      id: "d7-k2", kind: "hear", prompt: "这里的 record 是名词还是动词？", say: "to record", options: ["名词 REcord", "动词 reCORD"], answer: 1, skill: "word-stress",
      explain: "动词重音在后：/rɪˈkɔːd/。",
    },
    {
      id: "d7-k3", kind: "know", prompt: "SSBE 中 car alarm 的 car 后面有没有 r？", options: ["有，连接 r", "没有"], answer: 0, skill: "linking-r",
      explain: "后接元音开头的 alarm，连接 r 出现：/ˈkɑːr əˌlɑːm/。",
    },
  ],
  produce: [
    { id: "d7-p1", text: "sheep ship, bad bed", ipa: "ʃiːp ʃɪp, bæd bed", cue: "松紧和开口度。", skill: "iː-ɪ" },
    { id: "d7-p2", text: "cut cart, cot caught", ipa: "kʌt kɑːt, kɒt kɔːt", cue: "不卷舌；/ɒ/ 短而圆，/ɔː/ 长而更圆。", skill: "ɒ-ɔː" },
    { id: "d7-p3", text: "go home, near here", ipa: "ɡəʊ həʊm, nɪə hɪə", cue: "/əʊ/ 从央元音开始；/ɪə/ 不卷舌。", skill: "əʊ-aʊ" },
    { id: "d7-p4", text: "think, then, very, west", ipa: "θɪŋk, ðen, ˈveri, west", cue: "舌尖碰上齿；v 上齿碰下唇，w 双唇收圆。", skill: "θ-s" },
    { id: "d7-p5", text: "asked, helped, months", ipa: "ɑːskt, helpt, mʌnθs", cue: "词尾辅音完整，不加元音。", skill: "final-consonants" },
    { id: "d7-p6", text: "a cup of tea for the teacher", ipa: "ə ˈkʌp əv ˈtiː fə ðə ˈtiːtʃə", cue: "功能词全部弱读。", skill: "weak-forms" },
    { id: "d7-p7", text: "photograph, photographer, photographic", ipa: "ˈfəʊtəɡrɑːf, fəˈtɒɡrəfə, ˌfəʊtəˈɡræfɪk", cue: "重音位置移动。", skill: "word-stress" },
    { id: "d7-p8", text: "far away, turn it off", ipa: "ˈfɑːr əˈweɪ, ˈtɜːn ɪt ˈɒf", cue: "连接 r 和辅音 + 元音连读。", skill: "linking" },
  ],
  shadow: [
    ...BASELINE_RECORD,
    {
      id: "d7-s1",
      text: "When I got home, I made some tea and called my mum.",
      marked: "When I got HOME, | I made some TEA | and called my MUM.",
      focus: "综合：意群、弱读、/əʊ/、核心重音。",
      skill: "chunking",
    },
    {
      id: "d7-s2",
      text: "Do you live in London? No, I live in Bristol.",
      marked: "Do you LIVE in LONdon? ↗ | NO, | I live in BRIStol. ↘",
      focus: "综合：升调与降调、/ʌ/ 与 /ɒ/。",
      skill: "intonation",
    },
  ],
  reviewPrompts: ["和 Day 1 的录音相比，你自己听到的最大变化是什么？", "哪一项这周花了时间但仍然没有进步？", "这一周的训练安排，哪里最有用、哪里最想改？"],
  skills: ["iː-ɪ", "æ-e", "ɒ-ɔː", "əʊ-aʊ", "θ-s", "final-consonants", "weak-forms", "word-stress", "linking", "intonation"],
};
