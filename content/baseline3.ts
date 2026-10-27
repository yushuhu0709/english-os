import type { QuizItem, ShadowItem } from "./types";

// Week 3 comparable set: used on Day 15 (baseline) and again on Day 21 (re-test).
// Everyday conversation: responses and echo questions, question intonation,
// polite requests, letters, numbers, dates and times, -ed and -s endings.
//
// Synthetic model audio reads "?" with a rise and "." with a fall, so the
// intonation items below rely on punctuation. Meaning-of-intonation items are
// knowledge questions.

const hear = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `b3-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});
const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `b3-${id}`, kind: "know", prompt, options, answer, skill, explain,
});

export const BASELINE3_QUIZ: QuizItem[] = [
  hear("really1", "responses", "说话人听起来是？", "Oh, really?", ["感兴趣，想听下去 ↗", "没兴趣，只是「哦」↘"], 0, "回问用升调表示感兴趣、请对方继续说。"),
  hear("really2", "responses", "说话人听起来是？", "Oh, really.", ["感兴趣，想听下去 ↗", "没兴趣，只是「哦」↘"], 1, "同样的词用降调，就像「哦，知道了」，话题到此为止。"),
  know("echo", "responses", "朋友说「I've just got a new job.」，最自然的回应是？", ["Oh, have you? ↗ Where?", "Oh, you have. ↘", "Yes."], 0, "回问 Have you? 用 have 呼应对方的 I've，升调表示感兴趣，再接一个问题让对话继续。"),
  know("andyou", "responses", "「Fine, thanks. And you?」重音应该落在？", ["and", "you"], 1, "把问题抛回给对方，重音落在 YOU 上，并且升调。"),
  know("wh", "wh-questions", "「Where do you work?」在 SSBE 里通常用？", ["降调 ↘", "升调 ↗"], 0, "wh- 问句通常用降调，核心重音在最后一个实词 WORK 上。"),
  know("repeat", "wh-questions", "没听清对方说的地点，想请他重复，最自然的是？", ["Sorry, where? ↗（重音在 where）", "Sorry, where. ↘"], 0, "请对方重复时，疑问词重读并升调。"),
  know("mind", "polite-requests", "对方问「Would you mind opening the window?」，你愿意帮忙，应该回答？", ["Yes, I would.", "No, not at all."], 1, "mind 的意思是「介意」，回答 No, not at all 表示「不介意，可以」。"),
  know("could", "polite-requests", "快速口语中 could you 常读成？", ["/kʊd juː/，两个词分开", "/kʊdʒu/，d 和 y 同化成 dʒ"], 1, "/d/ + /j/ 同化为 /dʒ/：could you → /kʊdʒu/，would you → /wʊdʒu/。"),
  hear("z", "letters-numbers", "你听到的是哪个字母？", "Z", ["C", "G", "Z"], 2, "英式读 zed /zed/，美式读 zee。"),
  hear("h", "letters-numbers", "你听到的是哪个字母？", "H", ["A", "H", "8"], 1, "H 读 /eɪtʃ/，不要加别的元音。"),
  hear("e", "letters-numbers", "你听到的是哪个字母？", "E", ["E", "I"], 0, "E /iː/ 和 I /aɪ/ 是中国学生最常混的一对。"),
  hear("phone", "letters-numbers", "你听到的号码是？", "oh seven seven double four", ["07744", "07704", "07444"], 0, "0 读 oh，两个相同的数字读 double。"),
  hear("date", "letters-numbers", "你听到的日期是？", "the fifteenth of May", ["5 月 5 日", "5 月 15 日", "5 月 50 日"], 1, "the fifteenth of May：英式日期把日放在前面，用序数词。"),
  hear("time", "letters-numbers", "你听到的时间是？", "a quarter to nine", ["8:45", "9:15", "9:45"], 0, "quarter to nine = 差一刻九点 = 8:45。"),
  hear("walked", "ed-endings", "walked 有几个音节？", "walked", ["1 个", "2 个"], 0, "walked /wɔːkt/：-ed 读 /t/，不增加音节。"),
  hear("wanted", "ed-endings", "wanted 有几个音节？", "wanted", ["1 个", "2 个"], 1, "wanted /ˈwɒntɪd/：t 后的 -ed 读 /ɪd/，多一个音节。"),
  hear("buses", "s-endings", "buses 有几个音节？", "buses", ["1 个", "2 个"], 1, "buses /ˈbʌsɪz/：s 后的 -s 读 /ɪz/。"),
  know("dogs", "s-endings", "dogs 结尾的 -s 读？", ["/s/", "/z/", "/ɪz/"], 1, "g 是浊音，-s 读 /z/：/dɒɡz/。"),
];

export const BASELINE3_RECORD: ShadowItem[] = [
  { id: "b3-r1", text: "Fine, thanks. And you?", marked: "FINE, thanks. ↘ | And YOU? ↗", ipa: "ˈfaɪn θæŋks ↘ | ənd ˈjuː ↗", focus: "重音落在 YOU，并且升调。", skill: "responses", baseline: true },
  { id: "b3-r2", text: "Oh, really? When did you get back?", marked: "Oh, REALly? ↗ | WHEN did you get BACK? ↘", ipa: "əʊ ˈrɪəli ↗ | ˈwen dɪdʒu ɡet ˈbæk ↘", focus: "回问升调表示感兴趣；wh- 问句降调。", skill: "wh-questions", baseline: true },
  { id: "b3-r3", text: "Would you mind if I opened the window?", marked: "Would‿you MIND if I OPened the WINdow? ↗", ipa: "wʊdʒu ˈmaɪnd ɪf aɪ ˈəʊpənd ðə ˈwɪndəʊ ↗", focus: "would you 同化为 /wʊdʒu/；opened 的 -ed 读 /d/；礼貌的升调。", skill: "polite-requests", baseline: true },
  { id: "b3-r4", text: "It's Hazel: H, A, Z, E, L.", ipa: "ɪts ˈheɪzl | eɪtʃ | eɪ | zed | iː | el", focus: "英式字母：H /eɪtʃ/、Z /zed/；E /iː/ 不要读成 /aɪ/。", skill: "letters-numbers", baseline: true },
  { id: "b3-r5", text: "My number is oh seven seven double four, five six two, nine one eight.", marked: "My NUMber is | oh SEVen seven DOUble FOUR, ↗ | five six TWO, ↗ | nine one EIGHT. ↘", ipa: "maɪ ˈnʌmbər ɪz | əʊ ˈsevn ˈsevn ˈdʌbl ˈfɔː ↗ | faɪv sɪks ˈtuː ↗ | naɪn wʌn ˈeɪt ↘", focus: "分三组读，每组末尾升，最后一组降。", skill: "letters-numbers", baseline: true },
  { id: "b3-r6", text: "We walked to the station and waited for the bus.", marked: "We WALKED to the STAtion | and WAITed for the BUS.", ipa: "wi ˈwɔːkt tə ðə ˈsteɪʃn | ən ˈweɪtɪd fə ðə ˈbʌs", focus: "walked /t/、waited /ɪd/ 两种 -ed；to、for 弱读。", skill: "ed-endings", baseline: true },
];
