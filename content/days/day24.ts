import type { DayPlan, QuizItem } from "../types";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d24-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d24-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

export const day24: DayPlan = {
  day: 24,
  title: "表达观点：强调、对比与委婉",
  titleEn: "Giving Opinions",
  outcome: "用 I think / To be honest / It depends 开头；用核心重音强调和对比；用降升调表示「但是」，委婉地表达不同意见。",
  minMinutes: 60,
  blocks: { understand: 15, perceive: 25, shadow: 35, review: 10 },
  intro: "表达观点时，英式英语有一个明显的特点：很少把话说死。I think it's a great idea 和 It's a GOOD idea, ↘↗ but… 意思差别很大，而这个差别几乎全在语调里。今天练三件事：观点的开头怎么说，怎么用重音强调和对比，怎么用降升调委婉地说「但是」。",
  learn: [
    {
      id: "d24-open",
      title: "观点的开头",
      paragraphs: [
        "这些开头词本身不重读，说得轻快，把重音留给后面的观点：",
      ],
      bullets: [
        "I think… / I don't think… （英式更常说 I don't think it's… 而不是 I think it isn't…）",
        "To be honest, ↘↗ … （说真话，常带出不太好听的意见）",
        "Personally, ↘↗ … / For me, …",
        "It depends. ↘ / It depends on… （很英式的回答，不急着下结论）",
        "I'd say… （委婉地给出判断）",
      ],
    },
    {
      id: "d24-stress",
      title: "用重音强调和对比",
      paragraphs: [
        "要强调的词说得更重、更长、音高变化更大：It's REALly important. / I LOVE it.",
        "对比时，两个对比项都要重读：I prefer TEA to COFfee. / It's not the PRICE, ↘↗ it's the QUALity. ↘",
        "同一句话，重音不同意思不同（Day 12 复习）：I didn't say it was BAD（我说的不是「坏」）/ I didn't SAY it was bad（我心里这么想，但没说出口）。",
      ],
      source: "Day 12 核心重音的延伸",
    },
    {
      id: "d24-fallrise",
      title: "降升调：「但是……」",
      paragraphs: [
        "降升调 ↘↗ 是英式英语里最有代表性的语调之一：先降，再在同一个词或下一个音节上扬。它的意思是「我还没说完」「有保留」「但是……」。",
        "It's a good idea, ↘↗ but I'm not sure it would work. ↘ / The flat's nice… ↘↗（但是有问题）/ I like it, ↘↗ I suppose.（不太情愿）",
        "降升调后面常常跟 but，即使不说出来，母语者也能听出「但是」的意思。",
      ],
      bullets: ["It's a good idea, ↘↗ but…", "That's true, ↘↗ but…", "In theory, ↘↗ yes."],
    },
  ],
  listen: [
    { id: "d24-l1", text: "I don't think it's a good idea.", note: "英式否定：don't think。" },
    { id: "d24-l2", text: "To be honest, I'm not a big fan of it.", note: "To be honest 带出真实意见。" },
    { id: "d24-l3", text: "It depends on the weather.", note: "不急着下结论。" },
    { id: "d24-l4", text: "I prefer tea to coffee.", note: "对比项都重读。" },
    { id: "d24-l5", text: "It's not the price, it's the quality.", note: "对比重音。" },
    { id: "d24-l6", text: "It's a good idea, but I'm not sure it would work.", note: "降升调 + but。" },
  ],
  identify: [
    know("k1", "fall-rise", "「It's a good idea... ↘↗」用降升调说，意思最可能是？", ["非常好，完全同意", "想法不错，但我有保留"], 1, "降升调表示保留，后面常常跟着 but。"),
    know("k2", "tonic", "「I prefer TEA to COFfee.」里重读 TEA 和 COFFEE 是因为？", ["它们是对比项", "它们是名词"], 0, "对比时两个对比项都重读。"),
    know("k3", "discourse-markers", "英式英语里更常见的说法是？", ["I think it isn't true.", "I don't think it's true."], 1, "否定通常放在 think 上：I don't think…"),
    know("k4", "discourse-markers", "朋友问你某家餐厅好不好，你觉得要看情况，最自然的回答是？", ["It depends.", "I don't know."], 0, "It depends 表示「看情况」，后面可以接 on…"),
    know("k5", "tonic", "「I didn't say it was BAD.」重音在 BAD，表达的是？", ["我说的不是「坏」，是别的词", "我没说过这句话"], 0, "重音在 BAD：否定的是这个词本身。"),
    hearQ("h1", "tonic", "说话人在对比什么？", "It's not the price, it's the quality.", ["价格和质量", "价格和数量"], 0, "price 和 quality 都重读。"),
    hearQ("h2", "weak-forms", "这句话一共有几个词？", "To be honest, I'm not a big fan of it.", ["9 个", "10 个", "11 个"], 1, "To be honest, I'm not a big fan of it. 10 个词（I'm 算一个）。"),
  ],
  produce: [
    { id: "d24-p1", text: "I think so. I don't think so. I'd say it's worth it.", ipa: "aɪ ˈθɪŋk səʊ ↘. aɪ ˈdəʊnt ˈθɪŋk səʊ ↘. aɪd ˈseɪ ɪts ˈwɜːθ ɪt ↘", cue: "think 的 th；worth it 连读 /wɜːθɪt/。", skill: "discourse-markers" },
    { id: "d24-p2", text: "To be honest, I'm not a big fan of it.", ipa: "tə bi ˈɒnɪst ↘↗ | aɪm nɒt ə ˈbɪɡ ˈfæn əv ɪt ↘", cue: "honest 的 h 不发音；fan of it 连读。", skill: "fall-rise" },
    { id: "d24-p3", text: "It depends. It depends on the weather.", ipa: "ɪt dɪˈpendz ↘. ɪt dɪˈpendz ɒn ðə ˈweðə ↘", cue: "depends 的 /ndz/ 不丢；depends on 连读。", skill: "clusters" },
    { id: "d24-p4", text: "I prefer tea to coffee. It's not the price, it's the quality.", ipa: "aɪ prɪˈfɜː ˈtiː tə ˈkɒfi ↘. ɪts ˈnɒt ðə ˈpraɪs ↘↗ | ɪts ðə ˈkwɒləti ↘", cue: "对比项都重读；quality 英式 /ˈkwɒləti/。", skill: "tonic" },
    { id: "d24-p5", text: "It's a good idea, but I'm not sure it would work.", ipa: "ɪts ə ˈɡʊd aɪˈdɪə ↘↗ | bət aɪm ˈnɒt ˈʃɔːr ɪt wəd ˈwɜːk ↘", cue: "idea 上降升调；sure it 连接 r。", skill: "fall-rise" },
  ],
  shadow: [
    { id: "d24-s1", text: "What do you think of working from home? To be honest, I think it depends on the job.", marked: "What do you THINK of working from HOME? ↘ | To be HONest, ↘↗ | I think it dePENDS on the JOB. ↘", ipa: "wɒt də jə ˈθɪŋk əv ˈwɜːkɪŋ frəm ˈhəʊm ↘ | tə bi ˈɒnɪst ↘↗ | aɪ θɪŋk ɪt dɪˈpendz ɒn ðə ˈdʒɒb ↘", focus: "观点开头轻快；depends on 连读。", skill: "discourse-markers" },
    { id: "d24-s2", text: "Personally, I prefer working in the office. It's not the work, it's the people.", marked: "PERsonally, ↘↗ | I preFER working in the OFfice. ↘ | It's not the WORK, ↘↗ | it's the PEOple. ↘", ipa: "ˈpɜːsənəli ↘↗ | aɪ prɪˈfɜː ˈwɜːkɪŋ ɪn ði ˈɒfɪs ↘ | ɪts ˈnɒt ðə ˈwɜːk ↘↗ | ɪts ðə ˈpiːpl ↘", focus: "对比重音 WORK / PEOPLE；the 在元音前读 /ði/。", skill: "tonic" },
    { id: "d24-s3", text: "It's a good idea, but I'm not sure it would work.", marked: "It's a GOOD iDEa, ↘↗ | but I'm NOT SURE it would WORK. ↘", ipa: "ɪts ə ˈɡʊd aɪˈdɪə ↘↗ | bət aɪm ˈnɒt ˈʃɔːr ɪt wəd ˈwɜːk ↘", focus: "降升调表示保留。", skill: "fall-rise" },
    { id: "d24-s4", text: "That's true, but on the other hand, it's really expensive.", marked: "That's TRUE, ↘↗ | but on the OTHer HAND, | it's REALly exPENsive. ↘", ipa: "ðæts ˈtruː ↘↗ | bət ɒn ði ˈʌðə ˈhænd | ɪts ˈrɪəli ɪkˈspensɪv ↘", focus: "部分同意，再说不同意见；other 结尾 /ə/。", skill: "fall-rise" },
    { id: "d24-s5", text: "What do you think of learning English with apps?", focus: "不看文本，用 To be honest… / It depends… / It's a good idea, but… 说 3–4 句你的看法。示范音频只是题目。录完听：but 前面有没有降升调？", skill: "fluency" },
  ],
  reviewPrompts: ["你的录音里，降升调听得出来吗？还是变成了普通的降调？", "对比的两个词都重读了吗？", "想一个你真正有看法的话题，用今天的句型说一遍。"],
  skills: ["fall-rise", "tonic", "discourse-markers"],
};
