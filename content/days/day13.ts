import type { DayPlan, QuizItem, ShadowItem } from "../types";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d13-${id}`, kind: "know", prompt, options, answer, skill, explain,
});

// An original short narrative in everyday British English. Each sentence is one
// shadowing unit; marks follow the conventions used all week.
export const OXFORD_PASSAGE: { text: string; marked: string; ipa: string; focus: string; skill: string }[] = [
  {
    text: "Last Saturday I went to Oxford with a friend of mine.",
    marked: "LAST SATurday | I went to OXford | with a FRIEND of mine.",
    ipa: "lɑːst ˈsætədeɪ | aɪ ˈwent tʊ ˈɒksfəd | wɪð ə ˈfrend əv maɪn",
    focus: "last 的 /ɑː/；to 在元音前读 /tʊ/；friend of 连读。",
    skill: "chunking",
  },
  {
    text: "We caught the early train, so we got there at about half past nine.",
    marked: "We CAUGHT the EARly TRAIN, | so we got THERE‿at about HALF past NINE.",
    ipa: "wi ˈkɔːt ði ˈɜːli ˈtreɪn | səʊ wi ɡɒt ˈðeər ət əˈbaʊt ˌhɑːf pɑːst ˈnaɪn",
    focus: "the early 的 /ði/ + [j]；there at 的连接 r；half past 都是 /ɑː/。",
    skill: "linking-r",
  },
  {
    text: "It was a bit cold, but the sun was out, and the streets were already busy.",
    marked: "It was a bit COLD, | but the SUN was OUT, | and the STREETS were‿alREADy BUSy.",
    ipa: "ɪt wəz ə bɪt ˈkəʊld | bət ðə ˈsʌn wəz ˈaʊt | ən ðə ˈstriːts wər ɔːlˈredi ˈbɪzi",
    focus: "三个意群；was 弱读；were already 连接 r；cold 的 /əʊ/。",
    skill: "weak-forms",
  },
  {
    text: "First we walked along the river and had a coffee in a little café.",
    marked: "FIRST we WALKED along the RIVer | and HAD‿a COFfee in‿a LITtle CAFé.",
    ipa: "ˈfɜːst wi ˈwɔːkt əˈlɒŋ ðə ˈrɪvə | ən ˈhæd ə ˈkɒfi ɪn ə ˈlɪtl ˈkæfeɪ",
    focus: "walked 的 /ɔː/ 和词尾 /kt/；river 后面是辅音，没有 r；little 的 t 清楚。",
    skill: "linking",
  },
  {
    text: "Then we spent an hour or two in one of the old college libraries.",
    marked: "Then we SPENT an HOUR‿or TWO | in ONE of the OLD COLlege LIbraries.",
    ipa: "ðen wi ˈspent ən ˈaʊər ɔː ˈtuː | ɪn ˈwʌn əv ði ˈəʊld ˈkɒlɪdʒ ˈlaɪbrəriz",
    focus: "spent an 连读；hour or 连接 r；the old 的 [j]；libraries 不卷舌。",
    skill: "linking-r",
  },
  {
    text: "In the afternoon it started to rain, so we went to a museum instead.",
    marked: "In the afterNOON | it STARted to RAIN, | so we WENT to a muSEum inSTEAD.",
    ipa: "ɪn ði ˌɑːftəˈnuːn | ɪt ˈstɑːtɪd tə ˈreɪn | səʊ wi ˈwent tʊ ə mjuˈziːəm ɪnˈsted",
    focus: "afternoon 在句中重音在后；started 的 t 清楚；museum 重音在 -se-。",
    skill: "compound-stress",
  },
  {
    text: "By the time we got home, we were tired, but we'd had a lovely day.",
    marked: "By the TIME we got HOME, | we were TIRED, | but we'd HAD a LOVEly DAY.",
    ipa: "baɪ ðə ˈtaɪm wi ɡɒt ˈhəʊm | wi wə ˈtaɪəd | bət wid ˈhæd ə ˈlʌvli ˈdeɪ",
    focus: "got home 的 t 可用喉塞；were 弱读 /wə/；we'd 的 d 不爆破。",
    skill: "glottal-t",
  },
  {
    text: "I'd like to go back in the summer, when it's a bit warmer.",
    marked: "I'd LIKE to go BACK in the SUMmer, | when it's a bit WARMer.",
    ipa: "aɪd ˈlaɪk tə ɡəʊ ˈbæk ɪn ðə ˈsʌmə | wen ɪts ə bɪt ˈwɔːmə",
    focus: "summer、warmer 结尾都是 /ə/，不卷舌；降调结束整段。",
    skill: "intonation",
  },
];

export const day13: DayPlan = {
  day: 13,
  title: "长段落跟读",
  titleEn: "Extended Shadowing",
  outcome: "按《1000小时》的跟读流程完整练一段 8 句的短文，然后用自己的话复述一遍。",
  minMinutes: 60,
  blocks: { understand: 15, perceive: 25, shadow: 40, review: 10 },
  intro: "前五天每天练一种语流现象。今天把它们全部放进一段完整的话里：意群、核心重音、弱读、连读、连接 r、喉塞、降升调。跟读时间比平时长，这是今天的重点。",
  learn: [
    {
      id: "d13-method",
      title: "跟读的六个步骤",
      paragraphs: [
        "① 查清每个音：不认识的词先查英式音标，不确定的重音查词典。",
        "② 慢听标记：用 0.8 倍速听示范，在文本上标出 | 意群、大写重音、‿ 连读、↘↗ 语调。本课已经替你标好，但请自己先听一遍，看看和标注是否一致。",
        "③ 分段跟读：一次一个意群，听一遍、说一遍，直到和示范几乎重合。",
        "④ 完整跟读：整句、再到整段，跟着示范同步说（shadowing），慢一拍也可以。",
        "⑤ 录音对比：每句录一遍，和示范逐句比较。",
        "⑥ 足量重复：卡住的地方单独拿出来练五遍，再放回句子里。",
      ],
      source: "《1000小时》第 5 章（跟读的方法）",
    },
    {
      id: "d13-checklist",
      title: "对比时听什么",
      paragraphs: [
        "不要试图一次听所有东西。每次回放只听一项：",
      ],
      bullets: [
        "停顿：我的停顿位置和示范一样吗？",
        "核心重音：每个意群最重的词对吗？",
        "弱读：功能词压得够轻、够快吗？",
        "连读：词与词之间有没有多余的停顿或喉塞？",
        "元音：英式的 /ɑː/（half, past, last）、/əʊ/（cold, home, go）、/ɒ/（coffee, college）对吗？",
        "结尾：有没有在 summer、warmer、river 后面卷舌？",
      ],
    },
    {
      id: "d13-own",
      title: "从跟读到自己说",
      paragraphs: [
        "跟读练的是模仿。最后一步是用自己的话说：不看文本，用 1 分钟讲讲你最近的一个周末或一次出行。",
        "不用追求复杂的句子。挑两三个今天练过的结构（By the time…, so we…, I'd like to…）用上，录下来，听的时候只检查停顿和核心重音。",
        "这一段没有示范音频可以对比，自评时以「和你跟读时的状态比，保住了多少」为标准。",
      ],
    },
  ],
  listen: OXFORD_PASSAGE.map((p, i) => ({ id: `d13-l${i + 1}`, text: p.text, note: p.focus })),
  identify: [
    know("k1", "chunking", "「It was a bit cold, but the sun was out, and the streets were already busy.」最自然分几个意群？", ["1 个", "3 个", "6 个"], 1, "按逗号分成三个意群，每个意群一个核心重音：COLD、OUT、BUSy。"),
    know("k2", "linking-r", "「got there at about」中 there 后面有没有 r 音？", ["有，连接 r", "没有"], 0, "there 后接元音开头的 at：/ˈðeər ət/。"),
    know("k3", "linking-r", "「along the river and had」中 river 后面有没有 r 音？", ["有", "没有"], 0, "river 后接元音开头的 and，出现连接 r：/ˈrɪvər ən/。如果在这里停顿，就没有 r。"),
    know("k4", "glides", "「the early train」中 the 怎么读？", ["/ðə/", "/ði/，后面带 [j] 滑音"], 1, "the 在元音前传统上读 /ði/，接 early 时有 [j] 滑音。现代 SSBE 也有人读 /ðə/ 加喉塞或直接连读，两种都能接受。"),
    know("k5", "compound-stress", "「In the afternoon it started to rain.」中 afternoon 的重音在？", ["AF-ter-noon", "af-ter-NOON"], 1, "afternoon 后面接的是 it（不重读），所以重音在原位 NOON。"),
    know("k6", "weak-forms", "「we were tired」中 were 怎么读？", ["/wɜː/", "/wə/"], 1, "句中的 were 弱读为 /wə/。"),
    know("k7", "fluency", "跟读时卡在一个地方，最有效的做法是？", ["整段从头再来", "把卡住的部分单独拿出来练五遍，再放回句子里"], 1, "《1000小时》：短时间内足量重复卡住的部分。"),
    know("k8", "fluency", "录音对比时，最好每次回放？", ["同时检查所有项目", "只听一项，比如只听停顿"], 1, "一次只听一项，才听得出问题。"),
  ],
  produce: [
    { id: "d13-p1", text: "half past nine, at about half past nine", ipa: "ˌhɑːf pɑːst ˈnaɪn, ət əˈbaʊt ˌhɑːf pɑːst ˈnaɪn", cue: "英式 /ɑː/：half、past。at about 连读。", skill: "chunking" },
    { id: "d13-p2", text: "there at, were already, hour or two", ipa: "ˈðeər ət, wər ɔːlˈredi, ˈaʊər ɔː ˈtuː", cue: "三处连接 r，r 很轻，只起连接作用。", skill: "linking-r" },
    { id: "d13-p3", text: "the early train, the old college", ipa: "ði ˈɜːli ˈtreɪn, ði ˈəʊld ˈkɒlɪdʒ", cue: "the 在元音前用 /ði/，带 [j] 滑到后面的元音。", skill: "glides" },
    { id: "d13-p4", text: "walked along the river, had a coffee in a little café", ipa: "ˈwɔːkt əˈlɒŋ ðə ˈrɪvə, ˈhæd ə ˈkɒfi ɪn ə ˈlɪtl ˈkæfeɪ", cue: "walked 的 /kt/ 接到 along；had a、in a 连读；café 在英式里重音在前。", skill: "linking" },
    { id: "d13-p5", text: "By the time we got home, we were tired.", ipa: "baɪ ðə ˈtaɪm wi ɡɒt ˈhəʊm | wi wə ˈtaɪəd", cue: "两个意群，核心重音在 HOME、TIRED。tired 是 /ˈtaɪəd/，不卷舌。", skill: "chunking" },
    { id: "d13-p6", text: "in the summer, when it's a bit warmer", ipa: "ɪn ðə ˈsʌmə | wen ɪts ə bɪt ˈwɔːmə", cue: "结尾的 /ə/ 放松、短，不卷舌。整段最后用降调结束。", skill: "intonation" },
  ],
  shadow: [
    ...OXFORD_PASSAGE.map<ShadowItem>((p, i) => ({ id: `d13-s${i + 1}`, ...p })),
    {
      id: "d13-full",
      text: OXFORD_PASSAGE.map((p) => p.text).join(" "),
      focus: "整段完整跟读一次。录完和示范比较：只听停顿和核心重音。",
      skill: "fluency",
    },
    {
      id: "d13-retell",
      text: "Tell me about a recent weekend or a day out.",
      focus: "不看文本，用自己的话说 1 分钟。示范音频只是题目，没有可对比的答案；自评以「保住了多少跟读时的停顿和重音」为标准。",
      skill: "fluency",
    },
  ],
  reviewPrompts: ["整段跟读时，哪一句最难跟上？卡在什么地方？", "复述时，你保住了多少跟读时的停顿和重音？", "下一次跟读材料，你想换成什么内容（新闻、播客、剧集、工作场景）？"],
  skills: ["fluency", "chunking", "linking-r", "weak-forms", "intonation"],
};
