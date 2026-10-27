import type { DayPlan, QuizItem, ShadowItem } from "../types";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d20-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d20-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

// Three short dialogues, shadowed line by line. A = the other person, B = you.
const line = (id: string, text: string, marked: string, ipa: string, focus: string, skill: string): ShadowItem => ({
  id: `d20-${id}`, text, marked, ipa, focus, skill,
});

export const day20: DayPlan = {
  day: 20,
  title: "情景对话跟读：咖啡店、问路、餐厅",
  titleEn: "Dialogues · Café, Directions, Restaurant",
  outcome: "把第三周的问候、问句、请求、数字和词尾放进三段完整的日常对话里，跟读时扮演 B 的角色。",
  minMinutes: 60,
  blocks: { understand: 10, perceive: 25, shadow: 40, review: 10 },
  intro: "今天没有新规则，只练三段完整的对话：在咖啡店点单、在街上问路、在餐厅订位和结账。每段先听一遍 A 和 B，再逐句跟读 B 的台词，最后把 B 的台词连起来录一遍。跟读时先注意三件事：B 的回应语调、请求句的升调，还有数字和词尾。",
  learn: [
    {
      id: "d20-how",
      title: "对话跟读怎么做",
      paragraphs: [
        "第一遍：只听，不看文字，听懂大意。第二遍：看着带标记的文字听，注意大写的重音和 ↗ ↘。",
        "第三遍：逐句跟读。每句播放后马上说，尽量贴着示范的节奏，不要一个词一个词地读。",
        "第四遍：只录 B 的台词，想象 A 就在对面。录完和示范对比，挑出一句最不像的，再练三遍。",
      ],
      source: "马徐骏 04（影子跟读）",
    },
    {
      id: "d20-cafe",
      title: "对话一：咖啡店",
      paragraphs: [
        "A: Hi there, what can I get you?",
        "B: Could I have a flat white, please?",
        "A: Sure. Anything else?",
        "B: Yes, I'll have one of those croissants, too.",
        "A: Is that to have here or to take away?",
        "B: To take away, please.",
        "A: That's five pounds forty.",
        "B: Can I pay by card? Lovely, thanks.",
      ],
    },
    {
      id: "d20-directions",
      title: "对话二：问路",
      paragraphs: [
        "B: Excuse me, sorry to bother you. Could you tell me how to get to the station?",
        "A: Yes, of course. Go straight on, then take the second left.",
        "B: Second left, OK.",
        "A: It's about five minutes' walk. You can't miss it.",
        "B: Brilliant. Thanks very much.",
      ],
    },
    {
      id: "d20-restaurant",
      title: "对话三：餐厅",
      paragraphs: [
        "B: Hi, I booked a table for two at half past seven. The name's Lee: L, double E.",
        "A: Ah yes, come this way. Are you ready to order?",
        "B: I think so. I'd like the fish, please, and could we have some tap water?",
        "A: Of course.",
        "B: Excuse me, could we have the bill, please?",
      ],
    },
  ],
  listen: [
    { id: "d20-l1", text: "Hi there, what can I get you?", note: "店员开场：wh- 问句。" },
    { id: "d20-l2", text: "Is that to have here or to take away?", note: "选择疑问句：前升后降。" },
    { id: "d20-l3", text: "That's five pounds forty.", note: "价格。" },
    { id: "d20-l4", text: "Go straight on, then take the second left.", note: "问路的回答。" },
    { id: "d20-l5", text: "It's about five minutes' walk. You can't miss it.", note: "can't /kɑːnt/。" },
    { id: "d20-l6", text: "Ah yes, come this way. Are you ready to order?", note: "一般疑问句升调。" },
  ],
  identify: [
    know("k1", "polite-requests", "咖啡店点单，最自然的说法是？", ["I want a flat white.", "Could I have a flat white, please?", "Give me a flat white."], 1, "Could I have…, please? 是英式点单最常用的句型。"),
    know("k2", "responses", "店员问「To have here or to take away?」，你想带走，说？", ["Take away, please.", "Here.", "Yes."], 0, "这是选择疑问句，要选一个回答，不能说 Yes。"),
    know("k3", "letters-numbers", "£5.40 最常见的说法是？", ["five pounds forty", "five point four pounds", "five forty pounds"], 0, "英式：five pounds forty，口语也说 five forty。"),
    know("k4", "polite-requests", "在餐厅想结账，说？", ["Could we have the bill, please?", "Give me the check."], 0, "英式说 the bill；the check 是美式。"),
    hearQ("h1", "letters-numbers", "你听到的价格是？", "That's five pounds forty.", ["£5.14", "£5.40", "£4.50"], 1, "five pounds forty = £5.40。"),
    hearQ("h2", "wh-questions", "店员问的是？", "Is that to have here or to take away?", ["在这里吃还是带走", "要不要加糖"], 0, "have here = 堂食，take away = 外带。"),
    hearQ("h3", "letters-numbers", "订位时间是？", "I booked a table for two at half past seven.", ["7:00", "7:30", "6:30"], 1, "half past seven = 7:30。"),
    hearQ("h4", "polite-requests", "路人让你怎么走？", "Go straight on, then take the second left.", ["直走，第二个路口左转", "左转，然后直走"], 0, "second left = 第二个路口左转。"),
  ],
  produce: [
    { id: "d20-p1", text: "Could I have a flat white, please?", ipa: "kʊd aɪ ˈhæv ə ˌflæt ˈwaɪt pliːz ↗", cue: "could I 连读 /kʊdaɪ/；flat white 的第一个 t 可用喉塞。", skill: "polite-requests" },
    { id: "d20-p2", text: "To take away, please. Can I pay by card?", ipa: "tə ˈteɪk əˈweɪ pliːz ↘. kən aɪ ˈpeɪ baɪ ˈkɑːd ↗", cue: "take away 连读；card 英式 /kɑːd/ 不卷舌。", skill: "linking" },
    { id: "d20-p3", text: "Excuse me, sorry to bother you.", ipa: "ɪkˈskjuːz mi | ˈsɒri tə ˈbɒðə ju", cue: "bother 的 /ɒ/ 和 /ð/；结尾 /ə/ 不卷舌。", skill: "ð-z-d" },
    { id: "d20-p4", text: "Brilliant. Thanks very much.", ipa: "ˈbrɪliənt ↘. ˈθæŋks ˈveri ˈmʌtʃ ↘", cue: "英式常用 brilliant 表示感谢；very 的 v 上齿碰下唇。", skill: "v-w" },
    { id: "d20-p5", text: "I'd like the fish, please, and could we have some tap water?", ipa: "aɪd ˈlaɪk ðə ˈfɪʃ pliːz | ən kʊd wi hæv səm ˌtæp ˈwɔːtə ↗", cue: "some 弱读 /səm/；water 英式 /ˈwɔːtə/，t 清楚。", skill: "polite-requests" },
  ],
  shadow: [
    line("s1", "Could I have a flat white, please?", "Could I have a FLAT WHITE, please? ↗", "kʊd aɪ ˈhæv ə ˌflæt ˈwaɪt pliːz ↗", "咖啡店 B-1：礼貌请求升调。", "polite-requests"),
    line("s2", "Yes, I'll have one of those croissants, too.", "YES, | I'll have ONE of those CROISsants, TOO. ↘", "ˈjes | aɪl hæv ˈwʌn əv ðəʊz ˈkwæsɒnts ˈtuː ↘", "咖啡店 B-2：one of 连读；croissants 英式 /ˈkwæsɒnts/。", "linking"),
    line("s3", "To take away, please.", "To take aWAY, please. ↘", "tə ˈteɪk əˈweɪ pliːz ↘", "咖啡店 B-3：回答选择疑问句。", "linking"),
    line("s4", "Can I pay by card? Lovely, thanks.", "Can I PAY by CARD? ↗ | LOVEly, THANKS. ↘", "kən aɪ ˈpeɪ baɪ ˈkɑːd ↗ | ˈlʌvli ˈθæŋks ↘", "咖啡店 B-4：lovely 是英式口语的「好的、谢谢」。", "responses"),
    line("s5", "Excuse me, sorry to bother you. Could you tell me how to get to the station?", "Excuse me, | SORry to BOTHer you. | Could you TELL me | how to get to the STAtion? ↗", "ɪkˈskjuːz mi | ˈsɒri tə ˈbɒðə ju | kʊdʒu ˈtel mi | haʊ tə ˈɡet tə ðə ˈsteɪʃn ↗", "问路 B-1：四个意群；could you 同化。", "polite-requests"),
    line("s6", "Second left, OK. Brilliant. Thanks very much.", "SECond LEFT, ↗ OK. ↘ | BRILliant. | THANKS very MUCH. ↘", "ˈsekənd ˈleft ↗ əʊˈkeɪ ↘ | ˈbrɪliənt | ˈθæŋks ˈveri ˈmʌtʃ ↘", "问路 B-2：重复对方的话确认时用升调。", "responses"),
    line("s7", "Hi, I booked a table for two at half past seven. The name's Lee: L, double E.", "Hi, | I BOOKED a TAble for TWO | at HALF past SEVen. | The name's LEE: ↘ | L, ↗ double E. ↘", "haɪ | aɪ ˈbʊkt ə ˈteɪbl fə ˈtuː | ət ˈhɑːf pɑːst ˈsevn | ðə ˈneɪmz ˈliː ↘ | el ↗ ˈdʌbl ˈiː ↘", "餐厅 B-1：booked /t/；name's /z/；时间和拼写。", "ed-endings"),
    line("s8", "I think so. I'd like the fish, please, and could we have some tap water?", "I THINK so. ↘ | I'd like the FISH, please, | and could we have some TAP WAter? ↗", "aɪ ˈθɪŋk səʊ ↘ | aɪd laɪk ðə ˈfɪʃ pliːz | ən kʊd wi hæv səm ˌtæp ˈwɔːtə ↗", "餐厅 B-2：两个请求，第二个升调。", "polite-requests"),
    line("s9", "Excuse me, could we have the bill, please?", "Excuse me, | could we have the BILL, please? ↗", "ɪkˈskjuːz mi | kʊd wi hæv ðə ˈbɪl pliːz ↗", "餐厅 B-3：bill 的暗 l。", "polite-requests"),
  ],
  reviewPrompts: ["三段对话里，哪一段你觉得最像真的在对话？哪一段最像在念课文？", "把 B 的台词换成你真正会点的东西、会去的地方，再说一遍。", "下次去咖啡店或餐厅时，用英语在心里过一遍今天的台词。"],
  skills: ["polite-requests", "responses", "letters-numbers", "linking"],
};
