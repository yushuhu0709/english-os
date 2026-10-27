import type { DayPlan } from "../types";
import { BASELINE3_QUIZ, BASELINE3_RECORD } from "../baseline3";

export const day21: DayPlan = {
  day: 21,
  title: "第三周复测与报告",
  titleEn: "Week 3 Re-test & Report",
  outcome: "用 Day 15 的同一套材料复测，生成 Week 3 Everyday Conversation Report。",
  minMinutes: 45,
  blocks: { understand: 10, perceive: 30, shadow: 35, review: 10 },
  intro: "今天先花几分钟回顾第三周的六个主题，然后在和 Day 15 相同的条件下复测。复测题目和 Day 15 完全一样，第一次作答进入报告。",
  learn: [
    {
      id: "d21-recap",
      title: "回顾：第三周练过的对话技能",
      paragraphs: [
        "寒暄与回应（Day 15）：And YOU? ↗；回问 Have you? / Did you? 用升调并追问；Really 的升调和降调。",
        "问句的语调（Day 16）：wh- 问句默认降调，一般疑问句升调，选择疑问句前升后降；请对方重复时疑问词重读、升调。",
        "礼貌与委婉（Day 17）：Could you / Would you mind / I was wondering if；I'm afraid 和 Actually 的降升调。",
        "字母、数字、日期和时间（Day 18）：H /eɪtʃ/、Z /zed/、E 和 I；oh 和 double；the fifteenth of May；a quarter to nine。",
        "-ed 和 -s（Day 19）：/t/ /d/ /ɪd/ 与 /s/ /z/ /ɪz/；词尾不丢、不加元音。",
        "情景对话（Day 20）：咖啡店、问路、餐厅。",
      ],
    },
    {
      id: "d21-retest",
      title: "怎样复测才可比",
      paragraphs: [
        "和 Day 15 一样：同一个房间、同一个麦克风或耳机、同样的距离。录音前不要先反复练这几句。",
        "辨音题第一次作答进入报告。答完可以重听、再选，用于学习，但不改变成绩。",
        "复测题目和 Day 15 相同，成绩里会包含「做过一次」的熟悉度，报告会注明这一点。",
      ],
    },
    {
      id: "d21-report",
      title: "第三周报告包含什么",
      paragraphs: [
        "完成今天后，Progress 页面会生成 Week 3 Everyday Conversation Report：七天训练结果、Day 15 与 Day 21 的可比录音和听辨对比、尚未掌握的问题，以及第四周的优先项目。",
        "第四周从跟读走向自己说：讲故事、表达观点、自我介绍和 1 分钟自由表达。",
      ],
    },
  ],
  listen: [
    { id: "d21-l1", text: "I've just got back from Spain. Oh, have you? Where did you go?", note: "Day 15 回问 + 追问。" },
    { id: "d21-l2", text: "Would you like tea or coffee?", note: "Day 16 选择疑问句。" },
    { id: "d21-l3", text: "I was wondering if you could help me with something.", note: "Day 17 委婉请求。" },
    { id: "d21-l4", text: "the twelfth of June, at half past six", note: "Day 18 日期和时间。" },
    { id: "d21-l5", text: "She lived in Leeds and worked in an office.", note: "Day 19 -ed 连读。" },
    { id: "d21-l6", text: "Could I have a flat white, please?", note: "Day 20 咖啡店。" },
  ],
  identify: [
    ...BASELINE3_QUIZ,
    {
      id: "d21-k1", kind: "know", prompt: "对方说「He's moving to Canada.」，想表示感兴趣并让他继续说，最好是？", options: ["Is he? ↗ When?", "He is. ↘", "OK."], answer: 0, skill: "responses",
      explain: "回问 Is he? 用升调，再追问 When?",
    },
    {
      id: "d21-k2", kind: "hear", prompt: "你听到的是？", say: "She watched it.", options: ["She watch it.", "She watched it.", "She watches it."], answer: 1, skill: "ed-endings",
      explain: "watched /wɒtʃt/ 连 it：/wɒtʃ tɪt/。",
    },
  ],
  produce: [
    { id: "d21-p1", text: "Oh, have you? Does she? Didn't you?", ipa: "əʊ ˈhæv ju ↗. ˈdʌz ʃi ↗. ˈdɪdnt ju ↗", cue: "回问升调。", skill: "responses" },
    { id: "d21-p2", text: "Where do you work? Have you been here before?", ipa: "ˈweə də jə ˈwɜːk ↘. həv ju ˈbiːn hɪə bɪˈfɔː ↗", cue: "wh- 降调，一般疑问句升调。", skill: "wh-questions" },
    { id: "d21-p3", text: "I'm afraid I can't. Actually, it's on Tuesday.", ipa: "aɪm əˈfreɪd aɪ ˈkɑːnt ↘↗. ˈæktʃuəli ↘↗ ɪts ɒn ˈtjuːzdeɪ ↘", cue: "降升调：委婉。", skill: "fall-rise" },
    { id: "d21-p4", text: "the fifteenth of May; fifteen pounds fifty", ipa: "ðə ˌfɪfˈtiːnθ əv ˈmeɪ; ˌfɪfˈtiːn paʊndz ˈfɪfti", cue: "序数词的 th；-teen 与 -ty。", skill: "letters-numbers" },
    { id: "d21-p5", text: "walked, opened, wanted; cats, dogs, buses", ipa: "wɔːkt, ˈəʊpənd, ˈwɒntɪd; kæts, dɒɡz, ˈbʌsɪz", cue: "两组三种读法。", skill: "ed-endings" },
  ],
  shadow: [
    ...BASELINE3_RECORD,
    { id: "d21-s1", text: "Excuse me, sorry to bother you. Could you tell me how to get to the station?", marked: "Excuse me, | SORry to BOTHer you. | Could you TELL me | how to get to the STAtion? ↗", ipa: "ɪkˈskjuːz mi | ˈsɒri tə ˈbɒðə ju | kʊdʒu ˈtel mi | haʊ tə ˈɡet tə ðə ˈsteɪʃn ↗", focus: "综合：礼貌请求、意群、同化。", skill: "polite-requests" },
  ],
  reviewPrompts: ["和 Day 15 的录音相比，你自己听到的最大变化是什么？", "第三周哪个场景对你最有用？", "第四周要开始自己说了：你最想能用英语说清楚的一件事是什么？"],
  skills: ["responses", "wh-questions", "polite-requests", "letters-numbers", "ed-endings", "s-endings", "fall-rise"],
};
