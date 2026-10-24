import type { QuizItem, ShadowItem } from "./types";

// Week 2 comparable set: used on Day 8 (baseline) and again on Day 14 (re-test).
// Week 1's set tested single sounds; this one tests connected speech: weak and
// strong forms, contractions, numbers, compounds, linking, tags and tonic placement.
//
// About the model audio: browser speech synthesis reads punctuation, so a tag
// ending in "." falls and one ending in "?" rises. It does not reliably produce
// contrastive stress or glottal stops, so those are tested as knowledge items.

const hear = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `b2-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});
const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `b2-${id}`, kind: "know", prompt, options, answer, skill, explain,
});

export const BASELINE2_QUIZ: QuizItem[] = [
  hear("can", "weak-forms", "说话人能不能来？", "I can come on Friday.", ["能来（can）", "不能来（can't）"], 0, "肯定句里的 can 弱读为 /kən/：短、轻、元音是 /ə/。"),
  hear("cant", "strong-forms", "说话人会不会开车？", "I can't drive.", ["会（can）", "不会（can't）"], 1, "can't 永远强读：SSBE 是长元音 /kɑːnt/，和美式 /kænt/ 不同。词尾 t 常不爆破，所以主要听元音长短和重音。"),
  hear("wont", "contractions", "你听到的是哪一句？", "I won't go.", ["I won't go.（不去）", "I want to go.（想去）"], 0, "won't /wəʊnt/ 是双元音，从央元音滑向 /ʊ/；want /wɒnt/ 是短而圆的 /ɒ/。"),
  hear("want", "contractions", "你听到的是哪一句？", "I want to go.", ["I won't go.（不去）", "I want to go.（想去）"], 1, "want to 常读 /ˈwɒn tə/：短元音 /ɒ/，后面还有一个弱读的 to。"),
  hear("ill", "contractions", "你听到的是哪一句？", "I'll call you later.", ["I call you later.", "I'll call you later.", "I'd call you later."], 1, "I'll /aɪl/ 的暗 l 要发出来，接在 call 前面。"),
  hear("id", "contractions", "你听到的是哪一句？", "I'd like a coffee.", ["I like a coffee.", "I'd like a coffee."], 1, "I'd /aɪd/ 的 d 和 like 的 l 挨着，d 不爆破，听起来像在 like 前有一个短暂的停顿。"),
  hear("count1", "weak-forms", "这句话一共有几个词？", "What do you want to do?", ["5 个", "6 个", "7 个"], 1, "What do you want to do? 6 个词。do you 和 to 都弱读，很容易漏听。"),
  hear("count2", "weak-forms", "这句话一共有几个词？", "I was going to ask for some of them.", ["7 个", "8 个", "9 个"], 2, "I was going to ask for some of them：9 个词。was /wəz/、to、for /fə/、of /əv/、them /ðəm/ 都弱读，很容易漏听。"),
  hear("13", "teen-ty", "你听到的数字是？", "thirteen", ["13", "30"], 0, "thirteen：重音在 -teen，/iː/ 长，结尾有 n。"),
  hear("50", "teen-ty", "你听到的数字是？", "fifty", ["15", "50"], 1, "fifty /ˈfɪfti/：重音在前，-ty 短而轻，没有 n。"),
  hear("14", "teen-ty", "多少钱？", "It costs fourteen pounds.", ["14 镑", "40 镑"], 0, "fourteen 在名词前重音会前移，这时要听 -teen 的长元音和 n。"),
  hear("green", "compound-stress", "你听到的是哪个意思？", "a greenhouse", ["a GREENhouse（温室）", "a green HOUSE（绿色的房子）"], 0, "复合名词重音在第一部分：GREENhouse。合成语音的重音不一定典型，以 Learn 的说明为准。"),
  hear("tag1", "question-tags", "附加问句是降调还是升调？", "It's a lovely day, isn't it.", ["降调 ↘（期待对方同意）", "升调 ↗（真的在问）"], 0, "isn't it 用降调：说话人知道天气好，只是在寒暄。"),
  hear("tag2", "question-tags", "附加问句是降调还是升调？", "You're coming tomorrow, aren't you?", ["降调 ↘（期待对方同意）", "升调 ↗（真的在问）"], 1, "aren't you 用升调：说话人不确定，在确认。"),
  hear("name", "linking", "你听到的是哪个短语？", "a name", ["an aim", "a name"], 1, "an aim 和 a name 连读后几乎一样，区别在于 /n/ 归前一个音节还是后一个。这一题记录你的起点。"),
  know("tonic", "tonic", "「Did you buy a red car?」「No, I bought a blue car.」回答里核心重音在哪个词？", ["bought", "blue", "car"], 1, "car 是旧信息，blue 是和 red 对比的新信息，核心重音落在 BLUE。"),
  know("glottal", "glottal-t", "现代 SSBE 中，下面哪个词里的 t 最常读成喉塞 [ʔ]？", ["water", "football", "better"], 1, "football 的 t 在辅音 /b/ 前，常读 [ˈfʊʔbɔːl]。water、better 的 t 在两个元音之间，SSBE 仍读清楚的 [t]。"),
  know("assim", "assimilation-place", "快速口语中，ten boys 里 ten 的 /n/ 常变成？", ["/m/", "/ŋ/", "保持 /n/"], 0, "/n/ 在双唇音 /b/ 前同化为 /m/：[tem bɔɪz]。"),
];

// Recording set repeated on Day 8 and Day 14.
export const BASELINE2_PASSAGE = [
  "I was going to call you last night, but I didn't have time.",
  "Would you like to meet for a coffee on Thursday afternoon?",
  "There's a nice little place near the station, and it isn't far from here.",
  "Let me know what you think, and I'll book a table for two.",
];

export const BASELINE2_RECORD: ShadowItem[] = [
  {
    id: "b2-r1",
    text: "I can come, but I can't stay long.",
    marked: "I can COME, | but I CAN'T stay LONG.",
    ipa: "aɪ kən ˈkʌm | bət aɪ ˈkɑːnt steɪ ˈlɒŋ",
    focus: "can 弱读 /kən/，can't 强读 /kɑːnt/。",
    skill: "strong-forms",
    baseline: true,
  },
  {
    id: "b2-r2",
    text: "thirteen, thirty, fourteen, forty, fifteen, fifty",
    ipa: "ˌθɜːˈtiːn, ˈθɜːti, ˌfɔːˈtiːn, ˈfɔːti, ˌfɪfˈtiːn, ˈfɪfti",
    focus: "-teen 重读、长、有 n；-ty 轻、短；t 清楚不弹舌。",
    skill: "teen-ty",
    baseline: true,
  },
  ...BASELINE2_PASSAGE.map<ShadowItem>((text, i) => ({
    id: `b2-p${i + 1}`,
    text,
    marked: [
      "I was GOing to CALL you last NIGHT, | but I DIDn't have TIME.",
      "Would‿you LIKE to MEET for‿a COFfee | on THURSday afterNOON? ↗",
      "There's a NICE little PLACE | near the STAtion, | and‿it ISn't FAR from HERE.",
      "Let me KNOW what‿you THINK, | and I'll BOOK‿a TAble for TWO.",
    ][i],
    ipa: [
      "aɪ wəz ˈɡəʊɪŋ tə ˈkɔːl jə lɑːs ˈnaɪt | bət aɪ ˈdɪdnt həv ˈtaɪm",
      "wʊdʒu ˈlaɪk tə ˈmiːt fər ə ˈkɒfi | ɒn ˈθɜːzdeɪ ˌɑːftəˈnuːn ↗",
      "ðəz ə ˈnaɪs lɪtl ˈpleɪs | nɪə ðə ˈsteɪʃn | ənd ɪt ˈɪznt ˈfɑː frəm ˈhɪə",
      "let mi ˈnəʊ wɒtʃu ˈθɪŋk | ənd aɪl ˈbʊk ə ˈteɪbl fə ˈtuː",
    ][i],
    focus: [
      "was / to / you / but 弱读；last night 省掉 t；didn't 的 t 在 h 前可读喉塞。",
      "would you 同化为 /wʊdʒu/；for a 出现连接 r；afternoon 重音在后；升调。",
      "三个意群；isn't 连读；far from 的 far 后面是辅音，没有 r。",
      "what you 同化为 /wɒtʃu/；I'll 的 l 要发出来；book a 连读；for 弱读，two 是核心重音。",
    ][i],
    skill: ["weak-forms", "elision-assimilation", "chunking", "contractions"][i],
    baseline: true,
  })),
];
