import type { DayPlan, QuizItem } from "../types";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d19-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d19-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

export const day19: DayPlan = {
  day: 19,
  title: "-ed 和 -s 词尾",
  titleEn: "-ed & -s Endings",
  outcome: "按前一个音判断 -ed 读 /t/ /d/ /ɪd/、-s 读 /s/ /z/ /ɪz/；词尾不丢、不加元音，并能和下一个词连起来。",
  minMinutes: 60,
  blocks: { understand: 15, perceive: 30, shadow: 30, review: 10 },
  intro: "中文没有词尾辅音的变化，所以中国学生说英语时最常丢的就是 -ed 和 -s：I walk to work yesterday、She like it。另一种常见问题是加元音：walked 读成 walk-ed，两个音节。规则其实只有一条：看前一个音是清音、浊音，还是同类的音。",
  learn: [
    {
      id: "d19-ed",
      title: "-ed 的三种读法",
      paragraphs: [
        "规则看的是动词原形最后一个「音」，不是字母：",
      ],
      bullets: [
        "/t/ 和 /d/ 之后 → /ɪd/，多一个音节：wanted /ˈwɒntɪd/、needed /ˈniːdɪd/、started",
        "其它清辅音之后（/p k f s ʃ tʃ θ/）→ /t/：walked /wɔːkt/、stopped、laughed、watched、missed",
        "浊辅音和元音之后 → /d/：opened /ˈəʊpənd/、lived、played、called、tried",
      ],
      source: "Day 4 清浊辅音的应用",
    },
    {
      id: "d19-s",
      title: "-s 的三种读法（复数、第三人称、所有格）",
      paragraphs: [
        "同样看前一个音：",
      ],
      bullets: [
        "咝音 /s z ʃ ʒ tʃ dʒ/ 之后 → /ɪz/，多一个音节：buses、watches、pages、James's",
        "其它清辅音之后（/p t k f θ/）→ /s/：cups、cats、books、months",
        "浊辅音和元音之后 → /z/：dogs /dɒɡz/、days、lives、knows、Anna's",
        "is 和 has 缩略成 's 时也遵守这条规则：It's /ɪts/、John's /dʒɒnz/、the bus's late /ˈbʌsɪz/。",
      ],
    },
    {
      id: "d19-link",
      title: "词尾和下一个词：不丢、不加元音、要连",
      paragraphs: [
        "后面是元音时，把词尾辅音挪到下一个词：walked‿in /wɔːk tɪn/、lives‿in /lɪv zɪn/。这样词尾最清楚。",
        "后面是辅音时，-ed 的 /t/ /d/ 可以不爆破，但要保留那个停顿：walked to → /wɔːk(t) tə/、opened the → /ˈəʊpənd ðə/。不要完全丢掉。",
        "不要在词尾后面加 /ə/：asked 不是 /ˈɑːskədə/，books 不是 /ˈbʊksə/。",
      ],
      bullets: ["She lived in Leeds.", "We walked to the park.", "He watches it every day."],
    },
  ],
  listen: [
    { id: "d19-l1", text: "walked, opened, wanted", note: "/t/、/d/、/ɪd/。" },
    { id: "d19-l2", text: "stopped, played, needed", note: "/t/、/d/、/ɪd/。" },
    { id: "d19-l3", text: "cats, dogs, buses", note: "/s/、/z/、/ɪz/。" },
    { id: "d19-l4", text: "She lived in Leeds for two years.", note: "lived‿in 连读。" },
    { id: "d19-l5", text: "He watches the news every evening.", note: "watches /ɪz/、news /z/。" },
    { id: "d19-l6", text: "We walked to the station and waited for the bus.", note: "walked /t/、waited /ɪd/。" },
  ],
  identify: [
    know("k1", "ed-endings", "stopped 结尾的 -ed 读？", ["/t/", "/d/", "/ɪd/"], 0, "p 是清辅音，-ed 读 /t/。"),
    know("k2", "ed-endings", "played 结尾的 -ed 读？", ["/t/", "/d/", "/ɪd/"], 1, "元音之后，-ed 读 /d/。"),
    know("k3", "ed-endings", "decided 有几个音节？", ["2 个", "3 个"], 1, "de-ci-ded：d 后的 -ed 读 /ɪd/，多一个音节。"),
    know("k4", "s-endings", "watches 结尾的 -es 读？", ["/s/", "/z/", "/ɪz/"], 2, "tʃ 是咝音，读 /ɪz/。"),
    know("k5", "s-endings", "books 结尾的 -s 读？", ["/s/", "/z/", "/ɪz/"], 0, "k 是清辅音，读 /s/。"),
    know("k6", "s-endings", "knows 结尾的 -s 读？", ["/s/", "/z/", "/ɪz/"], 1, "/əʊ/ 是元音，读 /z/。"),
    hearQ("h1", "ed-endings", "你听到的是？", "I walked to work.", ["I walk to work.", "I walked to work."], 1, "walked 的 /t/ 和 to 的 /t/ 合在一起，形成一个稍长的停顿。"),
    hearQ("h2", "s-endings", "你听到的是？", "She likes it.", ["She like it.", "She likes it."], 1, "likes‿it 连读成 /laɪk sɪt/。"),
    hearQ("h3", "ed-endings", "你听到的是？", "They wanted it.", ["They want it.", "They wanted it."], 1, "wanted 多一个音节 /ɪd/。"),
    hearQ("h4", "s-endings", "你听到的是？", "the bus's late", ["the bus late", "the bus is late"], 1, "bus's /ˈbʌsɪz/：is 缩略后在 s 后读 /ɪz/。"),
  ],
  produce: [
    { id: "d19-p1", text: "walked, stopped, laughed, watched", ipa: "wɔːkt, stɒpt, lɑːft, wɒtʃt", cue: "都是一个音节，结尾 /t/ 很轻，不要加元音。", skill: "ed-endings" },
    { id: "d19-p2", text: "opened, lived, played, called", ipa: "ˈəʊpənd, lɪvd, pleɪd, kɔːld", cue: "结尾 /d/ 声带振动；called 的暗 l 后接 /d/。", skill: "ed-endings" },
    { id: "d19-p3", text: "wanted, needed, started, decided", ipa: "ˈwɒntɪd, ˈniːdɪd, ˈstɑːtɪd, dɪˈsaɪdɪd", cue: "/ɪd/ 是短而轻的音节，不重读。", skill: "ed-endings" },
    { id: "d19-p4", text: "cats, books, months; dogs, days, knows; buses, watches, pages", ipa: "kæts, bʊks, mʌnθs; dɒɡz, deɪz, nəʊz; ˈbʌsɪz, ˈwɒtʃɪz, ˈpeɪdʒɪz", cue: "三组分别是 /s/、/z/、/ɪz/。", skill: "s-endings" },
    { id: "d19-p5", text: "She lived in Leeds. He likes it a lot.", ipa: "ʃi ˈlɪvd ɪn ˈliːdz. hi ˈlaɪks ɪt ə ˈlɒt", cue: "lived‿in、likes‿it 把词尾挪到下一个词。", skill: "consonant-linking" },
    { id: "d19-p6", text: "I asked him. She washed it. They mixed them.", ipa: "aɪ ˈɑːskt ɪm. ʃi ˈwɒʃt ɪt. ðeɪ ˈmɪkst ðəm", cue: "/skt/、/ʃt/、/kst/ 辅音丛：不加元音。asked 英式 /ɑː/。", skill: "clusters" },
  ],
  shadow: [
    { id: "d19-s1", text: "Last summer we stayed in a small village and walked to the beach every day.", marked: "LAST SUMmer | we STAYED in a SMALL VILLage | and WALKED to the BEACH | EVery DAY.", ipa: "ˈlɑːst ˈsʌmə | wi ˈsteɪd ɪn ə ˈsmɔːl ˈvɪlɪdʒ | ən ˈwɔːkt tə ðə ˈbiːtʃ | ˈevri ˈdeɪ", focus: "stayed /d/ 连 in；walked /t/ 接 to。", skill: "ed-endings" },
    { id: "d19-s2", text: "She works in an office and takes the bus to work.", marked: "She WORKS in an OFfice | and TAKES the BUS to WORK.", ipa: "ʃi ˈwɜːks ɪn ən ˈɒfɪs | ən ˈteɪks ðə ˈbʌs tə ˈwɜːk", focus: "works‿in、takes 的 /s/；work 和 office 的英式元音。", skill: "s-endings" },
    { id: "d19-s3", text: "He wanted to go, but he needed to finish his reports first.", marked: "He WANTed to GO, | but he NEEDed to FINish his rePORTS FIRST.", ipa: "hi ˈwɒntɪd tə ˈɡəʊ | bət hi ˈniːdɪd tə ˈfɪnɪʃ ɪz rɪˈpɔːts ˈfɜːst", focus: "两个 /ɪd/；reports /ts/；first 的 t 在句末清楚。", skill: "ed-endings" },
    { id: "d19-s4", text: "James's flat is next to the shops on Church Street.", marked: "JAMES's FLAT | is NEXT to the SHOPS | on CHURCH Street.", ipa: "ˈdʒeɪmzɪz ˈflæt | ɪz ˈneks tə ðə ˈʃɒps | ɒn ˈtʃɜːtʃ striːt", focus: "James's /ɪz/；next to 的 t 省音；Church Street 复合词前重。", skill: "s-endings" },
  ],
  reviewPrompts: ["听回自己的录音：过去时的 -ed 有没有丢？有没有多加一个元音？", "-s 词尾你最容易丢在哪种情况：复数、第三人称，还是所有格？", "用三个过去时动词说说你昨天做了什么。"],
  skills: ["ed-endings", "s-endings", "consonant-linking"],
};
