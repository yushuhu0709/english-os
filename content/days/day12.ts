import type { DayPlan, QuizItem } from "../types";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d12-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d12-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

export const day12: DayPlan = {
  day: 12,
  title: "语调：核心重音、对比与附加问句",
  titleEn: "Intonation: Tonic, Contrast & Tags",
  outcome: "把核心重音放对位置（新信息、对比），用降调、升调、降升调表达不同的态度，掌握附加问句和列举的语调。",
  minMinutes: 60,
  blocks: { understand: 20, perceive: 30, shadow: 30, review: 10 },
  intro: "Day 6 学了降调和升调。今天解决两个问题：音高变化「在哪里」发生（核心重音的位置），以及「怎么变」表达什么态度。语调错了，句子在语法上没错，听起来却可能像不耐烦、不确定或不礼貌。",
  learn: [
    {
      id: "d12-tonic",
      title: "核心重音默认在最后一个实词",
      paragraphs: [
        "一个意群里只有一个核心重音（tonic）：这个音节最高或音高变化最大，后面的词都压低。",
        "没有特殊语境时，核心重音落在最后一个实词上：I'd like a cup of TEA。I've lost my KEYS。",
        "如果最后一个词是代词或已经说过的信息，核心重音前移：I've lost THEM → I've LOST them。A: Did you see the film? B: I didn't LIKE the film。",
      ],
      bullets: ["I've lost my KEYS.", "I've LOST them.（them 是旧信息）", "A: Do you like Paris? B: I LOVE Paris.（Paris 已提过）"],
    },
    {
      id: "d12-contrast",
      title: "对比重音：重音移到对比项上",
      paragraphs: [
        "需要纠正或对比时，核心重音放在对比的词上，哪怕它是功能词：I said BLUE, not black。It's MY turn, not YOURS。I CAN swim（反驳）。",
        "同一句话，重音位置不同，意思就不同：",
      ],
      bullets: [
        "I didn't say she TOOK it.（我说的是她借了，不是拿了）",
        "I didn't say SHE took it.（我说的是别人拿了）",
        "I didn't SAY she took it.（我心里是这么想的，但没说出来）",
        "I DIDN'T say she took it.（我根本没这么说）",
      ],
      source: "马徐骏 03（语调层面）；《1000小时》4.5.5",
    },
    {
      id: "d12-tones",
      title: "三种基本语调表达什么",
      paragraphs: [
        "降调 ↘：完整、确定、给出信息。陈述句、wh- 问句、命令。Where do you LIVE? ↘ I live in BRIStol. ↘",
        "升调 ↗：未完、询问、礼貌、鼓励。一般疑问句、礼貌的请求。Could you pass the SALT? ↗ Is it YOURS? ↗",
        "降升调 ↘↗：保留、委婉、话里有话、对比。SSBE 里非常常见。A: Did you like it? B: It was... ↘↗ INteresting.（言外之意：不太喜欢）。I like the COLour... ↘↗（但别的不喜欢）。",
        "用平平的降调回答礼貌的提问，在英式英语里可能显得冷淡或不耐烦，这也是为什么礼貌请求多用升调。",
      ],
      bullets: ["Where do you live? ↘", "Could you pass the salt? ↗", "It's not bad... ↘↗"],
    },
    {
      id: "d12-tags",
      title: "附加问句：降调还是升调",
      paragraphs: [
        "附加问句（isn't it、haven't you、don't they）的语调落在助动词上，有两种：",
        "降调 ↘：说话人确信，只是寻求认同或寒暄。It's a lovely DAY, ISn't it? ↘（天气确实好）",
        "升调 ↗：说话人不确定，是真的在问。You've met ANna, HAVen't you? ↗（不确定你们见过没有）",
        "提示：合成语音只能根据标点读升降，本课用句号表示降调、问号表示升调。真人对话里两种都写问号。",
      ],
    },
    {
      id: "d12-lists",
      title: "列举与选择",
      paragraphs: [
        "列举：前几项用升调，表示还没说完；最后一项用降调，表示结束。We need eggs ↗, milk ↗, and bread ↘。",
        "选择疑问句：前一项升，后一项降，表示只有这两个选项：Would you like tea ↗ or coffee ↘？如果最后也用升调，意思是「要不要来点喝的，比如茶或咖啡？」。",
      ],
      bullets: ["We need eggs ↗, milk ↗, and bread ↘.", "Tea ↗ or coffee ↘?"],
    },
  ],
  listen: [
    { id: "d12-l1", text: "I'd like a cup of tea. I've lost my keys.", note: "核心重音在最后一个实词。" },
    { id: "d12-l2", text: "I've lost them.", note: "them 是旧信息，核心重音前移到 lost（合成语音不一定能读出来）。" },
    { id: "d12-l3", text: "Where do you live? Could you pass the salt?", note: "降调与礼貌的升调。" },
    { id: "d12-l4", text: "It's a lovely day, isn't it.", note: "附加问句降调：寻求认同。" },
    { id: "d12-l5", text: "You've met Anna, haven't you?", note: "附加问句升调：真的在问。" },
    { id: "d12-l6", text: "We need eggs, milk, and bread.", note: "列举：升、升、降。" },
    { id: "d12-l7", text: "Would you like tea or coffee?", note: "选择疑问句。" },
  ],
  identify: [
    know("k1", "tonic", "「I've lost my keys.」默认的核心重音在？", ["I've", "lost", "keys"], 2, "没有特殊语境时，核心重音在最后一个实词 KEYS。"),
    know("k2", "tonic", "「I've lost them.」核心重音在？", ["lost", "them"], 0, "them 是代词、旧信息，不承载核心重音：I've LOST them。"),
    know("k3", "tonic", "A: Do you like Paris? B: I love Paris. 回答的核心重音在？", ["love", "Paris"], 0, "Paris 已经提过，核心重音前移到 LOVE。"),
    know("k4", "tonic", "「I didn't say SHE took it.」表达的是？", ["我说的是她借了", "我说的是别人拿的", "我根本没说过"], 1, "重音在 SHE：对比的是人。"),
    know("k5", "tonic", "纠正对方：「不是黑色，是蓝色」，哪个读法对？", ["I said BLUE, not black.", "I SAID blue, not black."], 0, "对比项 BLUE 承载核心重音。"),
    know("k6", "question-tags", "看到下雨对邻居说「It's wet today, isn't it」，附加问句应该用？", ["降调 ↘", "升调 ↗"], 0, "双方都看得到在下雨，只是寒暄、寻求认同：降调。"),
    know("k7", "question-tags", "不确定对方是否已经交了报告：「You've sent the report, haven't you」，应该用？", ["降调 ↘", "升调 ↗"], 1, "真的不确定、在确认：升调。"),
    know("k8", "question-tags", "A: How was the film? B: It was... interesting. 用降升调 ↘↗ 说 interesting，意思通常是？", ["非常好看", "不太喜欢，但说得很委婉"], 1, "降升调常表示保留、话里有话。"),
    know("k9", "intonation", "「We need eggs, milk, and bread」最自然的语调是？", ["升、升、降", "降、降、降", "升、升、升"], 0, "列举时前几项升，最后一项降表示结束。"),
    hearQ("h1", "question-tags", "附加问句是降调还是升调？", "It's a lovely day, isn't it.", ["降调 ↘（寻求认同）", "升调 ↗（真的在问）"], 0, "句号：降调。"),
    hearQ("h2", "question-tags", "附加问句是降调还是升调？", "You've met Anna, haven't you?", ["降调 ↘（寻求认同）", "升调 ↗（真的在问）"], 1, "问号：升调。"),
    hearQ("h3", "intonation", "这句话最后是升调还是降调？", "Could you pass the salt?", ["降调 ↘", "升调 ↗"], 1, "礼貌的请求常用升调。"),
  ],
  produce: [
    { id: "d12-p1", text: "I'd like a cup of tea. I've lost my keys. I've lost them.", ipa: "aɪd ˈlaɪk ə ˈkʌp əv ˈtiː ↘. aɪv ˈlɒst maɪ ˈkiːz ↘. aɪv ˈlɒst ðəm ↘", cue: "核心重音依次在 TEA、KEYS、LOST 上：这个音节音高最高，从这里开始下降，后面的词全部压低。", skill: "tonic" },
    { id: "d12-p2", text: "I didn't say she took it.", ipa: "aɪ ˈdɪdnt ˈseɪ ʃi ˈtʊk ɪt", cue: "说四遍，每遍把重音放在不同的词上：TOOK / SHE / SAY / DIDN'T，并说出每遍的意思。", skill: "tonic" },
    { id: "d12-p3", text: "I said blue, not black. It's my turn, not yours.", ipa: "aɪ sed ˈbluː ↘ | nɒt ˈblæk. ɪts ˈmaɪ tɜːn | nɒt ˈjɔːz", cue: "对比项读得最高最长，其它词都压低。my 在对比时用强读 /maɪ/。", skill: "tonic" },
    { id: "d12-p4", text: "It's a lovely day, isn't it? You've met Anna, haven't you?", ipa: "ɪts ə ˈlʌvli ˈdeɪ | ˈɪznt ɪt ↘. juv ˈmet ˈænə | ˈhævnt ju ↗", cue: "第一句 isn't 上下降（寒暄）；第二句 haven't 上上升（确认）。", skill: "question-tags" },
    { id: "d12-p5", text: "It was... interesting. I like the colour...", ipa: "ɪt wəz ↘↗ ˈɪntrəstɪŋ. aɪ ˈlaɪk ðə ˈkʌlə ↘↗", cue: "降升调：在重读音节上先落下，再在末尾轻轻抬起，表示「但是……」。", skill: "question-tags" },
    { id: "d12-p6", text: "We need eggs, milk, and bread. Would you like tea or coffee?", ipa: "wi ˈniːd ˈeɡz ↗ | ˈmɪlk ↗ | ən ˈbred ↘. wʊdʒu ˈlaɪk ˈtiː ↗ | ɔː ˈkɒfi ↘", cue: "列举：升、升、降。选择：tea 升，coffee 降。", skill: "intonation" },
  ],
  shadow: [
    { id: "d12-s1", text: "Did you see the film? Yes, but I didn't like the film.", marked: "Did you SEE the film? ↗ | YES, ↘ | but I didn't LIKE the film. ↘", ipa: "dɪdʒu ˈsiː ðə fɪlm ↗ | ˈjes ↘ | bət aɪ ˈdɪdnt ˈlaɪk ðə fɪlm ↘", focus: "第二个 film 是旧信息，核心重音在 LIKE。", skill: "tonic" },
    { id: "d12-s2", text: "I said blue, not black.", marked: "I said BLUE, ↘ | not BLACK. ↘", ipa: "aɪ sed ˈbluː ↘ | nɒt ˈblæk ↘", focus: "对比重音。", skill: "tonic" },
    { id: "d12-s3", text: "It's a lovely day, isn't it.", marked: "It's a LOVEly DAY, | ISn't it. ↘", ipa: "ɪts ə ˈlʌvli ˈdeɪ | ˈɪznt ɪt ↘", focus: "附加问句降调：寒暄、寻求认同。", skill: "question-tags" },
    { id: "d12-s4", text: "You've met Anna, haven't you?", marked: "You've MET ANna, | HAVen't you? ↗", ipa: "juv ˈmet ˈænə | ˈhævnt ju ↗", focus: "附加问句升调：真的在问。", skill: "question-tags" },
    { id: "d12-s5", text: "Could you pass the salt, please?", marked: "Could you PASS the SALT, please? ↗", ipa: "kʊdʒu ˈpɑːs ðə ˈsɔːlt pliːz ↗", focus: "礼貌请求的升调；pass 的 /ɑː/、salt 的 /ɔː/ 都是英式。", skill: "intonation" },
    { id: "d12-s6", text: "We need eggs, milk, and bread.", marked: "We need EGGS, ↗ | MILK, ↗ | and BREAD. ↘", ipa: "wi niːd ˈeɡz ↗ | ˈmɪlk ↗ | ən ˈbred ↘", focus: "列举：升、升、降。", skill: "intonation" },
  ],
  reviewPrompts: ["录音里核心重音的位置和你想表达的意思一致吗？", "附加问句的降调和升调，你自己听得出区别吗？", "降升调听起来自然吗？还是像在唱歌？"],
  skills: ["tonic", "question-tags", "intonation"],
};
