import type { DayPlan, QuizItem } from "../types";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d18-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d18-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

export const day18: DayPlan = {
  day: 18,
  title: "字母、数字、日期和时间",
  titleEn: "Letters, Numbers, Dates & Times",
  outcome: "按英式读法拼写名字和邮箱；报电话号码时分组、用 oh 和 double；说出英式日期、时间和价格。",
  minMinutes: 60,
  blocks: { understand: 15, perceive: 30, shadow: 30, review: 10 },
  intro: "订餐、打电话、登记信息时，最容易卡住的往往不是句子，而是字母和数字。说错一个 E 和 I，或者把 fifteen 和 fifty 说混，对方就要反复确认。今天把这些最实用、也最容易出错的内容一次练清楚。",
  learn: [
    {
      id: "d18-letters",
      title: "英式字母：几组最容易混的",
      paragraphs: [
        "很多中国学生的字母读音受拼音影响。按元音分组记最有效：",
      ],
      bullets: [
        "/eɪ/：A H J K（H 读 /eɪtʃ/，不是「爱吃」）",
        "/iː/：B C D E G P T V（E 是 /iː/）",
        "/e/：F L M N S X Z（Z 英式读 zed /zed/）",
        "/aɪ/：I Y（I 是 /aɪ/，和 E 不要混）",
        "/əʊ/：O；/uː/：Q U W；/ɑː/：R（英式不卷舌）",
        "W 读 /ˈdʌbljuː/，三个音节。",
      ],
    },
    {
      id: "d18-spell",
      title: "拼写名字和邮箱",
      paragraphs: [
        "每个字母之间稍微停一下，一组 3–4 个字母，最后一个字母降调：H-A-Z, ↗ E-L. ↘",
        "两个相同字母说 double：Anna → A, double N, A。",
        "邮箱：@ 读 at，. 读 dot，- 读 hyphen 或 dash，_ 读 underscore。英式常把 .co.uk 读成 dot co dot uk。",
        "对方确认时常问：Is that B for Bravo? 你也可以主动说：S for Sugar。",
      ],
      bullets: ["It's Hazel: H, A, Z, E, L.", "Anna: A, double N, A.", "anna dot lee at gmail dot com"],
    },
    {
      id: "d18-numbers",
      title: "电话号码、-teen 和 -ty、hundred and",
      paragraphs: [
        "电话号码按组读，每组末尾升调，最后一组降调；0 读 oh，相同的两个数字读 double：07744 → oh seven seven double four。",
        "-teen 与 -ty（Day 11 复习）：fifTEEN 重音在后、长元音、有 n；FIFty 重音在前，t 可以轻弹。",
        "英式在 hundred 后加 and：two hundred and fifty；年份 2026 读 twenty twenty-six。",
        "价格：£3.50 读 three pounds fifty 或 three fifty；50p 读 fifty p /piː/。",
      ],
      bullets: ["oh seven seven double four", "fifteen, fifty", "two hundred and fifty", "three pounds fifty"],
    },
    {
      id: "d18-dates",
      title: "日期和时间",
      paragraphs: [
        "英式日期把日放前面，用序数词：the fifteenth of May（写作 15 May 或 15/05）。说的时候 the 和 of 都弱读：/ðə ˌfɪfˈtiːnθ əv ˈmeɪ/。",
        "序数词结尾的 th 要咬舌：fifth /fɪfθ/、sixth /sɪksθ/、twelfth /twelfθ/。",
        "时间：half past six（6:30）、a quarter to nine（8:45）、ten past three（3:10）。past 英式读 /pɑːst/。正式场合也说 six thirty、eight forty-five。",
      ],
      bullets: ["the fifteenth of May", "on the third of June", "half past six", "a quarter to nine"],
    },
  ],
  listen: [
    { id: "d18-l1", text: "It's Hazel: H, A, Z, E, L.", note: "英式 Z 读 zed。" },
    { id: "d18-l2", text: "Anna: A, double N, A.", note: "double + 字母。" },
    { id: "d18-l3", text: "oh seven seven double four, five six two, nine one eight", note: "分组，每组末尾升调。" },
    { id: "d18-l4", text: "fifteen pounds, not fifty.", note: "-teen 与 -ty 对比。" },
    { id: "d18-l5", text: "two hundred and fifty", note: "英式加 and。" },
    { id: "d18-l6", text: "on the fifteenth of May", note: "the 和 of 弱读。" },
    { id: "d18-l7", text: "a quarter to nine", note: "8:45。" },
    { id: "d18-l8", text: "anna dot lee at gmail dot com", note: "dot、at。" },
  ],
  identify: [
    know("k1", "letters-numbers", "英式英语里字母 Z 读？", ["zee /ziː/", "zed /zed/"], 1, "英式 zed，美式 zee。"),
    know("k2", "letters-numbers", "下面哪个字母和 E 是同一个元音 /iː/？", ["I", "G", "A"], 1, "B C D E G P T V 都是 /iː/。"),
    know("k3", "letters-numbers", "电话号码里的 0 英式通常读？", ["zero", "oh"], 1, "电话号码里多读 oh，数学和温度里用 zero/nought。"),
    know("k4", "letters-numbers", "6:30 用英式说法是？", ["half past six", "half to six", "six half"], 0, "half past six = 6 点过半。"),
    know("k5", "letters-numbers", "5 月 3 日最自然的英式说法是？", ["May three", "the third of May"], 1, "英式日期：the + 序数词 + of + 月份。"),
    hearQ("h1", "letters-numbers", "你听到的是哪个字母？", "I", ["E", "I", "A"], 1, "I /aɪ/；E /iː/。"),
    hearQ("h2", "letters-numbers", "你听到的是哪个字母？", "G", ["G", "J", "Z"], 0, "G /dʒiː/；J /dʒeɪ/。中国学生常把这两个读反。"),
    hearQ("h3", "teen-ty", "你听到的价格是？", "fifteen pounds", ["£15", "£50"], 0, "fifteen 重音在 -TEEN。"),
    hearQ("h4", "letters-numbers", "你听到的号码是？", "oh one six one, double three, four", ["0161 334", "0161 3334", "0161 434"], 0, "double three = 33。"),
    hearQ("h5", "letters-numbers", "你听到的时间是？", "ten past three", ["2:50", "3:10", "10:03"], 1, "ten past three = 3 点过 10 分。"),
    hearQ("h6", "letters-numbers", "你听到的日期是？", "the twelfth of June", ["6 月 2 日", "6 月 12 日", "6 月 20 日"], 1, "twelfth /twelfθ/：注意结尾的 /lfθ/。"),
  ],
  produce: [
    { id: "d18-p1", text: "A, H, J, K. B, C, D, E, G. I, Y.", ipa: "eɪ eɪtʃ dʒeɪ keɪ. biː siː diː iː dʒiː. aɪ waɪ", cue: "按元音分组读：/eɪ/、/iː/、/aɪ/。H 是 /eɪtʃ/，不要加尾音。", skill: "letters-numbers" },
    { id: "d18-p2", text: "F, L, M, N, S, X, Z. R. W.", ipa: "ef el em en es eks zed. ɑː. ˈdʌbljuː", cue: "/e/ 一组；R 英式 /ɑː/ 不卷舌；W 三个音节。", skill: "letters-numbers" },
    { id: "d18-p3", text: "My email is anna dot lee at gmail dot com.", ipa: "maɪ ˈiːmeɪl ɪz ˈænə dɒt ˈliː ət ˈdʒiːmeɪl dɒt ˈkɒm", cue: "dot /dɒt/ 英式短元音；at 弱读 /ət/。", skill: "letters-numbers" },
    { id: "d18-p4", text: "fifteen, fifty; sixteen, sixty; two hundred and fifty", ipa: "ˌfɪfˈtiːn, ˈfɪfti; ˌsɪksˈtiːn, ˈsɪksti; ˈtuː ˈhʌndrəd ən ˈfɪfti", cue: "-teen 重音在后，-ty 重音在前；and 弱读。", skill: "teen-ty" },
    { id: "d18-p5", text: "the fifth, the sixth, the twelfth of June", ipa: "ðə ˈfɪfθ, ðə ˈsɪksθ, ðə ˈtwelfθ əv ˈdʒuːn", cue: "结尾的 th 要咬舌，前面的辅音不要丢。", skill: "θ-s" },
    { id: "d18-p6", text: "half past six, a quarter to nine, ten past three", ipa: "ˈhɑːf pɑːst ˈsɪks, ə ˈkwɔːtə tə ˈnaɪn, ˈten pɑːst ˈθriː", cue: "half、past 英式 /ɑː/；quarter 结尾 /ə/；to 弱读。", skill: "letters-numbers" },
  ],
  shadow: [
    { id: "d18-s1", text: "Can I take your name, please? Yes, it's Lee: L, double E.", marked: "Can I take your NAME, please? ↗ | YES, it's LEE: ↘ | L, ↗ double E. ↘", ipa: "kən aɪ ˈteɪk jə ˈneɪm pliːz ↗ | ˈjes ɪts ˈliː ↘ | el ↗ ˈdʌbl ˈiː ↘", focus: "can I 弱读连读；拼写时每个字母稍停。", skill: "letters-numbers" },
    { id: "d18-s2", text: "And a contact number? It's oh seven seven double four, five six two, nine one eight.", marked: "And a CONtact NUMber? ↗ | It's oh SEVen seven DOUble FOUR, ↗ | five six TWO, ↗ | nine one EIGHT. ↘", ipa: "ənd ə ˈkɒntækt ˈnʌmbə ↗ | ɪts əʊ ˈsevn ˈsevn ˈdʌbl ˈfɔː ↗ | faɪv sɪks ˈtuː ↗ | naɪn wʌn ˈeɪt ↘", focus: "分组读号码，最后一组降调表示说完了。", skill: "letters-numbers" },
    { id: "d18-s3", text: "The appointment is on the fifteenth of May, at a quarter to nine.", marked: "The aPPOINTment is on the FIFteenth of MAY, | at a QUARter to NINE. ↘", ipa: "ði əˈpɔɪntmənt ɪz ɒn ðə ˌfɪfˈtiːnθ əv ˈmeɪ | ət ə ˈkwɔːtə tə ˈnaɪn ↘", focus: "the 在元音前读 /ði/；of、at、to 弱读。", skill: "letters-numbers" },
    { id: "d18-s4", text: "That's fifteen pounds fifty. Sorry, fifteen or fifty? Fifteen.", marked: "That's FIFteen pounds FIFty. ↘ | Sorry, fifTEEN ↗ or FIFty? ↘ | fifTEEN. ↘", ipa: "ðæts ˌfɪfˈtiːn paʊndz ˈfɪfti ↘ | ˈsɒri | ˌfɪfˈtiːn ↗ ɔː ˈfɪfti ↘ | ˌfɪfˈtiːn ↘", focus: "对比时 -teen 的重音最清楚；选择疑问句前升后降。", skill: "teen-ty" },
  ],
  reviewPrompts: ["你拼写自己的英文名字或邮箱时，有没有哪个字母读得不确定？", "E/I、G/J 这两组，你听辨和读的时候还会混吗？", "下次打电话或登记信息时，试着用今天的方式报一次号码。"],
  skills: ["letters-numbers", "teen-ty", "θ-s"],
};
