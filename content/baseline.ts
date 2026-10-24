import type { QuizItem, ShadowItem } from "./types";

// The comparable set used on Day 1 (baseline) and again on Day 7 (re-test).
// Same items, same ids, so the report can line results up one-to-one.

const pair = (
  id: string,
  skill: string,
  say: string,
  options: string[],
  explain: string,
): QuizItem => ({
  id: `base-${id}`,
  kind: "hear",
  prompt: "你听到的是哪个词？",
  say,
  options,
  answer: options.indexOf(say),
  skill,
  explain,
});

export const BASELINE_QUIZ: QuizItem[] = [
  pair("ship", "iː-ɪ", "ship", ["sheep", "ship"], "ship /ʃɪp/ 的 /ɪ/ 短而松；sheep /ʃiːp/ 的 /iː/ 高而长。"),
  pair("leave", "iː-ɪ", "leave", ["leave", "live"], "leave /liːv/ 的元音长而高，而且在浊辅音 /v/ 前更长。"),
  pair("bed", "æ-e", "bed", ["bad", "bed"], "bed /bed/ 下巴半开；bad /bæd/ 开口明显更大。"),
  pair("man", "æ-e", "man", ["man", "men"], "man /mæn/ 开口大，接近 [a]。"),
  pair("cart", "ʌ-ɑː", "cart", ["cut", "cart"], "cart /kɑːt/ 长而靠后，不卷舌。"),
  pair("hut", "ʌ-ɑː", "hut", ["hut", "heart"], "hut /hʌt/ 短而偏央；heart /hɑːt/ 长而靠后。"),
  pair("caught", "ɒ-ɔː", "caught", ["cot", "caught"], "caught /kɔːt/ 嘴唇更圆、更长；cot /kɒt/ 短而开。"),
  pair("shot", "ɒ-ɔː", "shot", ["shot", "short"], "shot /ʃɒt/ 是短的 /ɒ/；short /ʃɔːt/ 是长的 /ɔː/。"),
  pair("fool", "ʊ-uː", "fool", ["full", "fool"], "fool /fuːl/ 长；full /fʊl/ 短而松。"),
  pair("pull", "ʊ-uː", "pull", ["pull", "pool"], "pull /pʊl/ 短；pool /puːl/ 长。"),
  pair("work", "ɜː", "work", ["work", "walk"], "work /wɜːk/ 是央元音 /ɜː/；walk /wɔːk/ 是圆唇后元音 /ɔː/。"),
  pair("bird", "ɜː", "bird", ["bud", "bird", "bard"], "bird /bɜːd/：央、长、不圆唇。bud /bʌd/ 短；bard /bɑːd/ 靠后。"),
  pair("late", "eɪ-aɪ-ɔɪ", "late", ["let", "late"], "late /leɪt/ 有从 /e/ 到 /ɪ/ 的滑动；let /let/ 没有。"),
  pair("coat", "əʊ-aʊ", "coat", ["cot", "caught", "coat"], "coat /kəʊt/ 是双元音 /əʊ/，起点偏央。"),
  pair("think", "θ-s", "think", ["think", "sink"], "think 以 /θ/ 开头：舌尖接触上齿。"),
  pair("fin", "θ-s", "fin", ["thin", "fin"], "fin 以 /f/ 开头：上齿碰下唇。"),
  pair("then", "ð-z-d", "then", ["then", "den"], "then 以 /ð/ 开头：舌尖在齿间且声带振动。"),
  pair("breeze", "ð-z-d", "breeze", ["breathe", "breeze"], "breeze 以 /z/ 结尾；breathe 以 /ð/ 结尾。"),
  pair("vine", "v-w", "vine", ["vine", "wine"], "vine 以 /v/ 开头：上齿碰下唇。"),
  pair("west", "v-w", "west", ["vest", "west"], "west 以 /w/ 开头：双唇收圆，不碰牙齿。"),
  pair("night", "l-n-r", "night", ["light", "night", "right"], "night 以鼻音 /n/ 开头。"),
  pair("rise", "vowel-length", "rise", ["rice", "rise"], "rise /raɪz/ 以浊音 /z/ 结尾，前面的元音更长。"),
  pair("back", "vowel-length", "back", ["back", "bag"], "back /bæk/ 以清音 /k/ 结尾，元音较短。"),
  pair("sip", "ʃ-s-tʃ", "sip", ["sip", "ship", "chip"], "sip 以 /s/ 开头：嘴唇自然，舌尖靠近齿龈。"),
  {
    id: "base-stress-photographer",
    kind: "hear",
    prompt: "photographer 的重音在哪个音节？",
    say: "photographer",
    options: ["PHO-to-gra-pher", "pho-TO-gra-pher", "pho-to-GRA-pher"],
    answer: 1,
    skill: "word-stress",
    explain: "photographer /fəˈtɒɡrəfə/：重音在第二音节，第一音节弱读为 /fə/。",
  },
  {
    id: "base-stress-economic",
    kind: "hear",
    prompt: "economic 的主重音在哪个音节？",
    say: "economic",
    options: ["E-co-no-mic", "e-CO-no-mic", "e-co-NO-mic"],
    answer: 2,
    skill: "word-stress",
    explain: "economic /ˌiːkəˈnɒmɪk/ 或 /ˌekəˈnɒmɪk/：主重音在 -nom-。",
  },
];

// Recording set repeated on Day 1 and Day 7.
export const BASELINE_PASSAGE = [
  "Last week I asked my brother Peter to help me with a short talk.",
  "He thinks that learning a new accent is hard work, but it isn't impossible.",
  "If you listen carefully, record yourself and compare the sounds, you'll hear the difference.",
  "Would you like to try it with me later this afternoon?",
];

export const BASELINE_RECORD: ShadowItem[] = [
  {
    id: "base-words-1",
    text: "sheep, ship, bad, bed, cart, cut",
    ipa: "ʃiːp, ʃɪp, bæd, bed, kɑːt, kʌt",
    focus: "元音音质与长短：每对词之间的差别是否听得出来。",
    skill: "iː-ɪ",
    baseline: true,
  },
  {
    id: "base-words-2",
    text: "caught, cot, full, fool, bird, work",
    ipa: "kɔːt, kɒt, fʊl, fuːl, bɜːd, wɜːk",
    focus: "后元音的圆唇和长短；/ɜː/ 不卷舌。",
    skill: "ɒ-ɔː",
    baseline: true,
  },
  {
    id: "base-words-3",
    text: "think, then, very, west, rise, asked",
    ipa: "θɪŋk, ðen, ˈveri, west, raɪz, ɑːskt",
    focus: "th 的舌尖位置、v/w、词尾辅音是否完整。",
    skill: "θ-s",
    baseline: true,
  },
  ...BASELINE_PASSAGE.map<ShadowItem>((text, i) => ({
    id: `base-p${i + 1}`,
    text,
    focus: ["词尾 -ed /t/、short 的 /ɔː/、弱读 to / with / a。", "th、hard work 的 /ɑː/ 与 /ɜː/、isn't impossible 的连读。", "意群停顿、you'll 的弱读、difference 的重音。", "Would you 的同化、升调、afternoon 的重音。"][i],
    skill: ["final-consonants", "θ-s", "chunking", "intonation"][i],
    baseline: true,
  })),
];
