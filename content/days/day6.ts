import type { DayPlan, QuizItem } from "../types";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d6-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d6-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

export const day6: DayPlan = {
  day: 6,
  title: "自然语流",
  titleEn: "Connected Speech",
  outcome: "练习连读、连接 r、意群停顿、语调，以及完整的跟读。",
  minMinutes: 60,
  blocks: { understand: 20, perceive: 35, shadow: 25, review: 10 },
  intro: "今天把前五天的音和重音放进真实的语流里。《1000小时》的建议是：研究连读之前，先研究「停」与「顿」。所以顺序是：意群 → 连读 → 语调 → 完整跟读。",
  learn: [
    {
      id: "d6-chunk",
      title: "意群：先断句，再连读",
      paragraphs: [
        "稍长的句子会被分成几个意群（sense group）。意群之间有短暂的停顿（可以换气，不连读）；意群内部要连贯，词与词之间几乎没有缝隙。",
        "断句位置会改变意思：Let's eat, | kids. 和 Let's eat kids. 只差一个停顿。",
        "做法：先在文本上用 | 标出意群，每个意群一口气读完，并找到它的核心重音（第五天学过）。",
      ],
      bullets: [
        "When I got home | I made some tea.",
        "If you have time | give me a call.",
        "My sister, | who lives in Bristol, | is a doctor.",
      ],
      source: "《1000小时》4.3 意群（停与顿）",
    },
    {
      id: "d6-link",
      title: "辅音 + 元音：自然连读",
      paragraphs: [
        "同一个意群里，前一个词以辅音结尾、后一个词以元音开头时，辅音会自然地接到后面的元音上：an apple → a‿napple，turn it off → tur‿ni‿toff。",
        "《1000小时》的观点很实用：不必刻意「练连读」，只要前一个辅音的动作完整、后一个元音说得清楚，连读会自然发生。需要注意的是 /l/：舌尖必须完整贴住齿龈，才连得上（feel it, all of us）。",
        "英式的 t 在连读里仍是清晰的 [t]：get it 读 /ɡe‿tɪt/，不读成美式的 [ɡeɾɪt]。",
      ],
      phonemes: [
        { ipa: "n‿æ", word: "an apple", wordIpa: "ən ˈæpl", cue: "n 接到 apple 上" },
        { ipa: "n‿ɪ‿t", word: "turn it off", wordIpa: "ˈtɜːn ɪt ˈɒf", cue: "连成一串" },
        { ipa: "l‿ə", word: "all of us", wordIpa: "ˈɔːl əv əs", cue: "舌尖贴住齿龈再接元音" },
      ],
      source: "《1000小时》4.4 连接（辅音 + 元音）",
    },
    {
      id: "d6-r",
      title: "英式特有：连接 r 与插入 r",
      paragraphs: [
        "SSBE 不卷舌，所以 far、four、here 单独说时没有 r。但当后面紧跟元音开头的词，r 会重新出现，这叫连接 r（linking r）：far away /fɑːr əˈweɪ/，four apples /fɔːr ˈæplz/。",
        "很多 SSBE 说话者在拼写里没有 r 的地方也会加一个，叫插入 r（intrusive r）：idea of /aɪˈdɪər əv/，law and order。这是自然的口语现象，可以听懂即可，不必刻意模仿。",
        "这一点和美式完全不同：美式在所有 r 处都卷舌；英式只在元音前出现 r。",
      ],
      phonemes: [
        { ipa: "ɑːr‿ə", word: "far away", wordIpa: "ˈfɑːr əˈweɪ", cue: "轻轻的 r 连接" },
        { ipa: "ɔːr‿æ", word: "four apples", wordIpa: "ˈfɔːr ˈæplz", cue: "连接 r" },
        { ipa: "ɪər‿ə", word: "here and there", wordIpa: "ˈhɪər ən ˈðeə", cue: "here 后有 r，there 后没有" },
      ],
    },
    {
      id: "d6-other",
      title: "其它语流现象：省音、同化、加音",
      paragraphs: [
        "省音：辅音丛中间的 /t d/ 常常不爆破或消失：next day /neks deɪ/，last night /lɑːs naɪt/。",
        "同化：/t d/ 遇到 /j/ 常变成 /tʃ dʒ/：did you /dɪdʒu/，would you /wʊdʒu/，don't you /dəʊntʃu/。",
        "元音之间会加滑音：I am → /aɪʲæm/，go away → /ɡəʊʷəˈweɪ/。",
        "《1000小时》反复强调这些都是「可能」而不是规则。先能听懂，自己说的时候从慢速完整开始，再自然提速。",
      ],
      source: "《1000小时》4.4（省音、同化、加音）",
    },
    {
      id: "d6-tone",
      title: "语调：降调、升调、降升调",
      paragraphs: [
        "语调的变化集中在核心重音上。陈述句、wh- 问句通常以降调结束（↘）：Where do you LIVE? ↘。一般疑问句常用升调（↗）：Do you live in LONdon? ↗。",
        "降升调（↘↗）表示保留、未说完或委婉的对比：I like it, but… 在 SSBE 中很常见，听起来礼貌、留有余地。",
        "马徐骏笔记提醒：「先上后下的人字形」只是入门感受，不是所有句子的模板。语调要服务于你想表达的态度。",
      ],
      bullets: [
        "Where do you live? ↘（降调：真正在问信息）",
        "Do you live here? ↗（升调：是非问句）",
        "I'd love to, but… ↘↗（降升调：委婉拒绝）",
      ],
      source: "马徐骏 03（语调层面）；《1000小时》4.5.5 声调",
    },
  ],
  listen: [
    { id: "d6-l1", text: "When I got home, I made some tea.", note: "home 后停顿；made some 连贯。" },
    { id: "d6-l2", text: "Turn it off and pick it up.", note: "两组辅音 + 元音连读。" },
    { id: "d6-l3", text: "far away. four apples. here and there.", note: "连接 r。" },
    { id: "d6-l4", text: "Did you see him last night?", note: "did you 的同化；last night 的省音。" },
    { id: "d6-l5", text: "Where do you live?", note: "降调。" },
    { id: "d6-l6", text: "Do you live in London?", note: "升调。" },
    { id: "d6-l7", text: "My sister, who lives in Bristol, is a doctor.", note: "插入成分前后的停顿。" },
    { id: "d6-l8", text: "There are four of us here and there's room for more.", note: "多处连接 r 和弱读。" },
  ],
  identify: [
    hearQ("eat", "chunking", "你听到的是哪一句？", "Let's eat, kids.", ["Let's eat, kids.", "Let's eat kids."], 0, "eat 后有停顿：是在叫孩子吃饭。"),
    hearQ("ice", "linking", "你听到的是哪个短语？", "an ice cream", ["an ice cream", "a nice cream"], 0, "连读后两者非常接近，区别主要在 /n/ 归属哪个音节、/aɪ/ 前是否有微小停顿。听不出来很正常，这一题记录你的起点。"),
    hearQ("q1", "intonation", "这句话最后是升调还是降调？", "Where do you live?", ["降调 ↘", "升调 ↗"], 0, "wh- 问句通常用降调。（合成语音的语调可能不够典型，以 Learn 中的说明为准。）"),
    hearQ("q2", "intonation", "这句话最后是升调还是降调？", "Do you live in London?", ["降调 ↘", "升调 ↗"], 1, "一般疑问句通常用升调。"),
    know("k1", "linking-r", "SSBE 中 far away 的 far 后面有没有 r 音？", ["有，连接 r", "没有"], 0, "后面是元音开头的 away，r 重新出现：/fɑːr əˈweɪ/。"),
    know("k2", "linking-r", "SSBE 中单独说 far 时有没有 r 音？", ["有", "没有"], 1, "/fɑː/：元音后的 r 不发音。"),
    know("k3", "linking", "在 turn it off 中，n 和 t 会怎样？", ["分别接到后面的元音上", "前后都停顿", "都不发音"], 0, "tur‿ni‿toff：辅音接到下一个元音开头的词上。"),
    know("k4", "elision-assimilation", "did you 在快速口语中常读成？", ["/dɪd juː/ 完全分开", "/dɪdʒu/", "/dɪzu/"], 1, "/d/ + /j/ 同化为 /dʒ/。"),
    know("k5", "elision-assimilation", "next day 中最容易省略的音是？", ["/k/", "/t/", "/d/"], 1, "辅音丛 /kst d/ 中间的 /t/ 常省略：/neks deɪ/。"),
    know("k6", "chunking", "下面哪处停顿最自然？「If you have time give me a call.」", ["If you | have time give me a call", "If you have time | give me a call", "If you have time give | me a call"], 1, "条件从句结束后停顿。"),
    know("k7", "intonation", "I like it, but… 用降升调表示？", ["完全同意", "有保留、话没说完", "生气"], 1, "降升调常表示保留和委婉。"),
    know("k8", "linking", "英式的 get it 中的 t 怎么连读？", ["清晰的 [t] 接到 it 上", "弹舌成 [ɾ]"], 0, "SSBE 不弹舌：/ɡe tɪt/。"),
  ],
  produce: [
    { id: "d6-p1", text: "When I got home | I made some tea.", ipa: "wen aɪ ɡɒt ˈhəʊm | aɪ meɪd səm ˈtiː", cue: "home 处换气停顿；后半句一口气读完，重音在 tea。", skill: "chunking" },
    { id: "d6-p2", text: "turn it off, pick it up, look at it", ipa: "ˈtɜːn ɪt ˈɒf, ˈpɪk ɪt ˈʌp, ˈlʊk ət ɪt", cue: "慢速把辅音接到下一个元音上，再逐渐加速。", skill: "linking" },
    { id: "d6-p3", text: "far away, four apples, more of it", ipa: "ˈfɑːr əˈweɪ, ˈfɔːr ˈæplz, ˈmɔːr əv ɪt", cue: "先单独说 far（无 r），再说 far away（轻 r 连接）。", skill: "linking-r" },
    { id: "d6-p4", text: "did you, would you, don't you", ipa: "ˈdɪdʒu, ˈwʊdʒu, ˈdəʊntʃu", cue: "/d/ + /j/ → /dʒ/，/t/ + /j/ → /tʃ/。先慢后快。", skill: "elision-assimilation" },
    { id: "d6-p5", text: "Where do you live? Do you live here?", ipa: "ˈweə dʊ ju ˈlɪv ↘ | dʊ ju lɪv ˈhɪə ↗", cue: "第一句在 live 上下降；第二句在 here 上上升。", skill: "intonation" },
    { id: "d6-p6", text: "I'd love to, but I'm busy.", ipa: "aɪd ˈlʌv tuː ↘↗ | bət aɪm ˈbɪzi", cue: "to 上用降升调，表示委婉。句末的 to 用强读式 /tuː/。", skill: "intonation" },
  ],
  shadow: [
    { id: "d6-s1", text: "When I got home, I made some tea and called my mum.", marked: "When I got HOME, | I made some TEA | and called my MUM.", ipa: "wen aɪ ɡɒt ˈhəʊm | aɪ meɪd səm ˈtiː | ən kɔːld maɪ ˈmʌm", focus: "三个意群，每个一个核心重音。", skill: "chunking" },
    { id: "d6-s2", text: "Turn it off and pick it up.", marked: "TURN‿it‿OFF | and PICK‿it‿UP.", ipa: "ˈtɜːn ɪt ˈɒf | ən ˈpɪk ɪt ˈʌp", focus: "辅音 + 元音连读；t 清晰不弹舌。", skill: "linking" },
    { id: "d6-s3", text: "There are four of us here and there.", marked: "There‿are FOUR‿of‿us | HERE‿and THERE.", ipa: "ðeər ə ˈfɔːr əv əs | ˈhɪər ən ˈðeə", focus: "四处连接 r，句末 there 没有 r。", skill: "linking-r" },
    { id: "d6-s4", text: "Did you see him last night?", marked: "Did‿you SEE him | LAST NIGHT?", ipa: "ˈdɪdʒu ˈsiː ɪm ˈlɑːs ˈnaɪt", focus: "did you 同化；him 弱读 /ɪm/；last night 省音。", skill: "elision-assimilation" },
    { id: "d6-s5", text: "Do you live in London? No, I live in Bristol.", marked: "Do you LIVE in LONdon? ↗ | NO, | I live in BRIStol. ↘", ipa: "dʊ ju ˈlɪv ɪn ˈlʌndən ↗ | ˈnəʊ | aɪ ˈlɪv ɪn ˈbrɪstl ↘", focus: "升调提问、降调回答；Bristol 的 /ɒ/。", skill: "intonation" },
    { id: "d6-s6", text: "My sister, who lives in Bristol, is a doctor.", marked: "My SISter, | who LIVES in BRIStol, | is a DOCtor.", ipa: "maɪ ˈsɪstə | huː ˈlɪvz ɪn ˈbrɪstl | ɪz ə ˈdɒktə", focus: "插入成分前后停顿；doctor 的 /ɒ/ 和结尾 /ə/。", skill: "chunking" },
  ],
  reviewPrompts: ["录音里你的停顿位置和示范一致吗？", "连接 r 能自然发出来吗？有没有在不该有 r 的地方卷舌？", "升调和降调在录音里听得出来吗？"],
  skills: ["chunking", "linking", "linking-r", "elision-assimilation", "intonation"],
};
