import type { DayPlan, QuizItem } from "../types";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d10-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d10-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

export const day10: DayPlan = {
  day: 10,
  title: "省音、同化与英式喉塞",
  titleEn: "Elision, Assimilation & Glottal T",
  outcome: "听懂快速口语里消失或改变的音：/t d/ 省音、/h/ 和 /ə/ 的脱落、部位同化，以及现代 SSBE 的喉塞 t。",
  minMinutes: 60,
  blocks: { understand: 20, perceive: 35, shadow: 25, review: 10 },
  intro: "今天的内容主要是为了「听懂」。母语者正常语速说话时，有些音会消失、有些音会变样。知道它们怎么变，才不会觉得别人「吞音」。自己说的时候，这些变化会随着语速自然出现，不需要刻意模仿；慢速说清楚永远不算错。",
  learn: [
    {
      id: "d10-elision",
      title: "省音：哪些音会消失",
      paragraphs: [
        "① 辅音丛中间的 /t d/：next week /neks wiːk/，last time，old man /əʊl mæn/，kept quiet，mustn't /ˈmʌsnt/ → [ˈmʌsn]。",
        "② 代词开头的 /h/（不重读时）：tell him /ˈtel ɪm/，ask her /ˈɑːsk ə/，did he /ˈdɪd i/。句首或重读时 /h/ 保留：HIM, not her。",
        "③ 非重读的 /ə/：camera /ˈkæmrə/，family /ˈfæmli/，chocolate /ˈtʃɒklət/，interesting /ˈɪntrəstɪŋ/，suppose [spəʊz]（快速时）。",
      ],
      phonemes: [
        { ipa: "ks w", word: "next week", wordIpa: "neks ˈwiːk", cue: "/t/ 消失" },
        { ipa: "l ɪm", word: "tell him", wordIpa: "ˈtel ɪm", cue: "/h/ 消失" },
        { ipa: "mr", word: "camera", wordIpa: "ˈkæmrə", cue: "/ə/ 消失" },
      ],
      source: "《1000小时》4.4（省音）；Cruttenden（elision）",
    },
    {
      id: "d10-assim",
      title: "部位同化：音被下一个音「带走」",
      paragraphs: [
        "词尾的 /t d n/ 是在齿龈发的。如果下一个音在双唇或软腭发，舌尖常常来不及回到齿龈，就直接变成下一个音的发音部位。",
        "n → m（在 p b m 前）：ten boys [tem bɔɪz]，in Paris，ten pounds。n → ŋ（在 k g 前）：ten cups [teŋ kʌps]，in Cambridge。",
        "t → p / k：that boy [ðæp bɔɪ]，that girl [ðæk ɡɜːl]。d → b / g：good boy [ɡʊb bɔɪ]，bad guy。s → ʃ（在 ʃ j 前）：this shop [ðɪʃ ʃɒp]，this year [ðɪʃ jɪə]。",
        "Day 6 学过的 did you → /dɪdʒu/、would you → /wʊdʒu/、don't you → /dəʊntʃu/ 也是同化。",
      ],
      phonemes: [
        { ipa: "m b", word: "ten boys", wordIpa: "ten ˈbɔɪz", cue: "[tem bɔɪz]" },
        { ipa: "ŋ k", word: "ten cups", wordIpa: "ten ˈkʌps", cue: "[teŋ kʌps]" },
        { ipa: "ʃ ʃ", word: "this shop", wordIpa: "ðɪs ˈʃɒp", cue: "[ðɪʃ ʃɒp]" },
        { ipa: "dʒ", word: "would you", wordIpa: "ˈwʊd ju", cue: "[ˈwʊdʒu]" },
      ],
    },
    {
      id: "d10-glottal",
      title: "现代 SSBE 的喉塞 t [ʔ]",
      paragraphs: [
        "喉塞 [ʔ] 是声门突然关闭再打开的声音，就像说 uh-oh 时中间那一下。现代 SSBE（包括 BBC 主持人、年轻一代的标准英式口音）在辅音前常把 /t/ 读成 [ʔ]，或者 [ʔ] 和 [t] 同时出现。",
        "常见位置：辅音前（football [ˈfʊʔbɔːl]，not now [nɒʔ naʊ]，that one，Gatwick，quite good，it's not bad），以及意群末尾停顿前（Wait! [weɪʔ]，有时）。",
        "SSBE 不这样用的位置：两个元音之间。water、better、a lot of、get up 里的 t 读清楚的 [t]。在这些位置用喉塞（[ˈwɔːʔə]）是伦敦口音（Cockney / Estuary）的特征。美式的弹舌 [ɾ]（[ˈwɑːɾɚ]）也不是 SSBE。",
        "合成语音一般不读喉塞。想听真实的例子，可以在 BBC Learning English 等节目里留意 not now、that one、football 这类短语。",
      ],
      phonemes: [
        { ipa: "ʔb", word: "football", wordIpa: "ˈfʊtbɔːl", cue: "常读 [ˈfʊʔbɔːl]" },
        { ipa: "ʔn", word: "not now", wordIpa: "nɒt ˈnaʊ", cue: "常读 [nɒʔ ˈnaʊ]" },
        { ipa: "t", word: "better", wordIpa: "ˈbetə", cue: "元音之间：清楚的 [t]" },
      ],
      visual: "articulators",
      source: "Lindsey《English After RP》（2019）关于现代 SSBE 喉塞的描述",
    },
    {
      id: "d10-use",
      title: "自己说的时候怎么办",
      paragraphs: [
        "听：全部要会。这是今天的主要目标。",
        "说：省音和同化不用练，语速自然提起来时会自己发生。如果刻意去「省」，反而容易把该有的音也丢掉。",
        "喉塞：可以只在最常见的几个位置用（football、not now、that one、it's quite），其它地方读清楚的 t 也完全是标准的 SSBE。千万不要在元音之间用喉塞或弹舌。",
      ],
    },
  ],
  listen: [
    { id: "d10-l1", text: "next week. last time. old man.", note: "/t d/ 省音。" },
    { id: "d10-l2", text: "Tell him. Ask her. Did he call?", note: "/h/ 脱落。" },
    { id: "d10-l3", text: "camera. family. chocolate. interesting.", note: "/ə/ 脱落：每个词少一个音节。" },
    { id: "d10-l4", text: "ten boys. ten cups. in Paris. in Cambridge.", note: "/n/ 的部位同化（合成语音可能读得比较完整）。" },
    { id: "d10-l5", text: "this shop. this year. would you. don't you.", note: "同化成 /ʃ/、/dʒ/、/tʃ/。" },
    { id: "d10-l6", text: "football. not now. that one.", note: "辅音前的 t：SSBE 常读喉塞。合成语音通常读成 [t]。" },
    { id: "d10-l7", text: "water. better. a lot of. get up.", note: "元音之间的 t：SSBE 读清楚的 [t]。" },
  ],
  identify: [
    know("k1", "elision-assimilation", "next week 在自然语速中最常省略哪个音？", ["/k/", "/t/", "/w/"], 1, "/kst w/ 三个辅音挤在一起，中间的 /t/ 最容易消失。"),
    know("k2", "elision-assimilation", "tell him 中 him 不重读时，常读成？", ["/hɪm/", "/ɪm/"], 1, "不重读的代词 him、her、he 常脱落 /h/，连到前一个词上：tel‿lim。"),
    know("k3", "elision-assimilation", "family 在 SSBE 中通常有几个音节？", ["2 个 /ˈfæmli/", "3 个 /ˈfæməli/ 是唯一读法"], 0, "非重读的 /ə/ 常脱落：/ˈfæmli/。三个音节的读法也存在，但更慢、更正式。"),
    know("k4", "assimilation-place", "ten cups 快速说时，ten 的 /n/ 常变成？", ["/m/", "/ŋ/", "/n/ 不变"], 1, "/n/ 在软腭音 /k/ 前同化为 /ŋ/：[teŋ kʌps]。"),
    know("k5", "assimilation-place", "this shop 快速说时，this 的 /s/ 常变成？", ["/z/", "/ʃ/", "消失"], 1, "/s/ 在 /ʃ/ 前同化为 /ʃ/：[ðɪʃ ʃɒp]。"),
    know("k6", "glottal-t", "现代 SSBE 中，哪个 t 最可能读成喉塞 [ʔ]？", ["water", "not now", "a lot of"], 1, "not now：t 在辅音 /n/ 前。water 和 a lot of 的 t 在两个元音之间，SSBE 读清楚的 [t]。"),
    know("k7", "glottal-t", "把 better 读成 [ˈbeʔə] 是？", ["标准 SSBE", "伦敦口音（Cockney / Estuary）的特征"], 1, "元音之间用喉塞是伦敦口音的特征。SSBE 在这里读清楚的 [t]。"),
    know("k8", "glottal-t", "把 water 读成 [ˈwɔːɾə]（像 d 的弹舌）是？", ["SSBE", "美式口音的特征"], 1, "弹舌 t 是美式的特征，SSBE 读 [ˈwɔːtə]。"),
    hearQ("h1", "elision-assimilation", "你听到的是哪一句？", "Did you tell him?", ["Did you tell him?", "Did you tell them?"], 0, "him 弱读成 /ɪm/，连在 tell 后面；them 弱读是 /ðəm/，有 /ð/。"),
    hearQ("h2", "elision-assimilation", "camera 你听到了几个音节？", "camera", ["2 个", "3 个"], 0, "SSBE 常读 /ˈkæmrə/，两个音节。如果你听到三个，说明这个合成语音读得比较慢。"),
    hearQ("h3", "elision-assimilation", "你听到的是哪一句？", "Would you like some?", ["Would you like some?", "Do you like some?"], 0, "would you 同化为 /wʊdʒu/：开头有 /w/ 和 /ʊ/，中间是 /dʒ/。"),
  ],
  produce: [
    { id: "d10-p1", text: "next week, last time, old man, kept quiet", ipa: "neks ˈwiːk, lɑːs ˈtaɪm, əʊl ˈmæn, kep ˈkwaɪət", cue: "先完整慢说，再提速。提速后让中间的 t/d 自己消失，不要刻意。", skill: "elision-assimilation" },
    { id: "d10-p2", text: "tell him, ask her, did he", ipa: "ˈtel ɪm, ˈɑːsk ə, ˈdɪd i", cue: "代词不重读时去掉 /h/，直接连到前一个词上：tel‿lim、ask‿ə。", skill: "elision-assimilation" },
    { id: "d10-p3", text: "camera, family, chocolate, interesting", ipa: "ˈkæmrə, ˈfæmli, ˈtʃɒklət, ˈɪntrəstɪŋ", cue: "按音标说：两个、两个、两个、三个音节。", skill: "elision-assimilation" },
    { id: "d10-p4", text: "ten boys, ten cups, this shop, this year", ipa: "ten ˈbɔɪz, ten ˈkʌps, ðɪs ˈʃɒp, ðɪs ˈjɪə", cue: "慢速完整说一遍，再快速说一遍，感受舌尖不回齿龈时音的变化。", skill: "assimilation-place" },
    { id: "d10-p5", text: "football, not now, that one, quite good", ipa: "ˈfʊtbɔːl, nɒt ˈnaʊ, ðæt ˈwʌn, kwaɪt ˈɡʊd", cue: "t 的位置声门短暂关闭（像 uh-oh 中间那一下），舌尖不用碰齿龈。", skill: "glottal-t" },
    { id: "d10-p6", text: "water, better, a lot of, get up", ipa: "ˈwɔːtə, ˈbetə, ə ˈlɒt əv, ɡet ˈʌp", cue: "对照练习：元音之间的 t 舌尖碰齿龈，清楚爆破，不弹舌、不用喉塞。", skill: "glottal-t" },
  ],
  shadow: [
    { id: "d10-s1", text: "I'll see you next week, at the same time.", marked: "I'll SEE you next WEEK, | at the SAME TIME.", ipa: "aɪl ˈsiː ju neks ˈwiːk | ət ðə ˈseɪm ˈtaɪm", focus: "next week 省 t；same time 的 /m/ 合并。", skill: "elision-assimilation" },
    { id: "d10-s2", text: "Did you tell him about the party?", marked: "Did‿you TELL‿him about the PARty? ↗", ipa: "ˈdɪdʒu ˈtel ɪm əˈbaʊt ðə ˈpɑːti ↗", focus: "did you 同化；him 脱落 /h/；party 的 t 清楚（元音之间）。", skill: "elision-assimilation" },
    { id: "d10-s3", text: "Ten people came in by the main gate.", marked: "TEN PEOple came IN | by the MAIN GATE.", ipa: "ten ˈpiːpl keɪm ˈɪn | baɪ ðə ˈmeɪn ˈɡeɪt", focus: "ten people [tem]、main gate [meɪŋ]：听懂即可，自己说可完整。", skill: "assimilation-place" },
    { id: "d10-s4", text: "It's not that bad, but it's quite late.", marked: "It's NOT that BAD, | but it's QUITE LATE.", ipa: "ɪts ˈnɒt ðæt ˈbæd | bət ɪts ˈkwaɪt ˈleɪt", focus: "not that、quite late：t 在辅音前，可用喉塞。", skill: "glottal-t" },
    { id: "d10-s5", text: "There's a lot of water in the bottle.", marked: "There's a LOT of WAter | in the BOTtle.", ipa: "ðəz ə ˈlɒt əv ˈwɔːtər ɪn ðə ˈbɒtl", focus: "lot of、water：元音之间的 t 清楚；water in 有连接 r；bottle 的 /tl/ 舌尖保持在齿龈，侧面放气。", skill: "glottal-t" },
  ],
  reviewPrompts: ["今天的听力材料里，哪种变化让你最意外？", "你自己说 water、better 时，t 是清楚的 [t] 吗？", "有没有为了「地道」刻意省音，结果把该有的音也丢了？"],
  skills: ["elision-assimilation", "assimilation-place", "glottal-t"],
};
