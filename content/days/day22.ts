import type { DayPlan, QuizItem } from "../types";
import { BASELINE4_QUIZ, BASELINE4_RECORD } from "../baseline4";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d22-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d22-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

export const day22: DayPlan = {
  day: 22,
  title: "第四周基线：辅音丛与长单词重音",
  titleEn: "Week 4 Baseline · Clusters & Long-Word Stress",
  outcome: "做第四周的基线测试；连续的辅音不加元音；按后缀找到长单词的重音。",
  minMinutes: 60,
  blocks: { understand: 15, perceive: 30, shadow: 30, review: 10 },
  intro: "第四周的目标是从跟读走向自己说：讲一件事、表达观点、做 1 分钟自我介绍。自己说的时候，最先暴露的是两类问题：一串辅音（texts、months、asked）里被塞进去的元音，和长单词的重音位置。今天先做基线测试（Day 28 用同一套材料复测，同时和 Day 1 的录音做一个月对比），再把这两点练扎实。",
  learn: [
    {
      id: "d22-week4",
      title: "第四周练什么",
      paragraphs: [
        "Day 22 辅音丛与长单词重音，Day 23 讲故事，Day 24 表达观点，Day 25 长句的意群和停顿，Day 26 1 分钟自我介绍，Day 27 看提示自由表达 1 分钟，Day 28 月度复测并生成一个月报告。",
        "从这一周开始，录音里会有越来越多「你自己的话」。不用追求句子复杂，先保住发音、意群和重音。",
      ],
    },
    {
      id: "d22-baseline",
      title: "基线测试怎么做",
      paragraphs: [
        "辨音题里标着「基线」的 16 道题和跟读里标着「可比录音」的 6 段，会在 Day 28 原样再做一次。按你现在自然的状态做，不要先反复练。",
        "Day 28 还会让你再读一遍 Day 1 的那段短文，用来做第一天和最后一天的对比。",
      ],
    },
    {
      id: "d22-clusters",
      title: "辅音丛：不加元音、不丢辅音",
      paragraphs: [
        "中文的音节几乎都是「辅音 + 元音」，所以遇到一串辅音时，我们会不自觉地在中间加 /ə/：texts 读成 /ˈtekəsətəsə/，或者干脆丢掉几个：/tek/。",
        "练法：从后往前加。s → ts → sts → ksts → teksts。每加一个音都保持舌头连续移动，中间不要有元音。",
        "快速口语里母语者也会简化：texts → /teks/、months → /mʌns/、asked → /ɑːst/。但先练会完整的读法，才知道可以简化哪里。",
      ],
      bullets: ["texts /teksts/", "months /mʌnθs/", "sixth /sɪksθ/", "asked /ɑːskt/", "strengths /streŋθs/"],
    },
    {
      id: "d22-stress",
      title: "长单词重音：看后缀",
      paragraphs: [
        "很多后缀决定了重音的位置，记住几条最常用的规则：",
      ],
      bullets: [
        "-tion / -sion：前一个音节重读：inforMAtion、deCIsion",
        "-ic / -ical：前一个音节重读：ecoNOMic、poLItical",
        "-ity：前一个音节重读：possiBIlity、uniVERsity",
        "-graphy / -logy：前一个音节重读：phoTOgraphy、techNOlogy",
        "重音移动后，原来重读的元音常常弱化成 /ə/：PHOtograph /ˈfəʊtəɡrɑːf/ → phoTOgraphy /fəˈtɒɡrəfi/",
      ],
      source: "Day 5 单词重音的延伸",
    },
  ],
  listen: [
    { id: "d22-l1", text: "texts, months, sixth, asked", note: "辅音丛完整读法。" },
    { id: "d22-l2", text: "She asked for the texts from the last six months.", note: "句子里的辅音丛。" },
    { id: "d22-l3", text: "photograph, photography, photographic", note: "重音随后缀移动。" },
    { id: "d22-l4", text: "economy, economic, economics", note: "eCOnomy → ecoNOMic。" },
    { id: "d22-l5", text: "information, decision, possibility, university", note: "-tion / -sion / -ity。" },
    { id: "d22-l6", text: "technology, political, communication", note: "长单词的次重音。" },
  ],
  identify: [
    ...BASELINE4_QUIZ,
    know("k1", "long-word-stress", "university 的重音在？", ["U-ni-ver-si-ty", "u-ni-VER-si-ty", "u-ni-ver-SI-ty"], 1, "-ity 前一个音节重读：uniVERsity。"),
    know("k2", "long-word-stress", "decision 的重音在？", ["DE-ci-sion", "de-CI-sion"], 1, "-sion 前一个音节重读：deCIsion /dɪˈsɪʒn/。"),
    know("k3", "clusters", "练 texts 这类辅音丛，最有效的方法是？", ["中间加一点 /ə/ 让它好读", "从后往前加：s → ts → sts → ksts"], 1, "倒着加音能保持舌头连续移动，不插元音。"),
    hearQ("h1", "long-word-stress", "你听到的是哪个词？", "economic", ["economy", "economic"], 1, "ecoNOMic：重音在第三个音节。"),
  ],
  produce: [
    { id: "d22-p1", text: "s, ts, sts, ksts, texts", ipa: "s, ts, sts, ksts, teksts", cue: "从后往前加，中间不插元音。", skill: "clusters" },
    { id: "d22-p2", text: "months, sixth, asked, strengths", ipa: "mʌnθs, sɪksθ, ɑːskt, streŋθs", cue: "th 后的 s、ks 后的 th：舌头连续移动。", skill: "clusters" },
    { id: "d22-p3", text: "photograph, photography, photographic", ipa: "ˈfəʊtəɡrɑːf, fəˈtɒɡrəfi, ˌfəʊtəˈɡræfɪk", cue: "重音移到哪里，哪里的元音就清楚；其它弱化成 /ə/。", skill: "long-word-stress" },
    { id: "d22-p4", text: "information, decision, possibility, university", ipa: "ˌɪnfəˈmeɪʃn, dɪˈsɪʒn, ˌpɒsəˈbɪləti, ˌjuːnɪˈvɜːsəti", cue: "后缀前一个音节重读；university 的 /ɜː/ 不卷舌。", skill: "long-word-stress" },
    { id: "d22-p5", text: "technology, political, communication", ipa: "tekˈnɒlədʒi, pəˈlɪtɪkl, kəˌmjuːnɪˈkeɪʃn", cue: "-logy、-ical、-tion 前一个音节重读。", skill: "long-word-stress" },
  ],
  shadow: [
    ...BASELINE4_RECORD,
    { id: "d22-s1", text: "The next six months will be the most important.", marked: "The NEXT SIX MONTHS | will be the MOST imPORtant.", ipa: "ðə ˈneks ˈsɪks ˈmʌnθs | wɪl bi ðə ˈməʊst ɪmˈpɔːtnt", focus: "next six 的 t 省音；months 完整；most important 的 t 可省。", skill: "clusters" },
    { id: "d22-s2", text: "Communication is the most important skill at university.", marked: "commuNIcation is the MOST imPORtant SKILL | at uniVERsity.", ipa: "kəˌmjuːnɪˈkeɪʃn ɪz ðə ˈməʊst ɪmˈpɔːtnt ˈskɪl | ət ˌjuːnɪˈvɜːsəti", focus: "长单词的主重音和次重音。", skill: "long-word-stress" },
  ],
  reviewPrompts: ["你的录音里，texts、months、asked 有没有多出元音？有没有丢辅音？", "哪个长单词你之前一直读错了重音？", "第四周结束时，你最希望能用英语自然地说出哪件事？"],
  skills: ["clusters", "long-word-stress", "discourse-markers", "fall-rise", "chunking", "fluency"],
};
