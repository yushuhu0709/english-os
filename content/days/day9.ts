import type { DayPlan, QuizItem } from "../types";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d9-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d9-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

export const day9: DayPlan = {
  day: 9,
  title: "连读与滑音",
  titleEn: "Linking & Glides",
  outcome: "掌握三种连接：辅音 + 元音、元音 + 元音（滑音 /j/ /w/ 和连接 r）、辅音 + 辅音（合并与不爆破）。",
  minMinutes: 60,
  blocks: { understand: 20, perceive: 35, shadow: 25, review: 10 },
  intro: "Day 6 入门过辅音 + 元音的连读和连接 r。今天把词与词之间所有可能的接法补全。目标不是「练出连读」，而是去掉词与词之间多余的停顿、喉塞和小元音。",
  learn: [
    {
      id: "d9-cv",
      title: "辅音 + 元音：词尾辅音挪到下一个词",
      paragraphs: [
        "回顾 Day 6：同一意群里，词尾辅音接到下一个元音上：an apple → a‿napple，turn it off → tur‿ni‿toff。",
        "词尾是辅音丛时，最后一个辅音挪过去：asked a question → /ɑːsk tə ˈkwestʃən/，picked it up → /pɪk tɪ tʌp/，next of kin。",
        "SSBE 的 t 在元音前保持清楚的 [t]：get up、put it on、a lot of。不弹舌成美式的 [ɾ]，也不换成喉塞。",
      ],
      phonemes: [
        { ipa: "k‿t‿ɪ", word: "picked it up", wordIpa: "ˈpɪkt ɪt ˈʌp", cue: "t 挪到 it 上" },
        { ipa: "t‿ə", word: "a lot of", wordIpa: "ə ˈlɒt əv", cue: "清楚的 [t]" },
        { ipa: "t‿ʌ", word: "get up", wordIpa: "ɡet ˈʌp", cue: "不弹舌" },
      ],
      source: "《1000小时》4.4 连接",
    },
    {
      id: "d9-glide",
      title: "元音 + 元音：滑音 [j] 和 [w]",
      paragraphs: [
        "前一个词以元音结尾、后一个词以元音开头时，英语不会停顿，而是用一个很轻的滑音把两个元音接起来。",
        "前一个元音是 /iː ɪ eɪ aɪ ɔɪ/（舌头在前、偏高）时，滑音是 [j]：see it [siːʲɪt]，I agree [aɪʲəˈɡriː]，the end [ðiʲend]，say again。",
        "前一个元音是 /uː ʊ əʊ aʊ/（嘴唇收圆）时，滑音是 [w]：do it [duːʷɪt]，go out [ɡəʊʷaʊt]，how are you，two eggs。",
        "滑音不需要刻意发，只要不停、不加喉塞，舌头和嘴唇从第一个元音滑向第二个元音时就会自然产生。",
      ],
      phonemes: [
        { ipa: "iːʲɪ", word: "see it", wordIpa: "ˈsiː ɪt", cue: "[j] 滑音" },
        { ipa: "aɪʲə", word: "I agree", wordIpa: "aɪ əˈɡriː", cue: "[j] 滑音" },
        { ipa: "uːʷɪ", word: "do it", wordIpa: "ˈduː ɪt", cue: "[w] 滑音" },
        { ipa: "əʊʷaʊ", word: "go out", wordIpa: "ɡəʊ ˈaʊt", cue: "[w] 滑音" },
      ],
    },
    {
      id: "d9-r",
      title: "元音 + 元音：连接 r 和插入 r",
      paragraphs: [
        "以 /ɑː ɔː ɜː ə ɪə eə/ 结尾、拼写有 r 的词，后接元音时 r 出现：far away，better off，mother and father，where is it。这是 SSBE 里最典型的连读，一定要会。",
        "以 /ɑː ɔː ə ɪə/ 结尾、拼写没有 r 的词，很多 SSBE 说话者也会加 r：law and order [lɔːr ən ˈɔːdə]，the idea of it，China and Japan。这叫插入 r，能听懂即可，自己说时可加可不加。",
        "后面是辅音时没有 r：far from，better than，four people。",
      ],
      phonemes: [
        { ipa: "ər‿ɒ", word: "better off", wordIpa: "ˈbetər ˈɒf", cue: "连接 r" },
        { ipa: "ər‿ə", word: "mother and father", wordIpa: "ˈmʌðər ən ˈfɑːðə", cue: "father 后没有 r" },
        { ipa: "ɔːr‿ə", word: "law and order", wordIpa: "ˈlɔːr ən ˈɔːdə", cue: "插入 r（可选）" },
      ],
      source: "Cruttenden（linking /r/ 与 intrusive /r/）",
    },
    {
      id: "d9-cc",
      title: "辅音 + 辅音：合并与不爆破",
      paragraphs: [
        "相同的辅音相遇只发一次，持续得稍长：big game [bɪɡːeɪm]，black coffee，some money，bus stop。",
        "爆破音 /p b t d k g/ 后面紧跟另一个爆破音时，前一个只做好口型、憋住气，不放气：good boy，hot dog，stop talking，looked back。",
        "常见错误是在辅音后加一个小元音：big-ə game、good-ə boy。这会多出音节，节奏马上变慢。",
      ],
      phonemes: [
        { ipa: "ɡː", word: "big game", wordIpa: "bɪɡ ˈɡeɪm", cue: "只发一次 g，稍长" },
        { ipa: "d̚b", word: "good boy", wordIpa: "ɡʊd ˈbɔɪ", cue: "d 不爆破" },
        { ipa: "p̚t", word: "stop talking", wordIpa: "stɒp ˈtɔːkɪŋ", cue: "p 不爆破" },
      ],
      source: "《1000小时》4.4（失去爆破）",
    },
    {
      id: "d9-chinese",
      title: "为什么中国学习者容易断开",
      paragraphs: [
        "普通话里「爱」「安」「欧」这类零声母字，开头常带一个轻微的喉塞。把这个习惯带进英语，an egg、go out、the end 中间就会出现一个小停顿。",
        "检查方法：把短语慢慢说一遍，注意两个词之间嗓子有没有「卡」一下。如果有，把两个词当成一个词来说：aneg、goʷout。",
      ],
    },
  ],
  listen: [
    { id: "d9-l1", text: "picked it up. a lot of. get up.", note: "辅音挪到下一个元音上；t 清楚。" },
    { id: "d9-l2", text: "see it. I agree. the end.", note: "[j] 滑音。" },
    { id: "d9-l3", text: "do it. go out. how are you?", note: "[w] 滑音。" },
    { id: "d9-l4", text: "far away. better off. mother and father.", note: "连接 r。" },
    { id: "d9-l5", text: "law and order. the idea of it.", note: "插入 r：能听懂即可。" },
    { id: "d9-l6", text: "big game. black coffee. some money.", note: "相同辅音合并。" },
    { id: "d9-l7", text: "good boy. hot dog. stop talking.", note: "不爆破。" },
    { id: "d9-l8", text: "Go out and do it again.", note: "两处 [w]，一处辅音 + 元音。" },
  ],
  identify: [
    know("k1", "glides", "see it 中间出现的滑音是？", ["[j]", "[w]", "[r]"], 0, "/iː/ 舌位在前、偏高，滑向下一个元音时产生 [j]。"),
    know("k2", "glides", "go out 中间出现的滑音是？", ["[j]", "[w]", "[r]"], 1, "/əʊ/ 结尾嘴唇收圆，滑向 /aʊ/ 时产生 [w]。"),
    know("k3", "glides", "two eggs 中间出现的滑音是？", ["[j]", "[w]", "没有，要停顿"], 1, "/uː/ 后接元音出现 [w]：[tuːʷeɡz]。"),
    know("k4", "linking-r", "SSBE 中 better than 的 better 后面有没有 r 音？", ["有", "没有"], 1, "后面是辅音 /ð/，r 不出现：/ˈbetə ðən/。"),
    know("k5", "linking-r", "SSBE 中 better off 的 better 后面有没有 r 音？", ["有，连接 r", "没有"], 0, "后面是元音开头的 off：/ˈbetər ˈɒf/。"),
    know("k6", "linking-r", "law and order 中的 r 属于？", ["连接 r（拼写里有 r）", "插入 r（拼写里没有 r）"], 1, "law 拼写里没有 r，这个 r 是插入的。很多 SSBE 说话者会这样说，可以听懂即可。"),
    know("k7", "consonant-linking", "big game 中有几个 /ɡ/ 的爆破？", ["一个，稍长", "两个，中间有元音"], 0, "相同辅音合并为一个，持续稍长。"),
    know("k8", "consonant-linking", "good boy 中的 /d/ 怎么处理？", ["完整爆破，后面加 /ə/", "做好口型但不放气，直接接 /b/"], 1, "爆破音后接爆破音时，前一个不释放。"),
    hearQ("h1", "linking", "你听到的是哪个短语？", "an ice cream", ["an ice cream", "a nice cream"], 0, "Day 6 的老题。连读后两者几乎相同，看看你现在能否听出 /n/ 的归属。"),
    hearQ("h2", "glides", "你听到的是哪个短语？", "the end", ["the end", "the hand"], 0, "the end 中间是 [j] 滑音 [ðiʲend]，没有 /h/ 的气流。"),
    hearQ("h3", "linking-r", "你听到的是哪个短语？", "far away", ["far away", "a far way"], 0, "far away：连接 r 把两个词接起来，重音在 away 的 -way 上。"),
    hearQ("h4", "linking", "这句话里的 t 是怎么读的？", "Put it on.", ["清楚的 [t]，接到 it 上", "弹舌 [ɾ]，像美式 d"], 0, "SSBE 元音之间的 t 保持清楚的 [t]。"),
  ],
  produce: [
    { id: "d9-p1", text: "picked it up, asked a question, a lot of", ipa: "ˈpɪkt ɪt ˈʌp, ˈɑːskt ə ˈkwestʃən, ə ˈlɒt əv", cue: "把词尾的 t 挪到下一个元音上：pick-ti-tup。t 清楚，不弹舌。", skill: "linking" },
    { id: "d9-p2", text: "see it, I agree, the end, say again", ipa: "ˈsiː ɪt, aɪ əˈɡriː, ði ˈend, ˈseɪ əˈɡen", cue: "两个元音之间不停顿，舌头从前一个元音滑过去，自然带出 [j]。", skill: "glides" },
    { id: "d9-p3", text: "do it, go out, how are you, two eggs", ipa: "ˈduː ɪt, ɡəʊ ˈaʊt, ˈhaʊ ə ˈjuː, ˈtuː ˈeɡz", cue: "嘴唇从圆唇状态打开时，自然带出 [w]。", skill: "glides" },
    { id: "d9-p4", text: "far away, better off, mother and father", ipa: "ˈfɑːr əˈweɪ, ˈbetər ˈɒf, ˈmʌðər ən ˈfɑːðə", cue: "先说 far（无 r）、再说 far away（轻 r）。father 在句末，没有 r。", skill: "linking-r" },
    { id: "d9-p5", text: "big game, black coffee, some money, bus stop", ipa: "bɪɡ ˈɡeɪm, blæk ˈkɒfi, səm ˈmʌni, ˈbʌs stɒp", cue: "相同辅音只做一次动作，保持稍久再放开。", skill: "consonant-linking" },
    { id: "d9-p6", text: "good boy, hot dog, stop talking, looked back", ipa: "ɡʊd ˈbɔɪ, ˈhɒt dɒɡ, stɒp ˈtɔːkɪŋ, lʊkt ˈbæk", cue: "第一个爆破音憋住不放气，直接做第二个。不要加 /ə/。", skill: "consonant-linking" },
  ],
  shadow: [
    { id: "d9-s1", text: "Pick it up and put it on the table.", marked: "PICK‿it‿UP | and PUT‿it‿on the TAble.", ipa: "ˈpɪk ɪt ˈʌp | ən ˈpʊt ɪt ɒn ðə ˈteɪbl", focus: "辅音 + 元音连读；t 清楚。", skill: "linking" },
    { id: "d9-s2", text: "I agree. Let's go out and do it again.", marked: "I‿aGREE. | Let's GO‿OUT | and DO‿it‿aGAIN.", ipa: "aɪ əˈɡriː | lets ɡəʊ ˈaʊt | ən ˈduː ɪt əˈɡen", focus: "三处滑音：I‿agree [j]，go‿out [w]，do‿it [w]。", skill: "glides" },
    { id: "d9-s3", text: "My mother and father are away at the moment.", marked: "My MOTHer‿and FATHer‿are aWAY | at the MOment.", ipa: "maɪ ˈmʌðər ən ˈfɑːðər ər əˈweɪ | ət ðə ˈməʊmənt", focus: "三处连接 r：mother‿and、father‿are、are‿away。", skill: "linking-r" },
    { id: "d9-s4", text: "We had a big game last night, and the black team won.", marked: "We had a BIG GAME last NIGHT, | and the BLACK TEAM WON.", ipa: "wi hæd ə ˈbɪɡ ˈɡeɪm lɑːs ˈnaɪt | ən ðə ˈblæk ˈtiːm ˈwʌn", focus: "big game 合并；black team 中 k 不爆破；last night 省 t。", skill: "consonant-linking" },
    { id: "d9-s5", text: "How are you? I haven't seen you for ages.", marked: "HOW‿are YOU? | I HAVen't SEEN you for‿AGes.", ipa: "ˈhaʊ ə ˈjuː | aɪ ˈhævnt ˈsiːn ju fər ˈeɪdʒɪz", focus: "how‿are 的 [w]；for‿ages 的连接 r。", skill: "linking-r" },
  ],
  reviewPrompts: ["你的录音里，两个元音之间有没有「卡」一下的喉塞？", "连接 r 自然吗？有没有在辅音前也加了 r？", "big game、good boy 这类组合，有没有加多余的 /ə/？"],
  skills: ["linking", "glides", "linking-r", "consonant-linking"],
};
