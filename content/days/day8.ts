import type { DayPlan, QuizItem } from "../types";
import { BASELINE2_QUIZ, BASELINE2_RECORD } from "../baseline2";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d8-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d8-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

export const day8: DayPlan = {
  day: 8,
  title: "第二周基线：弱读与强读",
  titleEn: "Week 2 Baseline · Weak & Strong Forms",
  outcome: "做第二周的语流基线测试，系统掌握功能词的弱读式、强读式和缩略式。",
  minMinutes: 60,
  blocks: { understand: 15, perceive: 35, shadow: 30, review: 10 },
  intro: "第一周练的是单个的音。第二周练的是这些音连起来之后发生的变化：弱读、连读、省音、节奏和语调。今天先做一次基线测试（Day 14 会用同一套材料复测），再把 Day 3 学过的弱读系统地补全。",
  learn: [
    {
      id: "d8-week2",
      title: "第二周练什么",
      paragraphs: [
        "很多人单个词发得很准，一说句子就变得生硬，或者听不懂母语者正常语速的话。原因通常不在单个的音，而在语流：功能词没有弱读、词与词之间断开、重音和语调不对。",
        "第二周每天一个主题：Day 8 弱读与强读，Day 9 连读与滑音，Day 10 省音、同化与英式喉塞，Day 11 节奏、复合词与重音转移，Day 12 语调，Day 13 长段落跟读，Day 14 复测并生成第二周报告。",
        "第一周的弱项不会丢下：它们会每天出现在「每日复习」里（导航栏 Daily Review），按间隔自动安排。",
      ],
    },
    {
      id: "d8-baseline",
      title: "基线测试怎么做",
      paragraphs: [
        "辨音题里标着「基线」的 18 道题和跟读里标着「可比录音」的 6 段，会在 Day 14 原样再做一次。请按你现在自然的状态做，不要先反复练。",
        "和第一周一样：辨音题只有第一次作答计入报告；录音尽量在同一个房间、同一个麦克风、同样的距离完成。",
        "合成语音会根据标点读出升降调（句号降、问号升），但不能可靠地读出对比重音和喉塞，所以这两项用知识题来测。",
      ],
    },
    {
      id: "d8-weak",
      title: "常用功能词的弱读式",
      paragraphs: [
        "SSBE 中大约 40 个功能词有弱读式。它们在句子里出现得极多，弱读后元音几乎都变成 /ə/，有时整个元音消失。",
        "听力上的意义更大：如果你只认识强读式，就会听不出 to、for、of、have 这些词，觉得母语者「吞音」。",
      ],
      phonemes: [
        { ipa: "tə", word: "to school", wordIpa: "tə ˈskuːl", cue: "to → /tə/（元音前 /tʊ/）" },
        { ipa: "fə", word: "for you", wordIpa: "fə ˈjuː", cue: "for → /fə/" },
        { ipa: "əv", word: "a cup of tea", wordIpa: "ə ˈkʌp əv ˈtiː", cue: "of → /əv/" },
        { ipa: "ən", word: "fish and chips", wordIpa: "ˈfɪʃ ən ˈtʃɪps", cue: "and → /ən/ 或 /n/" },
        { ipa: "kən", word: "I can swim", wordIpa: "aɪ kən ˈswɪm", cue: "can → /kən/" },
        { ipa: "wəz", word: "it was late", wordIpa: "ɪt wəz ˈleɪt", cue: "was → /wəz/" },
        { ipa: "əv", word: "should have", wordIpa: "ˈʃʊd əv", cue: "have → /əv/" },
        { ipa: "ðəm", word: "tell them", wordIpa: "ˈtel ðəm", cue: "them → /ðəm/" },
        { ipa: "frəm", word: "from London", wordIpa: "frəm ˈlʌndən", cue: "from → /frəm/" },
        { ipa: "ðən", word: "better than", wordIpa: "ˈbetə ðən", cue: "than → /ðən/" },
      ],
      source: "《1000小时》3.6 弱读；Cruttenden《Gimson's Pronunciation of English》弱读式表",
    },
    {
      id: "d8-strong",
      title: "什么时候必须用强读式",
      paragraphs: [
        "① 在句末或意群末尾：Where are you FROM? /frɒm/，Who's it FOR? /fɔː/，What are you looking AT? /æt/。",
        "② 被强调或对比：It's FOR you, not FROM you。I CAN do it（反驳对方说你不能）。",
        "③ 简短回答：Yes, I CAN /kæn/。Yes, it WAS /wɒz/。",
        "④ 否定缩略永远是强读：can't /kɑːnt/、wasn't /ˈwɒznt/、don't /dəʊnt/。所以 I can come 和 I can't come 的区别主要在元音：/kən/ 短而轻，/kɑːnt/ 长而重，词尾的 t 常常听不见。",
      ],
      bullets: ["I can come. /aɪ kən ˈkʌm/", "I can't come. /aɪ ˈkɑːnt ˈkʌm/", "Yes, I can. /ˈjes aɪ ˈkæn/"],
      source: "马徐骏 03（can / can't 的区分在元音而不在 t）",
    },
    {
      id: "d8-contract",
      title: "缩略式：I'll, I'd, won't",
      paragraphs: [
        "口语里助动词和 not 基本都会缩略。漏读缩略式最常见的后果是时态和意思变了：I'll call you（会打）说成 I call you（经常打）。",
        "I'll /aɪl/ 的结尾是暗 l：舌尖贴住齿龈，舌后部抬起。I'd /aɪd/ 的 d 在辅音前常不爆破。",
        "won't /wəʊnt/ 和 want /wɒnt/ 的区别全在元音：won't 是双元音，起点偏央；want 是短而圆的 /ɒ/。",
      ],
      phonemes: [
        { ipa: "aɪl", word: "I'll", wordIpa: "aɪl", cue: "暗 l 要发出来" },
        { ipa: "aɪd", word: "I'd", wordIpa: "aɪd", cue: "I would / I had" },
        { ipa: "wəʊnt", word: "won't", wordIpa: "wəʊnt", cue: "双元音 /əʊ/" },
        { ipa: "wɒnt", word: "want", wordIpa: "wɒnt", cue: "短元音 /ɒ/" },
        { ipa: "kɑːnt", word: "can't", wordIpa: "kɑːnt", cue: "SSBE 用 /ɑː/" },
      ],
    },
  ],
  listen: [
    { id: "d8-l1", text: "a cup of tea. fish and chips. from London to Leeds.", note: "of、and、from、to 全部弱读。" },
    { id: "d8-l2", text: "I was going to ask for some of them.", note: "九个词里 was、to、for、of、them 五个弱读；some 在这里是代词，读强读式 /sʌm/。" },
    { id: "d8-l3", text: "Where are you from? Who's it for?", note: "句末的 from、for 用强读式。" },
    { id: "d8-l4", text: "I can come. I can't come.", note: "听元音：/kən/ 与 /kɑːnt/。" },
    { id: "d8-l5", text: "Yes, I can. Yes, it was.", note: "简短回答用强读式。" },
    { id: "d8-l6", text: "I'll call you. I'd call you. I call you.", note: "三句只差一个缩略式。" },
    { id: "d8-l7", text: "I won't go. I want to go.", note: "/əʊ/ 与 /ɒ/。" },
    { id: "d8-l8", text: "You should have told them.", note: "should have → /ˈʃʊd əv/，them → /ðəm/。" },
  ],
  identify: [
    ...BASELINE2_QUIZ,
    hearQ("from", "strong-forms", "这里的 from 是弱读还是强读？", "Where are you from?", ["弱读 /frəm/", "强读 /frɒm/"], 1, "句末的 from 用强读式 /frɒm/。"),
    hearQ("have", "weak-forms", "你听到的是哪一句？", "You should have told them.", ["You should tell them.", "You should have told them."], 1, "should have 弱读成 /ˈʃʊd əv/，have 只剩一个 /əv/。"),
    know("k1", "weak-forms", "fish and chips 中的 and 最自然的读法是？", ["/ænd/", "/ən/ 或 /n/"], 1, "and 在句中弱读为 /ən/，在 /ʃ/ 后甚至只剩 /n/。"),
    know("k2", "strong-forms", "哪一句里的 for 应该用强读式 /fɔː/？", ["This is for you.", "Who's it for?", "I waited for an hour."], 1, "for 在句末用强读式；另外两句中的 for 都弱读为 /fə/（for an 还会出现连接 r）。"),
    know("k3", "strong-forms", "反驳对方「你不会游泳」时，I can swim 里的 can 怎么读？", ["弱读 /kən/", "强读 /kæn/，而且重读"], 1, "对比和反驳时功能词重读并用强读式。"),
    know("k4", "contractions", "SSBE 中 can't 的元音是？", ["/æ/，和 cat 一样", "/ɑː/，和 car 一样"], 1, "SSBE 的 can't 是 /kɑːnt/；/kænt/ 是美式读法。"),
  ],
  produce: [
    { id: "d8-p1", text: "a cup of tea, fish and chips, from London to Leeds", ipa: "ə ˈkʌp əv ˈtiː, ˈfɪʃ ən ˈtʃɪps, frəm ˈlʌndən tə ˈliːdz", cue: "实词读清楚，功能词压低、缩短、换成 /ə/，紧贴在前后的词上。", skill: "weak-forms" },
    { id: "d8-p2", text: "I was going to ask for some of them.", ipa: "aɪ wəz ˈɡəʊɪŋ tʊ ˈɑːsk fə ˈsʌm əv ðəm", cue: "先只说重读的词：going… ask… some。再把功能词轻轻塞进去，节奏不变。这里的 some 是代词，用强读 /sʌm/；Would you like some tea? 里的 some 才弱读 /səm/。", skill: "weak-forms" },
    { id: "d8-p3", text: "Where are you from? Who's it for? What are you looking at?", ipa: "ˈweər ə ju ˈfrɒm, ˈhuːz ɪt ˈfɔː, ˈwɒt ə ju ˈlʊkɪŋ æt", cue: "句末的功能词元音读饱满。注意 where are 的连接 r。", skill: "strong-forms" },
    { id: "d8-p4", text: "I can come. I can't come. Yes, I can.", ipa: "aɪ kən ˈkʌm. aɪ ˈkɑːnt ˈkʌm. ˈjes aɪ ˈkæn", cue: "第一句 can 几乎听不见；第二句 can't 长而重；第三句 can 强读 /kæn/。", skill: "strong-forms" },
    { id: "d8-p5", text: "I'll call you. I'd like that. I won't forget.", ipa: "aɪl ˈkɔːl ju. aɪd ˈlaɪk ðæt. aɪ ˈwəʊnt fəˈɡet", cue: "I'll 的暗 l 舌尖贴住齿龈再接 call；won't 是双元音 /əʊ/。", skill: "contractions" },
    { id: "d8-p6", text: "You should have told them. I could have done it.", ipa: "ju ˈʃʊd əv ˈtəʊld ðəm. aɪ ˈkʊd əv ˈdʌn ɪt", cue: "should have / could have → /ʃʊd əv/、/kʊd əv/，不读 /hæv/。", skill: "weak-forms" },
  ],
  shadow: [
    ...BASELINE2_RECORD,
    { id: "d8-s1", text: "I was going to ask for some of them, but I didn't.", marked: "I was GOing to ASK for SOME of them, | but I DIDn't.", ipa: "aɪ wəz ˈɡəʊɪŋ tʊ ˈɑːsk fə ˈsʌm əv ðəm | bət aɪ ˈdɪdnt", focus: "弱读的节奏：重音之间的功能词被压缩。didn't 在句末，读完整。", skill: "weak-forms" },
    { id: "d8-s2", text: "Where are you from? I'm from Leeds, but I live in London.", marked: "Where are you FROM? | I'm from LEEDS, | but I LIVE in LONdon.", ipa: "ˈweər ə ju ˈfrɒm | aɪm frəm ˈliːdz | bət aɪ ˈlɪv ɪn ˈlʌndən", focus: "同一个 from：问句句末强读 /frɒm/，回答里弱读 /frəm/。", skill: "strong-forms" },
  ],
  reviewPrompts: ["基线录音里，你的功能词是不是读得和实词一样重？", "can 和 can't 在你自己的录音里听得出区别吗？", "哪个缩略式最容易漏掉？"],
  skills: ["weak-forms", "strong-forms", "contractions"],
};
