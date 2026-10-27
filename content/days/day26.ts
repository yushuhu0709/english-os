import type { DayPlan, QuizItem, ShadowItem } from "../types";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d26-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d26-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

// A model self-introduction (~1 minute), shadowed sentence by sentence.
const INTRO: { text: string; marked: string; ipa: string; focus: string; skill: string }[] = [
  { text: "Hi, I'm Lin. I'm from China, and I've been working in marketing for about five years.", marked: "HI, | I'm LIN. ↘ | I'm from CHIna, ↗ | and I've been WORKing in MARketing | for about FIVE YEARS. ↘", ipa: "ˈhaɪ | aɪm ˈlɪn ↘ | aɪm frəm ˈtʃaɪnə ↗ | ən aɪv bɪn ˈwɜːkɪŋ ɪn ˈmɑːkɪtɪŋ | fər əˈbaʊt ˈfaɪv ˈjɪəz ↘", focus: "名字单独一个意群；been 弱读 /bɪn/；for about 连接 r。", skill: "chunking" },
  { text: "At the moment, I'm working on a project with a team in London, so I use English every day.", marked: "At the MOment, | I'm WORKing on a PROject | with a TEAM in LONdon, | so I use ENGlish EVery DAY. ↘", ipa: "ət ðə ˈməʊmənt | aɪm ˈwɜːkɪŋ ɒn ə ˈprɒdʒekt | wɪð ə ˈtiːm ɪn ˈlʌndən | səʊ aɪ ˈjuːz ˈɪŋɡlɪʃ ˈevri ˈdeɪ ↘", focus: "project 英式 /ˈprɒdʒekt/；use 作动词读 /juːz/。", skill: "chunking" },
  { text: "Outside work, I really enjoy travelling and trying new food.", marked: "OUTside WORK, | I REALly enJOY TRAVelling | and TRYing new FOOD. ↘", ipa: "ˌaʊtsaɪd ˈwɜːk | aɪ ˈrɪəli ɪnˈdʒɔɪ ˈtrævəlɪŋ | ən ˈtraɪɪŋ njuː ˈfuːd ↘", focus: "travelling 英式双 l；new 英式 /njuː/。", skill: "word-stress" },
  { text: "Last year I went to Scotland for the first time, and it was absolutely beautiful.", marked: "LAST year I WENT to SCOTland | for the FIRST TIME, | and it was ABsolutely BEAUtiful. ↘", ipa: "ˈlɑːst jɪər aɪ ˈwent tə ˈskɒtlənd | fə ðə ˈfɜːst ˈtaɪm | ən ɪt wəz ˌæbsəˈluːtli ˈbjuːtɪfl ↘", focus: "year I 连接 r；absolutely 重音在 LU，前面有次重音。", skill: "long-word-stress" },
  { text: "Right now, I'm trying to improve my pronunciation, because I'd like to sound clearer and more natural.", marked: "RIGHT NOW, | I'm TRYing to imPROVE my pronunciAtion, | because I'd LIKE to sound CLEARer | and more NATural. ↘", ipa: "ˌraɪt ˈnaʊ | aɪm ˈtraɪɪŋ tʊ ɪmˈpruːv maɪ prəˌnʌnsiˈeɪʃn | bɪˈkɒz aɪd ˈlaɪk tə saʊnd ˈklɪərə | ən mɔː ˈnætʃrəl ↘", focus: "pronunciation 是 /nʌn/ 不是 /naʊn/；clearer 英式 /ˈklɪərə/。", skill: "long-word-stress" },
  { text: "Anyway, that's a bit about me. It's really nice to meet you.", marked: "ANyway, ↘ | that's a BIT about ME. ↘ | It's REALly NICE to MEET you. ↘", ipa: "ˈeniweɪ ↘ | ðæts ə ˈbɪt əbaʊt ˈmiː ↘ | ɪts ˈrɪəli ˈnaɪs tə ˈmiːt ju ↘", focus: "Anyway 收尾；bit about 的 t 可轻弹。", skill: "discourse-markers" },
];

export const day26: DayPlan = {
  day: 26,
  title: "1 分钟自我介绍",
  titleEn: "One-Minute Self-Introduction",
  outcome: "逐句跟读一段 1 分钟的示范自我介绍，再把它改成你自己的版本，录一遍完整的。",
  minMinutes: 60,
  blocks: { understand: 10, perceive: 20, shadow: 45, review: 10 },
  intro: "自我介绍是最值得提前准备好的一段话：面试、开会、认识新同事、旅行时都用得上。准备好一个 1 分钟的版本，练到能自然地说出来，以后遇到类似场景就不会慌。今天先跟读示范，再一句一句换成你自己的内容。",
  learn: [
    {
      id: "d26-structure",
      title: "1 分钟自我介绍的结构",
      paragraphs: [
        "六句话、大约 100 个词就是 1 分钟：",
      ],
      bullets: [
        "1. 名字和背景：Hi, I'm… I'm from… I've been working in… for…",
        "2. 现在在做什么：At the moment, I'm working on…",
        "3. 工作以外：Outside work, I really enjoy…",
        "4. 一个小故事或细节：Last year I went to…",
        "5. 现在的目标：Right now, I'm trying to…, because…",
        "6. 收尾：Anyway, that's a bit about me.",
      ],
    },
    {
      id: "d26-model",
      title: "示范版本",
      paragraphs: INTRO.map((s) => s.text),
    },
    {
      id: "d26-yours",
      title: "改成你自己的版本",
      paragraphs: [
        "每一句只换内容，保留结构：名字、城市、行业、年数、爱好、地方、目标。先写下关键词，再对着关键词说，不要逐字背。",
        "换内容时，注意你自己的词的发音：你的职业、城市名、爱好。不确定的词先在 Pronunciation Lab 里听一遍。",
        "最后完整录一遍。和示范比较的不是内容，而是意群、核心重音、词尾和收尾的降调。",
      ],
      source: "马徐骏 04（准备自己的「高频段落」）",
    },
  ],
  listen: INTRO.map((s, i) => ({ id: `d26-l${i + 1}`, text: s.text, note: s.focus })),
  identify: [
    know("k1", "chunking", "自我介绍里「I'm Lin.」读成单独一个意群，是为了？", ["让对方听清名字", "显得更正式"], 0, "名字是新信息，单独一个意群、重读、降调，对方才能记住。"),
    know("k2", "long-word-stress", "pronunciation 的第二个音节读？", ["/naʊn/，和 pronounce 一样", "/nʌn/"], 1, "pronounce /prəˈnaʊns/，但 pronunciation /prəˌnʌnsiˈeɪʃn/。"),
    know("k3", "fluency", "准备自己的自我介绍，最好的方法是？", ["写下完整稿子逐字背", "写关键词，对着关键词说"], 1, "背稿容易变成「念」；对着关键词说更接近真实表达。"),
    hearQ("h1", "long-word-stress", "absolutely 的主重音在？", "absolutely", ["AB", "LU"], 1, "ˌabsoˈLUtely：主重音在 LU，AB 是次重音。"),
    hearQ("h2", "ed-endings", "说话人去 Scotland 是在？", "Last year I went to Scotland for the first time.", ["去年", "明年"], 0, "Last year + 过去式 went。"),
  ],
  produce: [
    { id: "d26-p1", text: "I've been working in marketing for about five years.", ipa: "aɪv bɪn ˈwɜːkɪŋ ɪn ˈmɑːkɪtɪŋ fər əˈbaʊt ˈfaɪv ˈjɪəz", cue: "换成你的行业和年数。I've been 弱读。", skill: "weak-forms" },
    { id: "d26-p2", text: "pronunciation, absolutely, travelling, project", ipa: "prəˌnʌnsiˈeɪʃn, ˌæbsəˈluːtli, ˈtrævəlɪŋ, ˈprɒdʒekt", cue: "自我介绍里最容易读错的四个词。", skill: "long-word-stress" },
    { id: "d26-p3", text: "Anyway, that's a bit about me. It's really nice to meet you.", ipa: "ˈeniweɪ ↘ | ðæts ə ˈbɪt əbaʊt ˈmiː ↘ | ɪts ˈrɪəli ˈnaɪs tə ˈmiːt ju ↘", cue: "收尾要清楚地降下来。", skill: "discourse-markers" },
  ],
  shadow: [
    ...INTRO.map<ShadowItem>((s, i) => ({ id: `d26-s${i + 1}`, ...s })),
    { id: "d26-s7", text: INTRO.map((s) => s.text).join(" "), focus: "完整跟读示范一遍，大约 1 分钟。", skill: "fluency" },
    { id: "d26-s8", text: "Tell me a bit about yourself.", focus: "不看文本，按六句的结构说你自己的版本。示范音频只是题目。录完听：名字清楚吗？意群停顿和收尾的降调保住了吗？这段录音值得留着，Day 28 之后可以拿来和下个月比较。", skill: "fluency" },
  ],
  reviewPrompts: ["你自己的版本说了多长时间？哪一句卡住了？", "你的职业、城市或爱好里，有没有不确定读音的词？", "明天再录一遍，看看是否比今天更自然。"],
  skills: ["chunking", "long-word-stress", "discourse-markers", "fluency"],
};
