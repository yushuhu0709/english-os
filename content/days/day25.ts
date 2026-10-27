import type { DayPlan, QuizItem } from "../types";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d25-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d25-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

export const day25: DayPlan = {
  day: 25,
  title: "长句的意群和停顿",
  titleEn: "Chunking Long Sentences",
  outcome: "在长主语、从句、插入语和列举处正确停顿；每个意群一个核心重音；列举时前面升调、最后降调。",
  minMinutes: 60,
  blocks: { understand: 15, perceive: 25, shadow: 35, review: 10 },
  intro: "句子一长，很多人就会二选一：要么一口气读完，听的人跟不上；要么每两三个词就停一下，像在念单词表。意群（sense group）就是按意思切分的「一口气」。今天练四种最常见的长句切法，以及停顿之间怎么换气才不打断节奏。",
  learn: [
    {
      id: "d25-where",
      title: "在哪里停",
      paragraphs: [
        "停顿通常出现在语法和意思的边界上：",
      ],
      bullets: [
        "长主语之后：The woman who lives next door | is a doctor.",
        "从句前后：When I got home, | I realised I'd left my keys at work.",
        "插入语两边：My brother, | who lives in Bristol, | is coming to visit.",
        "列举的每一项：We need eggs, ↗ | milk, ↗ | bread, ↗ | and some butter. ↘",
        "不要停在冠词、介词和它们后面的名词之间：in | the morning ✗",
      ],
      source: "Day 6 意群的延伸；马徐骏 04（停顿与断句）",
    },
    {
      id: "d25-inside",
      title: "意群内部：连起来，一个重点",
      paragraphs: [
        "一个意群里的词要连成一串，像一个长单词：the woman who lives next door → /ðə ˈwʊmən hu lɪvz neks ˈdɔː/。",
        "每个意群有一个核心重音，通常在最后一个实词上；意群结尾的语调告诉对方「还没完」（平或微升）或「说完了」（降）。",
        "停顿不一定要换气。短停顿只是音高和节奏上的一个小间隔，长停顿才吸气。",
      ],
    },
    {
      id: "d25-lists",
      title: "列举的语调",
      paragraphs: [
        "封闭的列举（就这些）：前面每项升调，最后一项降调：red, ↗ green, ↗ and blue. ↘",
        "开放的列举（还有别的）：每项都升调：red, ↗ green, ↗ blue… ↗",
      ],
    },
  ],
  listen: [
    { id: "d25-l1", text: "The woman who lives next door is a doctor.", note: "长主语后停顿。" },
    { id: "d25-l2", text: "When I got home, I realised I'd left my keys at work.", note: "从句后停顿。" },
    { id: "d25-l3", text: "My brother, who lives in Bristol, is coming to visit next week.", note: "插入语两边停顿。" },
    { id: "d25-l4", text: "We need eggs, milk, bread, and some butter.", note: "封闭列举：最后降调。" },
    { id: "d25-l5", text: "If you have any questions, please don't hesitate to get in touch.", note: "工作邮件常用句。" },
  ],
  identify: [
    know("k1", "chunking", "「My brother who lives in Bristol is coming to visit.」（只有一个哥哥）最自然的停顿是？", ["My brother, | who lives in Bristol, | is coming to visit.", "My brother who | lives in Bristol is | coming to visit."], 0, "非限定从句是插入语，两边停顿。"),
    know("k2", "chunking", "下面哪一处不应该停顿？", ["When I got home | I realised…", "in | the morning", "The man next door | is a doctor."], 1, "介词、冠词和后面的名词是一个整体。"),
    know("k3", "intonation", "「We need eggs, milk and bread.」（就这三样）语调是？", ["每项都升", "前两项升，最后一项降"], 1, "封闭列举：最后一项降调表示说完了。"),
    know("k4", "chunking", "一个意群里的核心重音通常在？", ["第一个词", "最后一个实词"], 1, "核心重音通常落在意群最后一个实词上。"),
    hearQ("h1", "chunking", "说话人在哪里停顿？", "When I got home, I realised I'd left my keys at work.", ["home 之后", "realised 之后"], 0, "从句 When I got home 之后停顿。"),
    hearQ("h2", "intonation", "这个列举说完了吗？", "We need eggs, milk, bread, and some butter.", ["说完了 ↘", "还有别的 ↗"], 0, "最后一项降调，表示列举结束。"),
  ],
  produce: [
    { id: "d25-p1", text: "The woman who lives next door is a doctor.", ipa: "ðə ˈwʊmən hu lɪvz neks ˈdɔː | ɪz ə ˈdɒktə ↘", cue: "主语连成一串，在 door 后停；next door 的 t 省音。", skill: "chunking" },
    { id: "d25-p2", text: "When I got home, I realised I'd left my keys at work.", ipa: "wen aɪ ɡɒt ˈhəʊm | aɪ ˈrɪəlaɪzd aɪd ˈleft maɪ ˈkiːz ət ˈwɜːk ↘", cue: "got home 的 t 可喉塞；realised /d/；keys /z/。", skill: "chunking" },
    { id: "d25-p3", text: "My brother, who lives in Bristol, is coming to visit.", ipa: "maɪ ˈbrʌðə | hu ˈlɪvz ɪn ˈbrɪstl | ɪz ˈkʌmɪŋ tə ˈvɪzɪt ↘", cue: "插入语音调稍低、稍快；Bristol 结尾暗 l。", skill: "chunking" },
    { id: "d25-p4", text: "We need eggs, milk, bread, and some butter.", ipa: "wi ˈniːd ˈeɡz ↗ | ˈmɪlk ↗ | ˈbred ↗ | ən səm ˈbʌtə ↘", cue: "前三项升，最后一项降；butter 英式 t 清楚。", skill: "intonation" },
    { id: "d25-p5", text: "If you have any questions, please don't hesitate to get in touch.", ipa: "ɪf ju hæv ˈeni ˈkwestʃənz | pliːz ˈdəʊnt ˈhezɪteɪt tə ˌɡet ɪn ˈtʌtʃ ↘", cue: "两个意群；get in 连读，t 可轻弹。", skill: "chunking" },
  ],
  shadow: [
    { id: "d25-s1", text: "The new library, which opened last month, has already become one of the most popular places in town.", marked: "The NEW LIBrary, | which OPened last MONTH, | has alREADy beCOME | one of the MOST POPular PLACes in TOWN. ↘", ipa: "ðə ˈnjuː ˈlaɪbrəri | wɪtʃ ˈəʊpənd lɑːst ˈmʌnθ | həz ɔːlˈredi bɪˈkʌm | ˈwʌn əv ðə ˈməʊst ˈpɒpjələ ˈpleɪsɪz ɪn ˈtaʊn ↘", focus: "四个意群；library 英式常读 /ˈlaɪbrəri/；places /ɪz/。", skill: "chunking" },
    { id: "d25-s2", text: "If you're travelling to the UK for the first time, it's a good idea to book your train tickets in advance.", marked: "If you're TRAVelling to the UK | for the FIRST TIME, | it's a GOOD iDEa | to BOOK your TRAIN tickets in adVANCE. ↘", ipa: "ɪf jɔː ˈtrævəlɪŋ tə ðə ˌjuːˈkeɪ | fə ðə ˈfɜːst ˈtaɪm | ɪts ə ˈɡʊd aɪˈdɪər | tə ˈbʊk jɔː ˈtreɪn tɪkɪts ɪn ədˈvɑːns ↘", focus: "从句 + 主句；idea to 连接 r；advance 英式 /ədˈvɑːns/。", skill: "chunking" },
    { id: "d25-s3", text: "What I like most about London is the parks, the museums, and the fact that you can walk almost everywhere.", marked: "What I LIKE MOST about LONdon | is the PARKS, ↗ | the muSEums, ↗ | and the FACT that you can WALK ALmost EVerywhere. ↘", ipa: "wɒt aɪ ˈlaɪk ˈməʊst əˈbaʊt ˈlʌndən | ɪz ðə ˈpɑːks ↗ | ðə mjuˈziːəmz ↗ | ən ðə ˈfækt ðət ju kən ˈwɔːk ˈɔːlməʊst ˈevriweə ↘", focus: "长主语 + 列举；parks /ɑː/ 不卷舌；can 弱读。", skill: "intonation" },
    { id: "d25-s4", text: "Although it was raining all day, we decided to go for a walk along the river, and it was actually lovely.", marked: "alTHOUGH it was RAINing all DAY, | we deCIDed to go for a WALK | along the RIVer, | and it was ACtually LOVEly. ↘", ipa: "ɔːlˈðəʊ ɪt wəz ˈreɪnɪŋ ɔːl ˈdeɪ | wi dɪˈsaɪdɪd tə ɡəʊ fər ə ˈwɔːk | əˈlɒŋ ðə ˈrɪvə | ən ɪt wəz ˈæktʃuəli ˈlʌvli ↘", focus: "四个意群；for a 连接 r；decided /ɪd/。", skill: "chunking" },
  ],
  reviewPrompts: ["你的长句录音里，停顿是在意群边界上，还是在换气的地方？", "插入语有没有读得稍低、稍快？", "找一句你工作或学习中常用的长句，标好意群再读一遍。"],
  skills: ["chunking", "intonation", "tonic"],
};
