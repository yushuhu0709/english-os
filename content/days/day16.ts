import type { DayPlan, QuizItem } from "../types";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d16-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d16-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

export const day16: DayPlan = {
  day: 16,
  title: "提问的语调",
  titleEn: "Asking Questions",
  outcome: "wh- 问句用降调、一般疑问句用升调；会用升调的疑问词请对方重复；问句里的功能词弱读、连读。",
  minMinutes: 60,
  blocks: { understand: 15, perceive: 30, shadow: 30, review: 10 },
  intro: "问句是对话里最常用的句型，也是中国学生语调最容易出错的地方：很多人把所有问句都读成升调。今天把三种问句分清楚，再练问句开头那一串很快、很轻的功能词：What do you、Where did you、Have you got。",
  learn: [
    {
      id: "d16-wh",
      title: "wh- 问句：通常用降调",
      paragraphs: [
        "What、Where、When、Who、Why、How 开头的问句，在 SSBE 里通常用降调 ↘，核心重音落在最后一个实词上：Where do you WORK? ↘ / What time does it START? ↘ / How long have you LIVED here? ↘",
        "疑问词本身不用特别重读。很多人习惯把 WHERE 读得很重，再在句末升调，听起来像在质问或惊讶。",
        "想显得更友好、更随意时，wh- 问句也可以用升调，但先把默认的降调练稳。",
      ],
      bullets: ["Where do you work? ↘", "What time does it start? ↘", "How long have you lived here? ↘"],
    },
    {
      id: "d16-yn",
      title: "一般疑问句：通常用升调",
      paragraphs: [
        "用 Do / Does / Did / Is / Are / Have / Can / Could 开头、可以用 yes 或 no 回答的问句，通常用升调 ↗：Do you like it HERE? ↗ / Have you been to SCOTland? ↗",
        "升调从最后一个重读音节开始往上走，不是最后一个词突然拔高。",
        "选择疑问句（A or B）前升后降：Would you like TEA ↗ or COFfee? ↘",
      ],
      bullets: ["Do you like it here? ↗", "Have you been to Scotland? ↗", "Is it far from here? ↗"],
    },
    {
      id: "d16-repeat",
      title: "没听清：用升调的疑问词请对方重复",
      paragraphs: [
        "没听清时，英式英语最常说 Sorry? ↗ 或 Pardon? ↗，也可以只重复没听清的那个疑问词：You're meeting him WHERE? ↗ / Sorry, WHAT time? ↗",
        "这时疑问词重读、升调，意思是「请再说一遍那一部分」。用降调说 What? ↘ 会显得很不礼貌。",
      ],
      bullets: ["Sorry? ↗", "Sorry, what time? ↗", "You're going where? ↗"],
    },
    {
      id: "d16-weak",
      title: "问句开头的功能词：弱、快、连",
      paragraphs: [
        "问句开头常常是一串弱读的功能词，母语者说得很快：",
      ],
      bullets: [
        "What do you → /ˈwɒt də jə/，快速时近似 /ˈwɒdʒə/",
        "Where did you → /ˈweə dɪdʒu/（d + y 同化为 dʒ）",
        "Do you → /də jə/ 或 /dʒə/",
        "Have you got → /həv ju ˈɡɒt/",
        "Are you → /ə jə/，在元音前 /ər ju/",
        "How long have you → /haʊ ˈlɒŋ əv ju/",
      ],
      source: "Day 8 弱读、Day 10 同化的综合运用",
    },
  ],
  listen: [
    { id: "d16-l1", text: "Where do you work?", note: "wh- 问句降调。" },
    { id: "d16-l2", text: "Do you like it here?", note: "一般疑问句升调。" },
    { id: "d16-l3", text: "What time does it start?", note: "核心重音在 START。" },
    { id: "d16-l4", text: "Have you been to Scotland?", note: "Scotland 重音在第一个音节。" },
    { id: "d16-l5", text: "Would you like tea or coffee?", note: "选择疑问句：前升后降。" },
    { id: "d16-l6", text: "Sorry, what time?", note: "请对方重复：疑问词重读、升调。" },
    { id: "d16-l7", text: "How long have you lived here?", note: "have you 弱读。" },
  ],
  identify: [
    know("k1", "wh-questions", "「What time does it start?」默认用？", ["降调 ↘", "升调 ↗"], 0, "wh- 问句默认降调。"),
    know("k2", "wh-questions", "「Have you been to Scotland?」默认用？", ["降调 ↘", "升调 ↗"], 1, "一般疑问句默认升调。"),
    know("k3", "wh-questions", "「Where do you work?」的核心重音在？", ["where", "do", "work"], 2, "核心重音在最后一个实词 WORK，疑问词不用特别重。"),
    know("k4", "wh-questions", "没听清时间，想让对方重复，最礼貌的是？", ["What? ↘", "Sorry, what time? ↗"], 1, "降调的 What? 很生硬；Sorry + 升调的疑问词既礼貌又明确。"),
    know("k5", "weak-forms", "快速口语中 Where did you 常读成？", ["/weə dɪd juː/", "/ˈweə dɪdʒu/"], 1, "did you 的 d + y 同化为 /dʒ/。"),
    know("k6", "intonation", "「Would you like tea or coffee?」只有这两种可选时，语调是？", ["tea 升、coffee 降", "tea 降、coffee 升", "都升"], 0, "选择疑问句前升后降，表示只有这两个选项。"),
    hearQ("h1", "wh-questions", "这是哪种问句？", "Have you been to Scotland?", ["wh- 问句", "一般疑问句（可以用 yes/no 回答）"], 1, "Have 开头、可以用 yes 或 no 回答：一般疑问句，默认升调。"),
    hearQ("h2", "weak-forms", "这句话一共有几个词？", "What do you do?", ["3 个", "4 个", "5 个"], 1, "What do you do? 4 个词：中间的 do you 弱读，很容易漏听。"),
    hearQ("h3", "weak-forms", "这句话一共有几个词？", "Have you got a minute?", ["4 个", "5 个", "6 个"], 1, "Have you got a minute? 5 个词：have you 和 a 都弱读。"),
    hearQ("h4", "wh-questions", "说话人想知道的是？", "Sorry, what time?", ["时间", "地点"], 0, "重复的疑问词就是没听清的部分。"),
  ],
  produce: [
    { id: "d16-p1", text: "Where do you work? What do you do?", ipa: "ˈweə də jə ˈwɜːk ↘. ˈwɒt də jə ˈduː ↘", cue: "do you 弱读成 /də jə/；在 WORK 和最后的 DO 上落下来。", skill: "wh-questions" },
    { id: "d16-p2", text: "Do you like it here? Have you been to Scotland?", ipa: "də jə ˈlaɪk ɪt ˈhɪə ↗. həv jə ˈbiːn tə ˈskɒtlənd ↗", cue: "从最后一个重读音节开始往上走：HERE、SCOT-。like it 连读。", skill: "wh-questions" },
    { id: "d16-p3", text: "Where did you go? What did you buy?", ipa: "ˈweə dɪdʒu ˈɡəʊ ↘. ˈwɒt dɪdʒu ˈbaɪ ↘", cue: "did you 同化为 /dɪdʒu/。", skill: "assimilation-place" },
    { id: "d16-p4", text: "Sorry? Sorry, what time? You're going where?", ipa: "ˈsɒri ↗. ˈsɒri | ˈwɒt taɪm ↗. jɔː ˈɡəʊɪŋ ˈweə ↗", cue: "sorry 英式是短元音 /ɒ/；疑问词重读、升调。", skill: "wh-questions" },
    { id: "d16-p5", text: "How long have you lived here?", ipa: "haʊ ˈlɒŋ əv ju ˈlɪvd hɪə ↘", cue: "have you 弱读 /əv ju/；lived 的 -ed 读 /d/。", skill: "weak-forms" },
    { id: "d16-p6", text: "Would you like tea or coffee?", ipa: "wʊdʒu ˈlaɪk ˈtiː ↗ | ɔː ˈkɒfi ↘", cue: "tea 升、coffee 降；coffee 英式 /ˈkɒfi/。", skill: "intonation" },
  ],
  shadow: [
    { id: "d16-s1", text: "So, what do you do? I'm a designer. Oh, are you? Where do you work?", marked: "So, WHAT do you DO? ↘ | I'm a deSIGNer. ↘ | Oh, ARE you? ↗ | WHERE do you WORK? ↘", ipa: "səʊ ˈwɒt də jə ˈduː ↘ | aɪm ə dɪˈzaɪnə ↘ | əʊ ˈɑː ju ↗ | ˈweə də jə ˈwɜːk ↘", focus: "wh- 问句降调，回问升调；designer 结尾 /ə/ 不卷舌。", skill: "wh-questions" },
    { id: "d16-s2", text: "Have you been here before? No, it's my first time.", marked: "Have you been here beFORE? ↗ | NO, ↘ | it's my FIRST TIME. ↘", ipa: "həv ju ˈbiːn hɪə bɪˈfɔː ↗ | ˈnəʊ ↘ | ɪts maɪ ˈfɜːst ˈtaɪm ↘", focus: "一般疑问句升调；first time 的 t 不爆破。", skill: "wh-questions" },
    { id: "d16-s3", text: "What time does the train leave? Ten past six. Sorry, what time?", marked: "What time does the train LEAVE? ↘ | TEN past SIX. ↘ | Sorry, WHAT time? ↗", ipa: "wɒt ˈtaɪm dəz ðə treɪn ˈliːv ↘ | ˈten pɑːst ˈsɪks ↘ | ˈsɒri | ˈwɒt taɪm ↗", focus: "does 弱读 /dəz/；past 英式 /pɑːst/；最后一句升调请对方重复。", skill: "wh-questions" },
    { id: "d16-s4", text: "Would you like tea or coffee? Tea, please.", marked: "Would‿you like TEA ↗ | or COFfee? ↘ | TEA, please. ↘", ipa: "wʊdʒu laɪk ˈtiː ↗ | ɔː ˈkɒfi ↘ | ˈtiː pliːz ↘", focus: "选择疑问句前升后降。", skill: "intonation" },
    { id: "d16-s5", text: "How long have you lived in London? About three years.", marked: "How LONG have you LIVED in LONdon? ↘ | aBOUT three YEARS. ↘", ipa: "haʊ ˈlɒŋ əv ju ˈlɪvd ɪn ˈlʌndən ↘ | əˈbaʊt θriː ˈjɪəz ↘", focus: "London 的第一个元音是 /ʌ/；years 结尾 /ɪəz/ 不卷舌。", skill: "weak-forms" },
  ],
  reviewPrompts: ["你的 wh- 问句录音是降调吗？还是不自觉地升上去了？", "问句开头的 do you、did you 说得够轻够快吗？", "今天哪一种问句你在真实对话里最常用？"],
  skills: ["wh-questions", "weak-forms", "intonation"],
};
