import type { DayPlan, QuizItem } from "../types";
import { STORY } from "../baseline4";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d23-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d23-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

export const day23: DayPlan = {
  day: 23,
  title: "讲故事：过去时、连接词与节奏",
  titleEn: "Telling a Story",
  outcome: "用 At first / Then / But actually / Anyway 组织一段经历；过去时词尾清楚；每个意群一个重点，最后落在降调上。",
  minMinutes: 60,
  blocks: { understand: 15, perceive: 25, shadow: 35, review: 10 },
  intro: "讲一件发生过的事，是日常聊天里最常见的「长段表达」：周末做了什么、旅行遇到了什么、工作上发生了什么。听起来自然的关键有三点：过去时词尾不丢；用连接词把事情串起来；每个连接词后面稍停，让对方跟上。今天先跟读一段短故事，再用同样的结构讲你自己的经历。",
  learn: [
    {
      id: "d23-markers",
      title: "故事里的连接词",
      paragraphs: [
        "连接词告诉听的人故事走到了哪里。它们通常自成一个意群，后面稍停：",
      ],
      bullets: [
        "开头：Last month… / A couple of years ago… / When I was at university…",
        "顺序：At first… ↘ | Then… | After that… | In the end…",
        "转折：But actually, ↘↗ … / The thing is, ↘↗ …",
        "回到主线或收尾：Anyway, ↘ … / So, ↘ …",
      ],
    },
    {
      id: "d23-rhythm",
      title: "讲故事的节奏",
      paragraphs: [
        "每个意群只有一个最重的词（核心重音），通常是新信息：Last month I started a new JOB in MANchester. 意群结尾用降调表示这一段讲完了；还没讲完时，可以用平调或轻微上扬。",
        "功能词照样弱读：was /wəz/、to /tə/、a /ə/、of /əv/。讲故事时语速比跟读慢一点没关系，但不要每个词都一样重。",
        "过去时的 -ed 是故事里最容易丢的音。started /ɪd/、moved /d/、worked /t/：Day 19 的规则在这里全部用得上。",
      ],
      source: "马徐骏 04（复述与输出）",
    },
    {
      id: "d23-story",
      title: "今天的故事",
      paragraphs: STORY,
      bullets: ["Anyway, now I've got some good friends there, and I love my job."],
    },
    {
      id: "d23-yours",
      title: "讲你自己的故事",
      paragraphs: [
        "用这个结构：开头（时间、地点、发生了什么）→ At first（一开始怎样）→ But actually（后来有什么变化）→ Anyway（现在怎样）。",
        "四句话就够了。先在纸上写下关键词，不要写完整的句子，然后对着录音说。",
      ],
    },
  ],
  listen: [
    { id: "d23-l1", text: STORY[0], note: "开头：时间 + 事件。" },
    { id: "d23-l2", text: STORY[1], note: "At first：一开始。" },
    { id: "d23-l3", text: STORY[2], note: "But actually：转折。" },
    { id: "d23-l4", text: "Anyway, now I've got some good friends there, and I love my job.", note: "Anyway：收尾。" },
    { id: "d23-l5", text: "A couple of years ago, I moved to a new flat.", note: "couple of 连读 /ˈkʌpləv/。" },
    { id: "d23-l6", text: "Then, after that, we decided to go home.", note: "decided /ɪd/。" },
  ],
  identify: [
    know("k1", "discourse-markers", "讲故事时，At first、Then、Anyway 这类词后面通常？", ["直接接下去，不停", "稍停一下，自成一个意群"], 1, "连接词告诉听的人故事走到了哪里，后面稍停让对方跟上。"),
    know("k2", "discourse-markers", "「But actually, …」在故事里通常表示？", ["接下来有变化或出乎意料的事", "故事结束了"], 0, "actually 带出和前面不同的情况。"),
    know("k3", "ed-endings", "started、moved、worked 结尾的 -ed 依次读？", ["/ɪd/ /d/ /t/", "/t/ /d/ /ɪd/", "都读 /ɪd/"], 0, "t 后 /ɪd/、浊音后 /d/、清音后 /t/。"),
    know("k4", "tonic", "「Last month I started a new job in Manchester.」核心重音最可能在？", ["month", "started", "Manchester"], 2, "意群最后一个新信息：MANchester。"),
    hearQ("h1", "ed-endings", "你听到的是？", "I moved to a new flat.", ["I move to a new flat.", "I moved to a new flat."], 1, "moved /muːvd/ 的 /d/ 和 to 的 /t/ 相连。"),
    hearQ("h2", "weak-forms", "这句话一共有几个词？", "At first it was a bit difficult.", ["6 个", "7 个", "8 个"], 1, "At first it was a bit difficult. 7 个词：was 和 a 都弱读。"),
    hearQ("h3", "discourse-markers", "说话人在做什么？", "Anyway, now I've got some good friends there.", ["回到主线、准备收尾", "开始讲一个新故事"], 0, "Anyway 用来回到主线或收尾。"),
  ],
  produce: [
    { id: "d23-p1", text: "Last month, A couple of years ago, When I was at university", ipa: "ˈlɑːst ˈmʌnθ, ə ˈkʌpl əv ˈjɪəz əˈɡəʊ, wen aɪ wəz ət ˌjuːnɪˈvɜːsəti", cue: "三种开头；couple of 连读；was、at 弱读。", skill: "discourse-markers" },
    { id: "d23-p2", text: "At first, Then, After that, In the end", ipa: "ət ˈfɜːst, ˈðen, ˈɑːftə ˈðæt, ɪn ði ˈend", cue: "每个连接词后面稍停；the 在元音前读 /ði/。", skill: "discourse-markers" },
    { id: "d23-p3", text: "But actually, The thing is, Anyway", ipa: "bət ˈæktʃuəli ↘↗, ðə ˈθɪŋ ɪz ↘↗, ˈeniweɪ ↘", cue: "转折用降升调，收尾用降调。", skill: "fall-rise" },
    { id: "d23-p4", text: "I started, I moved, I worked, I decided", ipa: "aɪ ˈstɑːtɪd, aɪ ˈmuːvd, aɪ ˈwɜːkt, aɪ dɪˈsaɪdɪd", cue: "过去时词尾：/ɪd/ /d/ /t/ /ɪd/。", skill: "ed-endings" },
  ],
  shadow: [
    { id: "d23-s1", text: STORY[0], marked: "LAST month | I STARted a NEW JOB in MANchester. ↘", ipa: "ˈlɑːst mʌnθ | aɪ ˈstɑːtɪd ə ˈnjuː ˈdʒɒb ɪn ˈmæntʃɪstə ↘", focus: "开头一句：时间单独一个意群。", skill: "ed-endings" },
    { id: "d23-s2", text: STORY[1], marked: "At FIRST | it was a bit DIFficult, | because I didn't KNOW ANyone. ↘", ipa: "ət ˈfɜːst | ɪt wəz ə bɪt ˈdɪfɪkəlt | bɪˈkɒz aɪ ˈdɪdnt ˈnəʊ ˈeniwʌn ↘", focus: "三个意群；because 英式 /bɪˈkɒz/。", skill: "chunking" },
    { id: "d23-s3", text: STORY[2], marked: "But ACtually, ↘↗ | after a COUPle of WEEKS, | I REALly STARted to enJOY it. ↘", ipa: "bət ˈæktʃuəli ↘↗ | ˈɑːftər ə ˈkʌpl əv ˈwiːks | aɪ ˈrɪəli ˈstɑːtɪd tʊ ɪnˈdʒɔɪ ɪt ↘", focus: "转折的降升调；after a 连接 r。", skill: "discourse-markers" },
    { id: "d23-s4", text: "Anyway, now I've got some good friends there, and I love my job.", marked: "ANyway, ↘ | NOW I've got some GOOD FRIENDS there, | and I LOVE my JOB. ↘", ipa: "ˈeniweɪ ↘ | ˈnaʊ aɪv ɡɒt səm ˈɡʊd ˈfrendz ðeə | ən aɪ ˈlʌv maɪ ˈdʒɒb ↘", focus: "收尾：friends 的 /ndz/；最后降调表示讲完。", skill: "discourse-markers" },
    { id: "d23-s5", text: "Last month I started a new job in Manchester. At first it was a bit difficult, because I didn't know anyone. But actually, after a couple of weeks, I really started to enjoy it. Anyway, now I've got some good friends there, and I love my job.", focus: "整段连起来：每个连接词后面稍停，结尾降调。", skill: "fluency" },
    { id: "d23-s6", text: "Tell me about something that happened to you: a trip, a new job, or a new place.", focus: "不看文本，用 Last… / At first… / But actually… / Anyway… 讲你自己的一件事，四句话。示范音频只是题目。录完听一遍：过去时词尾在不在？连接词后有没有停？", skill: "fluency" },
  ],
  reviewPrompts: ["你自己的故事录音里，过去时词尾有没有丢？", "连接词后面有没有停一下？听起来像在讲事情，还是在背句子？", "再换一件事，用同样的结构讲一次。"],
  skills: ["discourse-markers", "ed-endings", "chunking", "fluency"],
};
