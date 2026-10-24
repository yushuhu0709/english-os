import type { DayPlan, QuizItem } from "../types";

const hear = (id: string, skill: string, say: string, options: string[], explain: string): QuizItem => ({
  id: `d3-${id}`, kind: "hear", prompt: "你听到的是哪个词？", say, options, answer: options.indexOf(say), skill, explain,
});
const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d3-${id}`, kind: "know", prompt, options, answer, skill, explain,
});

export const day3: DayPlan = {
  day: 3,
  title: "双元音与弱读",
  titleEn: "Diphthongs & Weak Forms",
  outcome: "理解 8 个双元音的滑动方向，掌握 /ə/ 和常见功能词的弱读式。",
  minMinutes: 60,
  blocks: { understand: 20, perceive: 40, shadow: 20, review: 10 },
  intro: "双元音是一个音里的滑动；弱读是让英语有轻重节奏的关键。今天先练「滑得完整」，再练「弱得够弱」。",
  learn: [
    {
      id: "d3-glide",
      title: "双元音：从一个位置滑到另一个位置",
      paragraphs: [
        "SSBE 有 8 个双元音。它们是一个音节里的连续滑动，重心在第一个成分，第二个成分更轻、更短，常常不完全到位。",
        "按终点分三组：滑向 /ɪ/ 的 /eɪ aɪ ɔɪ/，滑向 /ʊ/ 的 /əʊ aʊ/，滑向 /ə/ 的 /ɪə eə ʊə/。点击图中的箭头听例词。",
      ],
      visual: "diphthongs",
      source: "《1000小时》3.1（双元音是基础元音的组合）；Cruttenden 2014",
    },
    {
      id: "d3-closing",
      title: "滑向 /ɪ/ 与 /ʊ/ 的双元音",
      paragraphs: [
        "/eɪ/（face）不能读成单元音 /e/，否则 late 会变成 let。/aɪ/（price）从大开口开始。/ɔɪ/（choice）从圆唇开始。",
        "SSBE 的 /əʊ/（goat）起点是放松的 /ə/，嘴唇再轻轻收圆，和美式 /oʊ/ 不同。这是判断英式口音最明显的线索之一。/aʊ/（mouth）从大开口滑向收圆。",
      ],
      phonemes: [
        { ipa: "eɪ", word: "late", wordIpa: "leɪt", cue: "/e/ → /ɪ/，要真的滑" },
        { ipa: "aɪ", word: "time", wordIpa: "taɪm", cue: "大开口 → /ɪ/" },
        { ipa: "ɔɪ", word: "boy", wordIpa: "bɔɪ", cue: "圆唇 → /ɪ/" },
        { ipa: "əʊ", word: "home", wordIpa: "həʊm", cue: "放松的 /ə/ → 轻微收圆" },
        { ipa: "aʊ", word: "now", wordIpa: "naʊ", cue: "大开口 → 收圆" },
      ],
    },
    {
      id: "d3-centring",
      title: "滑向 /ə/ 的双元音（以及它们在现代 SSBE 中的变化）",
      paragraphs: [
        "near /nɪə/ 从 /ɪ/ 滑向 /ə/，没有 r。square 的 /eə/ 在现代 SSBE 里多读成长单元音 [ɛː]：care 听起来像拉长的 /e/。",
        "cure 的 /ʊə/ 正在消失：sure、poor、your 在多数年轻 SSBE 说话者口中读 /ɔː/。两种读法都可以接受，本训练营的示范以 /ɔː/ 为主。",
        "关键原则：英式这组音的结尾都没有卷舌。",
      ],
      phonemes: [
        { ipa: "ɪə", word: "near", wordIpa: "nɪə", cue: "/ɪ/ → /ə/，不卷舌" },
        { ipa: "eə", word: "care", wordIpa: "keə", cue: "现代多读长 [ɛː]" },
        { ipa: "ʊə→ɔː", word: "sure", wordIpa: "ʃɔː", cue: "多读成 /ɔː/" },
      ],
      source: "Lindsey《English After RP》（SQUARE 单元音化、CURE 并入 THOUGHT）",
    },
    {
      id: "d3-schwa",
      title: "/ə/：英语最常见的元音",
      paragraphs: [
        "非重读音节的元音大多弱化成 /ə/，不管拼写是什么：about, teacher, banana, today, problem, London。",
        "发 /ə/ 不需要任何口型：下巴和舌头完全放松，嘴微开，发一个极短的声音。它越短越轻，旁边的重读音节就越突出。",
        "中文母语者最常见的问题是把每个音节都读得同样饱满。马徐骏的笔记也提醒：音节不能机械地按元音字母数。",
      ],
      phonemes: [
        { ipa: "ə", word: "about", wordIpa: "əˈbaʊt", cue: "第一个音节极短" },
        { ipa: "ə", word: "banana", wordIpa: "bəˈnɑːnə", cue: "只有中间音节重读" },
        { ipa: "ə", word: "London", wordIpa: "ˈlʌndən", cue: "-don 读 /dən/" },
      ],
      source: "马徐骏 03（音节不能机械地数元音字母）",
    },
    {
      id: "d3-weak",
      title: "功能词的弱读式",
      paragraphs: [
        "冠词、介词、连词、助动词、代词等功能词，在句子中间通常使用弱读式：",
        "强读式只在强调、对比或句末单独出现时使用：What are you looking AT? 里的 at 读 /æt/。",
        "《1000小时》给出了强读/弱读对照表并提醒它不是硬性规则；今天练最常见的十几个。",
      ],
      bullets: [
        "a /ə/ · the /ðə/ · and /ən/ · but /bət/ · or /ə/",
        "of /əv/ · to /tə/ · for /fə/ · from /frəm/ · at /ət/",
        "can /kən/ · was /wəz/ · were /wə/ · have /həv, əv/ · do /də/",
        "some /səm/ · them /ðəm/ · her /hə, ə/ · your /jə/",
      ],
      source: "《1000小时》4.5.1 弱读",
    },
  ],
  listen: [
    { id: "d3-l1", text: "late let pain pen", ipa: "leɪt let peɪn pen", note: "有滑动 vs 没有滑动。" },
    { id: "d3-l2", text: "bay buy boy", ipa: "beɪ baɪ bɔɪ" },
    { id: "d3-l3", text: "go home slowly", ipa: "ɡəʊ həʊm ˈsləʊli", note: "SSBE 的 /əʊ/ 起点偏央。" },
    { id: "d3-l4", text: "now house town", ipa: "naʊ haʊs taʊn" },
    { id: "d3-l5", text: "near care sure", ipa: "nɪə keə ʃɔː", note: "都不卷舌。" },
    { id: "d3-l6", text: "about banana London", ipa: "əˈbaʊt bəˈnɑːnə ˈlʌndən" },
    { id: "d3-l7", text: "a cup of tea", ipa: "ə ˈkʌp əv ˈtiː", note: "a 与 of 都弱读。" },
    { id: "d3-l8", text: "I can swim.", ipa: "aɪ kən ˈswɪm", note: "can 弱读为 /kən/；can't 读 /kɑːnt/。" },
  ],
  identify: [
    hear("late", "eɪ-aɪ-ɔɪ", "late", ["let", "late"], "late 有 /eɪ/ 的滑动。"),
    hear("pen", "eɪ-aɪ-ɔɪ", "pen", ["pain", "pen"], "pen 是单元音 /e/。"),
    hear("buy", "eɪ-aɪ-ɔɪ", "buy", ["bay", "buy", "boy"], "buy /baɪ/。"),
    hear("point", "eɪ-aɪ-ɔɪ", "point", ["pint", "point"], "point /pɔɪnt/：从圆唇开始。"),
    hear("coat", "əʊ-aʊ", "coat", ["coat", "caught"], "coat /kəʊt/ 有滑动；caught /kɔːt/ 是单元音。"),
    hear("known", "əʊ-aʊ", "known", ["known", "noun"], "known /nəʊn/；noun /naʊn/。"),
    hear("town", "əʊ-aʊ", "town", ["tone", "town"], "town /taʊn/：从大开口开始。"),
    hear("here", "ɪə-eə", "here", ["here", "hair"], "here /hɪə/；hair /heə/。"),
    hear("cheer", "ɪə-eə", "chair", ["cheer", "chair"], "chair /tʃeə/，现代读法接近 [tʃɛː]。"),
    {
      id: "d3-can", kind: "hear", prompt: "这句话是肯定还是否定？", say: "I can come tomorrow.", options: ["I can come", "I can't come"], answer: 0, skill: "weak-forms",
      explain: "肯定句的 can 弱读 /kən/，几乎听不到元音；can't 读完整的 /kɑːnt/，而且重读。",
    },
    {
      id: "d3-cant", kind: "hear", prompt: "这句话是肯定还是否定？", say: "I can't come tomorrow.", options: ["I can come", "I can't come"], answer: 1, skill: "weak-forms",
      explain: "can't /kɑːnt/：长元音 /ɑː/ 并且重读。英式的 can't 和 can 区别很清楚。",
    },
    know("k1", "ə", "banana 有几个音节重读？", ["1 个", "2 个", "3 个"], 0, "只有第二个音节 /ˈnɑː/ 重读，另外两个是 /ə/：/bəˈnɑːnə/。"),
    know("k2", "weak-forms", "\"a cup of tea\" 中 of 的常见读音是？", ["/ɒv/", "/əv/", "/ɔːf/"], 1, "在句中 of 弱读为 /əv/，快速时甚至只剩 /ə/。"),
    know("k3", "weak-forms", "\"What are you looking at?\" 句末的 at 读？", ["弱读 /ət/", "强读 /æt/"], 1, "介词在句末不能弱读，读强读式 /æt/。"),
    know("k4", "əʊ-aʊ", "SSBE 中 go 的元音是？", ["/oʊ/", "/əʊ/", "/ɔː/"], 1, "SSBE /əʊ/，起点是央元音；/oʊ/ 是美式。"),
    know("k5", "ɪə-eə", "现代 SSBE 中 sure 的常见读音是？", ["/ʃʊə/ 或 /ʃɔː/", "/ʃʊr/"], 0, "两种都可以，多数年轻说话者读 /ʃɔː/。没有卷舌 r。"),
    know("k6", "ə", "teacher 第二个音节的元音是？", ["/ɜː/", "/ə/", "/e/"], 1, "/ˈtiːtʃə/：非重读，弱化为 /ə/。"),
  ],
  produce: [
    { id: "d3-p1", text: "late let", ipa: "leɪt let", cue: "late 从 /e/ 滑向 /ɪ/，下巴和舌头要有移动。", skill: "eɪ-aɪ-ɔɪ" },
    { id: "d3-p2", text: "bay buy boy", ipa: "beɪ baɪ bɔɪ", cue: "三个起点不同，终点都是 /ɪ/。", skill: "eɪ-aɪ-ɔɪ" },
    { id: "d3-p3", text: "go home", ipa: "ɡəʊ həʊm", cue: "从放松的 /ə/ 开始，嘴唇再轻轻收圆。不要发成拼音 ou。", skill: "əʊ-aʊ" },
    { id: "d3-p4", text: "now house", ipa: "naʊ haʊs", cue: "大开口开始，滑向收圆。", skill: "əʊ-aʊ" },
    { id: "d3-p5", text: "near here", ipa: "nɪə hɪə", cue: "/ɪ/ 滑向 /ə/，结尾舌尖不卷。", skill: "ɪə-eə" },
    { id: "d3-p6", text: "care chair where", ipa: "keə tʃeə weə", cue: "长而稳定的 [ɛː]，不卷舌。", skill: "ɪə-eə" },
    { id: "d3-p7", text: "about banana", ipa: "əˈbaʊt bəˈnɑːnə", cue: "/ə/ 极短极轻，把力气留给重读音节。", skill: "ə" },
    { id: "d3-p8", text: "a cup of tea", ipa: "ə ˈkʌp əv ˈtiː", cue: "只重读 cup 和 tea，a、of 贴在旁边。", skill: "weak-forms" },
    { id: "d3-p9", text: "I can swim. I can't swim.", ipa: "aɪ kən ˈswɪm. aɪ ˈkɑːnt ˈswɪm", cue: "肯定 can 弱读；否定 can't 长而重读。", skill: "weak-forms" },
  ],
  shadow: [
    { id: "d3-s1", text: "They buy toys every day.", marked: "They BUY TOYS EVery DAY.", ipa: "ðeɪ ˈbaɪ ˈtɔɪz ˈevri ˈdeɪ", focus: "四个滑向 /ɪ/ 的双元音，每个都要滑完整。", skill: "eɪ-aɪ-ɔɪ" },
    { id: "d3-s2", text: "Go home now, it's getting cold.", marked: "GO HOME NOW, | it's GETting COLD.", ipa: "ˈɡəʊ ˈhəʊm ˈnaʊ | ɪts ˈɡetɪŋ ˈkəʊld", focus: "/əʊ/ 与 /aʊ/ 的区别；逗号处停顿。", skill: "əʊ-aʊ" },
    { id: "d3-s3", text: "Where is the chair? It's here.", marked: "WHERE is the CHAIR? | It's HERE.", ipa: "ˈweər ɪz ðə ˈtʃeə | ɪts ˈhɪə", focus: "where is 之间出现连接 r；chair、here 不卷舌。", skill: "ɪə-eə" },
    { id: "d3-s4", text: "A cup of tea for the teacher.", marked: "a CUP of TEA for the TEACHer.", ipa: "ə ˈkʌp əv ˈtiː fə ðə ˈtiːtʃə", focus: "a、of、for、the 全部弱读；teacher 结尾 /ə/。", skill: "weak-forms" },
    { id: "d3-s5", text: "I was going to ask for some of them.", marked: "I was GOing to ASK for SOME of them.", ipa: "aɪ wəz ˈɡəʊɪŋ tə ˈɑːsk fə ˈsʌm əv ðəm", focus: "was /wəz/、to /tə/、for /fə/、of /əv/、them /ðəm/。这里 some 是代词，重读。", skill: "weak-forms" },
    { id: "d3-s6", text: "I can come, but I can't stay.", marked: "I can COME, | but I CAN'T STAY.", ipa: "aɪ kən ˈkʌm | bət aɪ ˈkɑːnt ˈsteɪ", focus: "can 与 can't 的对比；but 弱读 /bət/。", skill: "weak-forms" },
  ],
  reviewPrompts: ["哪个双元音最容易被你读成单元音？", "读句子时有没有把功能词读得太重？", "can 和 can't 你能稳定区分吗？"],
  skills: ["eɪ-aɪ-ɔɪ", "əʊ-aʊ", "ɪə-eə", "ə", "weak-forms"],
};
