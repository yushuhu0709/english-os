import type { DayPlan, QuizItem } from "../types";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d11-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d11-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

export const day11: DayPlan = {
  day: 11,
  title: "节奏、复合词与重音转移",
  titleEn: "Rhythm, Compounds & Stress Shift",
  outcome: "让句子有英语的节奏：重音拍子稳定、弱读音节压缩；分清复合词与词组，掌握重音转移和 -teen / -ty。",
  minMinutes: 60,
  blocks: { understand: 20, perceive: 35, shadow: 25, review: 10 },
  intro: "Day 5 学了单词重音和句子重音。今天把重音放回节奏里：英语听起来像「哒-嘀嘀-哒-嘀-哒」，重音是拍子，弱读音节挤在拍子之间。再加上三个很实用的规律：复合词、重音转移和数字。",
  learn: [
    {
      id: "d11-rhythm",
      title: "重音计时：拍子稳定，中间压缩",
      paragraphs: [
        "下面三句话的重音都只有三个（CATS、CHASE、MICE），所以说出来的时长应该差不多：中间的弱读音节越多，就说得越快。",
        "练法：一边轻轻拍手，一边说。每个重音对准一拍，拍子的速度不变。",
        "这正是 Day 8 弱读的用处：功能词不压缩，拍子就会被拖慢，句子就失去英语的节奏。",
      ],
      bullets: ["CATS | CHASE | MICE.", "The CATS | will CHASE | the MICE.", "The CATS | have been CHASing | the MICE."],
      visual: "stressGrid",
      source: "《1000小时》4.5 节奏；马徐骏 03（重音节拍）",
    },
    {
      id: "d11-compound",
      title: "复合词：GREENhouse 和 green HOUSE",
      paragraphs: [
        "大多数复合名词（两个词合成一个概念）重音在第一部分：GREENhouse（温室），BLACKbird（乌鸫），BUS stop，POST office，CAR park，TEXT message，BEDroom。",
        "形容词 + 名词的普通词组重音在名词：a green HOUSE（一栋绿色的房子），a black BIRD（一只黑色的鸟）。",
        "也有例外：town HALL，Christmas DAY，apple PIE。不确定时查词典（Cambridge Dictionary 会标重音）。",
      ],
      phonemes: [
        { ipa: "ˈɡriːnhaʊs", word: "greenhouse", wordIpa: "ˈɡriːnhaʊs", cue: "复合词：重音在前" },
        { ipa: "ˌɡriːn ˈhaʊs", word: "a green house", wordIpa: "ə ˌɡriːn ˈhaʊs", cue: "词组：重音在后" },
        { ipa: "ˈbʌs stɒp", word: "bus stop", wordIpa: "ˈbʌs stɒp", cue: "复合词" },
        { ipa: "ˈpəʊst ɒfɪs", word: "post office", wordIpa: "ˈpəʊst ɒfɪs", cue: "复合词" },
      ],
    },
    {
      id: "d11-shift",
      title: "重音转移：afterNOON → AFternoon TEA",
      paragraphs: [
        "有些词有两个重音，主重音在后：afterNOON，JapaNESE，thirTEEN，PiccaDILly，unKNOWN。",
        "当它们放在一个重读的名词前面时，主重音会前移到前面的次重音上，这样两个重音就不会挨在一起：AFternoon TEA，JApanese FOOD，THIRteen PEOple，an UNknown ARtist。",
        "单独说或放在句末时，重音回到原位：It's in the afterNOON。She's JapaNESE。",
      ],
      phonemes: [
        { ipa: "ˌɑːftəˈnuːn", word: "afternoon", wordIpa: "ˌɑːftəˈnuːn", cue: "单独说：重音在后" },
        { ipa: "ˈɑːftənuːn ˈtiː", word: "afternoon tea", wordIpa: "ˌɑːftənuːn ˈtiː", cue: "名词前：前移" },
        { ipa: "ˌdʒæpəˈniːz", word: "Japanese", wordIpa: "ˌdʒæpəˈniːz", cue: "单独说" },
        { ipa: "ˈdʒæpəniːz ˈfuːd", word: "Japanese food", wordIpa: "ˌdʒæpəniːz ˈfuːd", cue: "名词前：前移" },
      ],
      source: "Cruttenden（stress shift / rhythm rule）",
    },
    {
      id: "d11-teen",
      title: "-teen 和 -ty：13 还是 30？",
      paragraphs: [
        "这是英国人自己也经常要确认的地方（买票、报价、说门牌号）。",
        "thirteen /ˌθɜːˈtiːn/：-teen 重读，/iː/ 长，词尾的 /n/ 清楚。thirty /ˈθɜːti/：重音在前，-ty 短而轻，没有 n。",
        "SSBE 的 thirty、forty 中间是清楚的 [t]（不像美式弹成 [ɾ]）。",
        "放在名词前时 thirteen 的重音会前移（THIRteen POUNDS），这时只能靠 -teen 的长元音和 n 来区分，所以一定要把 /iːn/ 读足。",
      ],
      phonemes: [
        { ipa: "ˌθɜːˈtiːn", word: "thirteen", wordIpa: "ˌθɜːˈtiːn", cue: "后重、长、有 n" },
        { ipa: "ˈθɜːti", word: "thirty", wordIpa: "ˈθɜːti", cue: "前重、短" },
        { ipa: "ˌfɪfˈtiːn", word: "fifteen", wordIpa: "ˌfɪfˈtiːn", cue: "后重" },
        { ipa: "ˈfɪfti", word: "fifty", wordIpa: "ˈfɪfti", cue: "前重" },
      ],
    },
    {
      id: "d11-phrasal",
      title: "短语动词：重音在小品词上",
      paragraphs: [
        "短语动词的重音通常落在后面的小品词（副词）上：turn it OFF，give UP，pick me UP，find OUT，sit DOWN。",
        "由短语动词变来的名词，重音移到前面：a TAKEaway（外卖），a BREAKdown，a CHECK-in，a WARM-up。",
      ],
      bullets: ["Can you pick me UP at six? — I'll be at the PICK-up point.", "Let's warm UP. — That was a good WARM-up."],
    },
  ],
  listen: [
    { id: "d11-l1", text: "Cats chase mice. The cats will chase the mice. The cats have been chasing the mice.", note: "三句话，三个重音，时长接近。" },
    { id: "d11-l2", text: "greenhouse. a green house. blackbird. a black bird.", note: "复合词重音在前，词组重音在后。" },
    { id: "d11-l3", text: "bus stop. post office. car park. text message.", note: "复合名词。" },
    { id: "d11-l4", text: "afternoon. afternoon tea. Japanese. Japanese food.", note: "重音转移。" },
    { id: "d11-l5", text: "thirteen, thirty. fourteen, forty. fifteen, fifty.", note: "-teen 后重，-ty 前重。" },
    { id: "d11-l6", text: "It costs thirteen pounds. It costs thirty pounds.", note: "名词前 thirteen 前移，听 /iːn/。" },
    { id: "d11-l7", text: "Turn it off. Give up. A takeaway. A breakdown.", note: "短语动词与名词。" },
  ],
  identify: [
    hearQ("h1", "teen-ty", "你听到的数字是？", "sixteen", ["16", "60"], 0, "sixteen：-teen 重读、长、有 n。"),
    hearQ("h2", "teen-ty", "你听到的数字是？", "seventy", ["17", "70"], 1, "seventy /ˈsevnti/：重音在前，-ty 短。"),
    hearQ("h3", "teen-ty", "哪个站台？", "The train leaves from platform eighteen.", ["18", "80"], 0, "eighteen 在句末，重音在 -teen。"),
    hearQ("h4", "teen-ty", "多少钱？", "That's forty pounds, please.", ["14 镑", "40 镑"], 1, "forty：前重、短、没有 n。"),
    hearQ("h5", "compound-stress", "你听到的是？", "a blackbird", ["a BLACKbird（乌鸫）", "a black BIRD（黑色的鸟）"], 0, "复合名词重音在前。合成语音的重音不一定典型，以 Learn 的说明为准。"),
    know("k1", "compound-stress", "post office 的重音在哪里？", ["POST office", "post OFfice"], 0, "复合名词，重音在第一部分。"),
    know("k2", "compound-stress", "「一栋绿色的房子」的重音应该是？", ["a GREENhouse", "a green HOUSE"], 1, "形容词 + 名词的词组，重音在名词。GREENhouse 是温室。"),
    know("k3", "compound-stress", "afternoon tea 中 afternoon 的主重音在哪里？", ["AF-ter-noon", "af-ter-NOON"], 0, "后面接重读的 tea，主重音前移：AFternoon TEA。"),
    know("k4", "compound-stress", "She's Japanese. 句末的 Japanese 重音在？", ["JA-pa-nese", "ja-pa-NESE"], 1, "句末没有后接重读词，重音在原位：JapaNESE。"),
    know("k5", "teen-ty", "SSBE 中 thirty 中间的 t 怎么读？", ["清楚的 [t]", "弹舌 [ɾ]，像 d"], 0, "弹舌是美式特征。SSBE：/ˈθɜːti/，t 清楚。"),
    know("k6", "rhythm", "「The cats have been chasing the mice」有几个重音拍？", ["3 个", "5 个", "8 个"], 0, "CATS、CHASE、MICE 三个重音；其余音节压缩在拍子之间。"),
    know("k7", "sentence-stress", "Pick me up at six. 中 pick up 的重音在？", ["PICK", "UP"], 1, "短语动词重音在小品词：pick me UP。名词 a PICK-up 才是前重。"),
  ],
  produce: [
    { id: "d11-p1", text: "Cats chase mice. The cats will chase the mice. The cats have been chasing the mice.", ipa: "ˈkæts ˈtʃeɪs ˈmaɪs. ðə ˈkæts wl ˈtʃeɪs ðə ˈmaɪs. ðə ˈkæts əv bɪn ˈtʃeɪsɪŋ ðə ˈmaɪs", cue: "拍手：每句三拍，速度不变。第三句中间要说得很快。", skill: "rhythm" },
    { id: "d11-p2", text: "greenhouse, a green house, blackbird, a black bird", ipa: "ˈɡriːnhaʊs, ə ˌɡriːn ˈhaʊs, ˈblækbɜːd, ə ˌblæk ˈbɜːd", cue: "复合词：第一部分高而长，第二部分压低。词组：两个都重读，第二个最重。", skill: "compound-stress" },
    { id: "d11-p3", text: "bus stop, post office, car park, text message", ipa: "ˈbʌs stɒp, ˈpəʊst ɒfɪs, ˈkɑː pɑːk, ˈtekst mesɪdʒ", cue: "全部前重。car park 不卷舌：/ˈkɑː pɑːk/。", skill: "compound-stress" },
    { id: "d11-p4", text: "afternoon, afternoon tea; Japanese, Japanese food", ipa: "ˌɑːftəˈnuːn, ˌɑːftənuːn ˈtiː; ˌdʒæpəˈniːz, ˌdʒæpəniːz ˈfuːd", cue: "先单独说（后重），再接名词（前移）。afternoon 的 /ɑː/ 是英式。", skill: "compound-stress" },
    { id: "d11-p5", text: "thirteen, thirty; fourteen, forty; fifteen, fifty", ipa: "ˌθɜːˈtiːn, ˈθɜːti; ˌfɔːˈtiːn, ˈfɔːti; ˌfɪfˈtiːn, ˈfɪfti", cue: "-teen：/tiːn/ 拉长、n 发出来。-ty：一带而过。t 都清楚。", skill: "teen-ty" },
    { id: "d11-p6", text: "Turn it off. Give up. A takeaway. A breakdown.", ipa: "ˈtɜːn ɪt ˈɒf. ɡɪv ˈʌp. ə ˈteɪkəweɪ. ə ˈbreɪkdaʊn", cue: "动词：重音在后（OFF、UP）。名词：重音在前（TAKE、BREAK）。", skill: "sentence-stress" },
  ],
  shadow: [
    { id: "d11-s1", text: "I'd like a cup of tea and a piece of cake.", marked: "I'd LIKE a CUP of TEA | and a PIECE of CAKE.", ipa: "aɪd ˈlaɪk ə ˈkʌp əv ˈtiː | ənd ə ˈpiːs əv ˈkeɪk", focus: "五拍，拍子之间的 a / of / and 全部压缩。", skill: "rhythm" },
    { id: "d11-s2", text: "Meet me at the bus stop by the post office.", marked: "MEET me at the BUS stop | by the POST office.", ipa: "ˈmiːt mi ət ðə ˈbʌs stɒp | baɪ ðə ˈpəʊst ɒfɪs", focus: "两个复合名词都前重；meet me 的 t 可不爆破。", skill: "compound-stress" },
    { id: "d11-s3", text: "We had afternoon tea at a Japanese restaurant.", marked: "We had AFternoon TEA | at a JApanese RESTaurant.", ipa: "wi hæd ˌɑːftənuːn ˈtiː | ət ə ˌdʒæpəniːz ˈrestrɒnt", focus: "两处重音转移；restaurant 在 SSBE 常读两到三个音节 /ˈrestrɒnt/。", skill: "compound-stress" },
    { id: "d11-s4", text: "It's platform fifteen, not fifty.", marked: "It's PLATform fifTEEN, | NOT FIFty.", ipa: "ɪts ˈplætfɔːm ˌfɪfˈtiːn | ˈnɒt ˈfɪfti", focus: "对比：fifTEEN 和 FIFty 的重音位置。", skill: "teen-ty" },
    { id: "d11-s5", text: "Can you pick me up at six? I'll wait at the pick-up point.", marked: "Can you PICK me UP at SIX? ↗ | I'll WAIT at the PICK-up point.", ipa: "kən ju ˈpɪk mi ˈʌp ət ˈsɪks ↗ | aɪl ˈweɪt ət ðə ˈpɪk ʌp pɔɪnt", focus: "短语动词 pick me UP，名词 PICK-up。", skill: "sentence-stress" },
  ],
  reviewPrompts: ["拍手跟读时，你的拍子稳定吗？弱读部分压得够快吗？", "数字 -teen 和 -ty，你自己的录音里能听出区别吗？", "今天的复合词，有没有哪个你以前一直读错了重音？"],
  skills: ["rhythm", "compound-stress", "teen-ty", "sentence-stress"],
};
