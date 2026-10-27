import type { DayPlan, QuizItem } from "../types";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d27-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d27-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

export const day27: DayPlan = {
  day: 27,
  title: "自由表达：看提示说 1 分钟",
  titleEn: "Free Speaking from Prompts",
  outcome: "用「观点 → 理由 → 例子 → 总结」的结构，看提示说满 1 分钟；用 Well、Let me think 争取时间，不中断语流。",
  minMinutes: 60,
  blocks: { understand: 10, perceive: 20, shadow: 45, review: 10 },
  intro: "这是第四周最接近真实对话的一天：没有可以跟读的原文，只有题目。说的时候一定会卡、会想不起单词，这很正常。今天要练的不是说得完美，而是：有一个结构帮你组织内容；卡住时用填充语争取时间，而不是长时间沉默或切换成中文。",
  learn: [
    {
      id: "d27-structure",
      title: "1 分钟的结构：观点 → 理由 → 例子 → 总结",
      paragraphs: [
        "观点：I think… / For me, the best… is…",
        "理由：The main reason is that… / Because…",
        "例子：For example, last week… / I remember when…",
        "总结：So, all in all, … / Anyway, that's why I…",
      ],
    },
    {
      id: "d27-fillers",
      title: "卡住时怎么办",
      paragraphs: [
        "母语者也会停下来想。用下面这些说法填住停顿，语调保持平或微升，表示「我还没说完」：",
      ],
      bullets: [
        "Well, ↗ … / Let me think… / That's a good question.",
        "How can I put it… / What's the word…",
        "I mean, … / You know, …（不要每句都用）",
        "想不起一个词时，换一种说法：It's a kind of… / It's like a…",
        "英式的 erm /ɜːm/ 比中文的「那个」更自然。",
      ],
    },
    {
      id: "d27-check",
      title: "录完怎么自评",
      paragraphs: [
        "没有示范可以对比，所以用这四个问题自评：1. 说满 1 分钟了吗？2. 有没有超过 3 秒的沉默？3. 意群停顿在意思的边界上吗？4. 过去时、复数的词尾在不在？",
        "选一个最想改进的问题，同一个题目再说一遍。第二遍几乎总会比第一遍好，这本身就是练习。",
      ],
      source: "马徐骏 04（输出练习）",
    },
  ],
  listen: [
    { id: "d27-l1", text: "Well, let me think. For me, the best place to live is a small city.", note: "填充语 + 观点。" },
    { id: "d27-l2", text: "The main reason is that everything is close, so you don't need a car.", note: "理由。" },
    { id: "d27-l3", text: "For example, when I lived in York, I walked to work every day.", note: "例子：过去时。" },
    { id: "d27-l4", text: "So, all in all, I think small cities are much easier to live in.", note: "总结。" },
    { id: "d27-l5", text: "It's a kind of sweet bread, a bit like a scone.", note: "想不起词时换一种说法。" },
  ],
  identify: [
    know("k1", "fluency", "说到一半想不起一个词，最好的做法是？", ["停下来，直到想起来", "换中文说", "换一种说法：It's a kind of…"], 2, "换一种说法让对话继续，这是自由表达最重要的技能之一。"),
    know("k2", "fluency", "Well, ↗ … 这类填充语用什么语调？", ["平或微升，表示还没说完", "重降调"], 0, "降调会让对方以为你说完了。"),
    know("k3", "fluency", "1 分钟表达的推荐结构是？", ["观点 → 理由 → 例子 → 总结", "例子 → 例子 → 例子"], 0, "结构帮你组织内容，也帮对方跟上。"),
    know("k4", "fluency", "英式英语里比较自然的「嗯……」是？", ["erm /ɜːm/", "那个"], 0, "erm 是英式最常见的填充音。"),
    hearQ("h1", "ed-endings", "说话人什么时候住在 York？", "When I lived in York, I walked to work every day.", ["以前", "现在"], 0, "lived、walked 都是过去时。"),
  ],
  produce: [
    { id: "d27-p1", text: "Well, let me think. That's a good question.", ipa: "wel ↗ | ˈlet mi ˈθɪŋk ↗. ðæts ə ˈɡʊd ˈkwestʃən ↘", cue: "Well 和 let me think 用平调或微升，表示还没说完。", skill: "fluency" },
    { id: "d27-p2", text: "The main reason is that... For example... So, all in all...", ipa: "ðə ˈmeɪn ˈriːzn ɪz ðæt… fər ɪɡˈzɑːmpl… ˈsəʊ | ɔːl ɪn ˈɔːl…", cue: "结构词说清楚；example 英式 /ɪɡˈzɑːmpl/。", skill: "discourse-markers" },
    { id: "d27-p3", text: "It's a kind of... It's a bit like...", ipa: "ɪts ə ˈkaɪnd əv… ɪts ə ˈbɪt laɪk…", cue: "kind of 连读 /ˈkaɪndəv/。", skill: "linking" },
  ],
  shadow: [
    { id: "d27-s1", text: "Well, let me think. For me, the best place to live is a small city. The main reason is that everything is close, so you don't need a car. For example, when I lived in York, I walked to work every day. So, all in all, I think small cities are much easier to live in.", focus: "先完整跟读一段示范回答，注意四部分之间的停顿。", skill: "fluency" },
    { id: "d27-s2", text: "What's the best way to spend a weekend?", focus: "自由表达 1：不看文本说 1 分钟。示范音频只是题目。观点 → 理由 → 例子 → 总结。", skill: "fluency" },
    { id: "d27-s3", text: "Describe a place you'd like to visit, and say why.", focus: "自由表达 2：说 1 分钟。用 I'd like to… because… 和一个具体的细节。", skill: "fluency" },
    { id: "d27-s4", text: "What's something you've learned recently?", focus: "自由表达 3：说 1 分钟。可以用 Day 23 的讲故事结构。", skill: "fluency" },
    { id: "d27-s5", text: "Do you think it's better to live in a city or in the countryside?", focus: "自由表达 4：说 1 分钟。试着用一次 It depends… 和一次降升调的 but。", skill: "fluency" },
  ],
  reviewPrompts: ["四个题目里，哪一个说得最顺？哪一个卡得最多？", "你卡住时用了填充语，还是沉默或切换成中文？", "挑最卡的那个题目，明天再说一遍。"],
  skills: ["fluency", "discourse-markers", "chunking"],
};
