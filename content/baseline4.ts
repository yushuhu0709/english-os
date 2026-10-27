import type { QuizItem, ShadowItem } from "./types";

// Week 4 comparable set: used on Day 22 (baseline) and again on Day 28 (re-test).
// Consonant clusters, long-word stress, telling a story, giving an opinion with
// a fall-rise, and chunking long sentences. Day 28 also repeats the Day 1
// passage so the month report can compare the first and the last day.

const hear = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `b4-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});
const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `b4-${id}`, kind: "know", prompt, options, answer, skill, explain,
});

export const BASELINE4_QUIZ: QuizItem[] = [
  hear("texts", "clusters", "你听到的是哪个词？", "texts", ["text", "tests", "texts"], 2, "texts /teksts/：结尾 k-s-t-s 四个辅音。快速口语里常简化成 /teks/，但这里是清楚的读法。"),
  hear("sixth", "clusters", "你听到的是哪个短语？", "the sixth floor", ["the six floor", "the sixth floor"], 1, "sixth /sɪksθ/：结尾 /ksθ/，最后的 th 舌尖轻碰上齿。"),
  hear("asked", "clusters", "你听到的是哪个词？", "asked", ["ask", "asked"], 1, "asked /ɑːskt/：/skt/ 三个辅音，英式 a 读 /ɑː/。"),
  hear("months", "clusters", "你听到的是哪个词？", "months", ["month", "months", "mouths"], 1, "months /mʌnθs/：th 之后还有 s。"),
  know("photo", "long-word-stress", "photography 的重音在？", ["PHO-to-gra-phy", "pho-TO-gra-phy", "pho-to-GRA-phy"], 1, "-graphy 前一个音节重读：phoTOgraphy /fəˈtɒɡrəfi/。"),
  know("econ", "long-word-stress", "economic 的重音在？", ["E-co-no-mic", "e-CO-no-mic", "e-co-NO-mic"], 2, "-ic 前一个音节重读：ecoNOMic /ˌiːkəˈnɒmɪk/ 或 /ˌekəˈnɒmɪk/。"),
  know("info", "long-word-stress", "information 的重音在？", ["IN-for-ma-tion", "in-for-MA-tion", "in-FOR-ma-tion"], 1, "-tion 前一个音节重读：inforMAtion /ˌɪnfəˈmeɪʃn/。"),
  know("poss", "long-word-stress", "possibility 的重音在？", ["POS-si-bi-li-ty", "pos-si-BI-li-ty", "pos-si-bi-LI-ty"], 1, "-ity 前一个音节重读：possiBIlity /ˌpɒsəˈbɪləti/。"),
  hear("pho", "long-word-stress", "你听到的是哪个词？", "photographer", ["photograph", "photographer", "photographic"], 1, "photographer /fəˈtɒɡrəfə/：重音在 TO，结尾 /ə/ 不卷舌。"),
  know("fallrise", "fall-rise", "同事说「The flat's nice... ↘↗」（降升调），意思最可能是？", ["房子很好，没问题", "房子还行，但有别的问题"], 1, "降升调表示保留：「但是……」。"),
  know("actually", "discourse-markers", "「Actually, ↘↗ it's on Tuesday.」里的 actually 用来？", ["礼貌地纠正对方", "表示非常确定"], 0, "英式口语常用 actually 加降升调，温和地纠正。"),
  know("anyway", "discourse-markers", "讲故事时说「Anyway, ...」通常是为了？", ["回到正题或准备收尾", "表示惊讶"], 0, "anyway 常用来结束一段插话，回到主线。"),
  know("chunk", "chunking", "「The woman who lives next door is a doctor.」最自然的停顿在？", ["The woman | who lives next door is a doctor.", "The woman who lives next door | is a doctor.", "The woman who lives | next door is a doctor."], 1, "主语再长也是一个意群，在谓语 is 前停顿。"),
  hear("needed", "ed-endings", "needed 有几个音节？", "needed", ["1 个", "2 个"], 1, "needed /ˈniːdɪd/：d 后的 -ed 读 /ɪd/。"),
  hear("250", "letters-numbers", "你听到的数字是？", "two hundred and fifty", ["215", "250", "2050"], 1, "英式英语在 hundred 后面加 and：two hundred and fifty。"),
  know("retell", "fluency", "用自己的话复述时，最值得先保住的是？", ["用尽量复杂的句子", "意群停顿和核心重音", "说得越快越好"], 1, "句子简单没关系；停顿和重音对了，听的人就能跟上。"),
];

// The story used for shadowing on Day 23 and recorded on Day 22 / Day 28.
export const STORY = [
  "Last month I started a new job in Manchester.",
  "At first it was a bit difficult, because I didn't know anyone.",
  "But actually, after a couple of weeks, I really started to enjoy it.",
];

export const BASELINE4_RECORD: ShadowItem[] = [
  { id: "b4-r1", text: "She asked for the texts from the last six months.", marked: "She ASKED for the TEXTS | from the LAST six MONTHS.", ipa: "ʃi ˈɑːskt fə ðə ˈteksts | frəm ðə ˈlɑːst sɪks ˈmʌnθs", focus: "asked、texts、months 的辅音丛不加元音；for、from 弱读。", skill: "clusters", baseline: true },
  { id: "b4-r2", text: "photograph, photography, photographic; economy, economic", ipa: "ˈfəʊtəɡrɑːf, fəˈtɒɡrəfi, ˌfəʊtəˈɡræfɪk; ɪˈkɒnəmi, ˌiːkəˈnɒmɪk", focus: "重音随后缀移动；非重读元音弱读成 /ə/。", skill: "long-word-stress", baseline: true },
  ...STORY.map<ShadowItem>((text, i) => ({
    id: `b4-s${i + 1}`,
    text,
    marked: [
      "LAST month | I STARted a NEW JOB in MANchester.",
      "At FIRST | it was a bit DIFficult, | because I didn't KNOW ANyone.",
      "But ACtually, ↘↗ | after a COUPle of WEEKS, | I REALly STARted to enJOY it.",
    ][i],
    ipa: [
      "ˈlɑːst mʌnθ | aɪ ˈstɑːtɪd ə ˈnjuː ˈdʒɒb ɪn ˈmæntʃɪstə",
      "ət ˈfɜːst | ɪt wəz ə bɪt ˈdɪfɪkəlt | bɪˈkɒz aɪ ˈdɪdnt ˈnəʊ ˈeniwʌn",
      "bət ˈæktʃuəli ↘↗ | ˈɑːftər ə ˈkʌpl əv ˈwiːks | aɪ ˈrɪəli ˈstɑːtɪd tʊ ɪnˈdʒɔɪ ɪt",
    ][i],
    focus: [
      "started 的 -ed 读 /ɪd/；new 英式读 /njuː/；Manchester 结尾 /ə/。",
      "三个意群；was 弱读；difficult 重音在第一个音节。",
      "actually 自成一个意群，降升调；after a 连接 r；to 在元音前读 /tʊ/。",
    ][i],
    skill: ["ed-endings", "chunking", "discourse-markers"][i],
    baseline: true,
  })),
  { id: "b4-r3", text: "It's a good idea, but I'm not sure it would work.", marked: "It's a GOOD iDEa, ↘↗ | but I'm NOT SURE it would WORK. ↘", ipa: "ɪts ə ˈɡʊd aɪˈdɪə ↘↗ | bət aɪm ˈnɒt ˈʃɔːr ɪt wəd ˈwɜːk ↘", focus: "idea 上用降升调表示「但是」；sure it 连接 r；would 弱读。", skill: "fall-rise", baseline: true },
];
