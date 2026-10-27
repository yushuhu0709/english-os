import type { DayPlan, QuizItem } from "../types";
import { BASELINE3_QUIZ, BASELINE3_RECORD } from "../baseline3";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d15-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d15-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

export const day15: DayPlan = {
  day: 15,
  title: "第三周基线：问候、寒暄与回应",
  titleEn: "Week 3 Baseline · Greetings & Responses",
  outcome: "做第三周的对话基线测试；用自然的语调问候、寒暄，并用回问让对话继续下去。",
  minMinutes: 60,
  blocks: { understand: 15, perceive: 30, shadow: 30, review: 10 },
  intro: "前两周练的是声音本身：单个的音和语流。第三周把它们放进真实的对话里：问候、提问、请求、报数字和拼写、讲发生过的事。今天先做基线测试（Day 21 会用同一套材料复测），再练对话里最常用、也最容易显得生硬的部分：寒暄和回应。",
  learn: [
    {
      id: "d15-week3",
      title: "第三周练什么",
      paragraphs: [
        "很多人能把一段课文读得很好，但一开口聊天就只会说 Yes、OK、Really，语调平平，对方很难接话。第三周的目标是：在最常见的日常场景里，说出来的话既准确又自然。",
        "Day 15 寒暄与回应，Day 16 问句的语调，Day 17 礼貌与委婉，Day 18 字母、数字、日期和时间，Day 19 -ed 和 -s 词尾，Day 20 情景对话跟读，Day 21 复测并生成第三周报告。",
        "前两周的弱项继续每天出现在「每日复习」里。",
      ],
    },
    {
      id: "d15-baseline",
      title: "基线测试怎么做",
      paragraphs: [
        "辨音题里标着「基线」的 18 道题和跟读里标着「可比录音」的 6 段，会在 Day 21 原样再做一次。按你现在自然的状态做，不要先反复练。",
        "辨音题只有第一次作答计入报告；录音尽量在同一个房间、同一个麦克风、同样的距离完成。",
      ],
    },
    {
      id: "d15-greet",
      title: "问候和寒暄：重音落在哪里",
      paragraphs: [
        "How are you? 在英式英语里多是打招呼，不是真的在问健康。重音通常落在 ARE 或 YOU 上：How ARE you? / How are YOU?（后者常用在对方先问了你之后）。",
        "标准回答很短：Fine, thanks. / Not bad, thanks. / Good, thanks. 然后把问题抛回去：And you? 重音在 YOU，并且升调。",
        "其它常见说法：How's it going? / How are things? / Alright?（英式口语，回答 Yeah, alright, thanks）。",
      ],
      bullets: ["How are you? — Fine, thanks. And YOU? ↗", "How's it going? — Not bad, thanks.", "Nice to meet you. — Nice to meet YOU, too."],
    },
    {
      id: "d15-echo",
      title: "回问：让对话继续下去",
      paragraphs: [
        "对方告诉你一件事时，英式英语常用「助动词 + 代词」的回问来表示在听、感兴趣：I've been to Japan. — Oh, have you? ↗ / She works in a bank. — Does she? ↗ / We moved last year. — Did you? ↗",
        "回问的助动词要和对方的句子对应：have 对 have，does 对一般现在时，did 对过去时。助动词用强读式（/hæv/、/dʌz/、/dɪd/），在助动词上升调。",
        "降调的回问（Oh, did you. ↘）意思是「哦，知道了」，常常让话题停下。想让对方继续说，就用升调，后面再接一个问题：Oh, did you? ↗ Where did you go? ↘",
      ],
      bullets: ["I've just got back from Spain. — Oh, have you? ↗", "He's a teacher. — Is he? ↗", "I didn't sleep well. — Didn't you? ↗ Why not?"],
      source: "马徐骏 03（语调表达态度）",
    },
    {
      id: "d15-really",
      title: "Really、Right、Oh 的三种语调",
      paragraphs: [
        "同一个词，语调不同，意思完全不同：",
      ],
      bullets: [
        "Really? ↗：真的吗？感兴趣、有点惊讶。",
        "Really. ↘：哦。知道了（甚至有点不耐烦）。",
        "Really? ↘↗（先降后升）：我有点怀疑。",
        "Right. ↘：好的，明白了。Right? ↗：对吧？",
      ],
    },
  ],
  listen: [
    { id: "d15-l1", text: "How are you? Fine, thanks. And you?", note: "And YOU：重音在 you，升调。" },
    { id: "d15-l2", text: "Nice to meet you. Nice to meet you, too.", note: "回答时重音移到 YOU。" },
    { id: "d15-l3", text: "I've just got back from Spain. Oh, have you?", note: "回问升调。" },
    { id: "d15-l4", text: "She works in a bank. Does she?", note: "does 对一般现在时。" },
    { id: "d15-l5", text: "We moved last year. Did you? Where to?", note: "did 对过去时，再追问。" },
    { id: "d15-l6", text: "Oh, really?", note: "升调：感兴趣。" },
    { id: "d15-l7", text: "Oh, really.", note: "降调：知道了。" },
  ],
  identify: [
    ...BASELINE3_QUIZ,
    know("k1", "responses", "对方说「She works in a bank.」，正确的回问是？", ["Is she?", "Does she?", "Did she?"], 1, "works 是一般现在时，回问用 does。"),
    know("k2", "responses", "对方说「I didn't sleep well.」，正确的回问是？", ["Didn't you?", "Did you?", "Don't you?"], 0, "否定句的回问也用否定：Didn't you? ↗"),
    know("k3", "responses", "想让对方继续讲下去，回问后面最好？", ["什么都不说", "再接一个问题，比如 Where did you go?"], 1, "回问 + 追问是让对话继续的最简单方法。"),
    hearQ("h1", "responses", "说话人对这件事？", "Did you?", ["感兴趣 ↗", "没兴趣 ↘"], 0, "问号：升调。"),
  ],
  produce: [
    { id: "d15-p1", text: "Fine, thanks. And you?", ipa: "ˈfaɪn θæŋks ↘ | ənd ˈjuː ↗", cue: "thanks 的 th 舌尖轻碰上齿；and 弱读 /ənd/，you 重读并升调。", skill: "responses" },
    { id: "d15-p2", text: "Nice to meet you. Nice to meet you, too.", ipa: "ˈnaɪs tə ˈmiːt ju ↘. ˈnaɪs tə miːt ˈjuː ˈtuː ↘", cue: "第一句重音在 MEET，回答时重音移到 YOU。meet you 可同化为 /miːtʃu/。", skill: "tonic" },
    { id: "d15-p3", text: "Oh, have you? Does she? Did you?", ipa: "əʊ ˈhæv ju ↗. ˈdʌz ʃi ↗. ˈdɪd ju ↗", cue: "助动词用强读式，在助动词上起调往上走。", skill: "responses" },
    { id: "d15-p4", text: "Oh, really? Oh, really.", ipa: "əʊ ˈrɪəli ↗. əʊ ˈrɪəli ↘", cue: "really 英式读 /ˈrɪəli/，开头是双元音 /ɪə/。分别用升调和降调各说三遍。", skill: "responses" },
    { id: "d15-p5", text: "How's it going? Not bad, thanks.", ipa: "ˈhaʊz ɪt ˈɡəʊɪŋ ↘. ˌnɒt ˈbæd θæŋks ↘", cue: "how's it 连读 /haʊzɪt/；not bad 的 t 可用喉塞 [ʔ]。", skill: "linking" },
  ],
  shadow: [
    ...BASELINE3_RECORD,
    { id: "d15-s1", text: "I've just got back from Spain. Oh, have you? Where did you go?", marked: "I've just got BACK from SPAIN. ↘ | Oh, HAVE you? ↗ | WHERE did you GO? ↘", ipa: "aɪv dʒəst ɡɒt ˈbæk frəm ˈspeɪn ↘ | əʊ ˈhæv ju ↗ | ˈweə dɪdʒu ˈɡəʊ ↘", focus: "回问升调，追问的 wh- 问句降调。", skill: "responses" },
    { id: "d15-s2", text: "How's it going? Not bad, thanks. How about you?", marked: "How's it GOing? ↘ | Not BAD, thanks. ↘ | How aBOUT YOU? ↗", ipa: "ˈhaʊz ɪt ˈɡəʊɪŋ ↘ | ˌnɒt ˈbæd θæŋks ↘ | haʊ əˈbaʊt ˈjuː ↗", focus: "寒暄要短、轻快；How about YOU 把问题抛回去。", skill: "responses" },
  ],
  reviewPrompts: ["录音里的 And you? 重音在 you 上吗？听起来像真的在问吗？", "回问 Have you? / Did you? 用的是升调吗？", "日常聊天时，你最常用哪几句回应？今天学的哪一句最想用上？"],
  skills: ["responses", "wh-questions", "polite-requests", "letters-numbers", "ed-endings", "s-endings"],
};
