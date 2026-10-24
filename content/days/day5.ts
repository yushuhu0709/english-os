import type { DayPlan, QuizItem } from "../types";

const stress = (id: string, word: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d5-${id}`, kind: "hear", prompt: `${word} 的主重音在哪个音节？`, say: word, options, answer, skill: "word-stress", explain,
});
const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d5-${id}`, kind: "know", prompt, options, answer, skill, explain,
});

export const day5: DayPlan = {
  day: 5,
  title: "单词与句子重音",
  titleEn: "Word & Sentence Stress",
  outcome: "理解音节、单词重音、句子重音和英语的重音节奏。",
  minMinutes: 60,
  blocks: { understand: 20, perceive: 40, shadow: 20, review: 10 },
  intro: "前四天练的是单个的音，今天开始练「轻重」。重音错了，音再准也可能听不懂；重音对了，个别音不准也常常能被理解。",
  learn: [
    {
      id: "d5-syllable",
      title: "音节：英语的节拍单位",
      paragraphs: [
        "一个音节通常以一个元音为核心，前后可以有辅音。英语允许很复杂的辅音丛：strengths /streŋθs/ 只有一个音节。",
        "音节数不能按元音字母去数：comfortable 在 SSBE 通常读三个音节 /ˈkʌmftəbl/，chocolate 读两个 /ˈtʃɒklət/。",
        "l、n 可以单独构成音节（bottle /ˈbɒtl/、button /ˈbʌtn/），这时没有元音。",
      ],
      source: "马徐骏 03（先拆音节，音节不能机械地数元音字母）；《1000小时》3.2（音节辅音）",
    },
    {
      id: "d5-word",
      title: "单词重音：更响、更长、更高",
      paragraphs: [
        "重读音节有三个特征：响度更大、时长更长、音高有变化；元音保持完整。非重读音节常常弱化为 /ə/ 或 /ɪ/。",
        "同一个词根加不同后缀，重音会移动：PHOtograph → phoTOgrapher → photoGRAPHic。每个词都要查词典确认，不能靠规则猜。",
        "点击下面的单词听重音，圆点大小表示轻重。",
      ],
      visual: "stressGrid",
      bullets: [
        "-ic、-ion 结尾：重音通常在它们前一个音节（ecoNOMic、eduCAtion）。",
        "-ity、-ical、-graphy 结尾：重音通常在它们前一个音节（possiBILity、phoTOgraphy）。",
        "这些只是线索，《1000小时》和马徐骏都提醒：以词典为准。",
      ],
      source: "马徐骏 03（倒数第三音节口诀不能覆盖所有词）",
    },
    {
      id: "d5-pairs",
      title: "重音改变词性：REcord / reCORD",
      paragraphs: [
        "一批双音节词作名词时重音在前，作动词时重音在后：a RE­cord /ˈrekɔːd/ → to reCORD /rɪˈkɔːd/；a PRESent → to preSENT；an OBject → to obJECT。",
        "注意非重读音节的元音也随之弱化：record 作动词时第一个音节是 /rɪ/。",
      ],
      phonemes: [
        { ipa: "ˈrekɔːd", word: "a record", wordIpa: "ə ˈrekɔːd", cue: "名词，重音在前" },
        { ipa: "rɪˈkɔːd", word: "to record", wordIpa: "tə rɪˈkɔːd", cue: "动词，重音在后" },
        { ipa: "ˈpreznt", word: "a present", wordIpa: "ə ˈpreznt", cue: "名词" },
        { ipa: "prɪˈzent", word: "to present", wordIpa: "tə prɪˈzent", cue: "动词" },
      ],
    },
    {
      id: "d5-sentence",
      title: "句子重音：实词重、功能词轻，焦点最重",
      paragraphs: [
        "句子里名词、实义动词、形容词、副词、否定词通常重读；冠词、介词、助动词、代词通常弱读（第三天学过）。",
        "每个意群里有一个最突出的重音，叫核心重音（nucleus），通常落在最后一个实词上。但当你要强调或对比某个信息时，核心重音会移动。",
        "马徐骏笔记里的例句：We need the RESULTS by Friday（要的是结果）/ We need the results by FRIDAY（截止日是周五）/ We NEED the results by Friday（一定要）。",
      ],
      source: "马徐骏 03（重点取决于语境）；《1000小时》4.5.2 强读",
    },
    {
      id: "d5-rhythm",
      title: "节奏：重音之间的距离大致相等",
      paragraphs: [
        "英语的节奏以重读音节为骨架。重音之间的弱读音节越多，就读得越快、越轻，让重音拍子大致均匀。中文的每个字长度接近，直接迁移会显得「一字一顿」。",
        "经典练习：CATS chase MICE → the CATS will CHASE the MICE → the CATS have been CHASing the MICE。三句话的重音拍子都是三个，尽量用相近的时间读完。",
      ],
      phonemes: [
        { ipa: "O o O", word: "cats chase mice", wordIpa: "ˈkæts ˈtʃeɪs ˈmaɪs", cue: "三个重音" },
        { ipa: "o O o O o O", word: "the cats will chase the mice", wordIpa: "ðə ˈkæts wɪl ˈtʃeɪs ðə ˈmaɪs", cue: "弱读加速" },
      ],
      source: "《1000小时》4.5.6 节奏与语速",
    },
  ],
  listen: [
    { id: "d5-l1", text: "photograph photographer photographic", ipa: "ˈfəʊtəɡrɑːf fəˈtɒɡrəfə ˌfəʊtəˈɡræfɪk", note: "重音每次都移动。" },
    { id: "d5-l2", text: "economy economic economics", ipa: "ɪˈkɒnəmi ˌiːkəˈnɒmɪk ˌiːkəˈnɒmɪks" },
    { id: "d5-l3", text: "comfortable chocolate vegetable", ipa: "ˈkʌmftəbl ˈtʃɒklət ˈvedʒtəbl", note: "比拼写少一个音节。" },
    { id: "d5-l4", text: "education possibility university", ipa: "ˌedʒuˈkeɪʃn ˌpɒsəˈbɪləti ˌjuːnɪˈvɜːsəti" },
    { id: "d5-l5", text: "a record. to record.", ipa: "ə ˈrekɔːd. tə rɪˈkɔːd" },
    { id: "d5-l6", text: "Cats chase mice.", ipa: "ˈkæts ˈtʃeɪs ˈmaɪs" },
    { id: "d5-l7", text: "The cats have been chasing the mice.", ipa: "ðə ˈkæts həv bɪn ˈtʃeɪsɪŋ ðə ˈmaɪs" },
    { id: "d5-l8", text: "We need the results by Friday.", ipa: "wi ˈniːd ðə rɪˈzʌlts baɪ ˈfraɪdeɪ" },
  ],
  identify: [
    stress("photograph", "photograph", ["PHO-to-graph", "pho-TO-graph", "pho-to-GRAPH"], 0, "/ˈfəʊtəɡrɑːf/：重音在第一个音节。"),
    stress("photographic", "photographic", ["PHO-to-gra-phic", "pho-TO-gra-phic", "pho-to-GRA-phic"], 2, "/ˌfəʊtəˈɡræfɪk/：-ic 前一个音节。"),
    stress("economy", "economy", ["E-co-no-my", "e-CO-no-my", "e-co-NO-my"], 1, "/ɪˈkɒnəmi/。"),
    stress("education", "education", ["ED-u-ca-tion", "ed-u-CA-tion", "ed-U-ca-tion"], 1, "/ˌedʒuˈkeɪʃn/：-tion 前一个音节。"),
    stress("possibility", "possibility", ["POS-si-bi-li-ty", "pos-si-BI-li-ty", "pos-SI-bi-li-ty"], 1, "/ˌpɒsəˈbɪləti/：-ity 前一个音节。"),
    stress("comfortable", "comfortable", ["COM-for-ta-ble", "com-FOR-ta-ble", "com-for-TA-ble"], 0, "/ˈkʌmftəbl/：重音在第一音节，而且通常只有三个音节。"),
    stress("hotel", "hotel", ["HO-tel", "ho-TEL"], 1, "/həʊˈtel/：重音在后。"),
    stress("develop", "develop", ["DE-ve-lop", "de-VE-lop", "de-ve-LOP"], 1, "/dɪˈveləp/。"),
    stress("interesting", "interesting", ["IN-ter-est-ing", "in-TER-est-ing", "in-ter-EST-ing"], 0, "/ˈɪntrəstɪŋ/：重音在第一个音节。"),
    stress("advertisement", "advertisement", ["AD-ver-tise-ment", "ad-VER-tise-ment", "ad-ver-TISE-ment"], 1, "英式 /ədˈvɜːtɪsmənt/，重音在第二音节（美式常在第三音节）。"),
    {
      id: "d5-record-n", kind: "hear", prompt: "这里的 record 是名词还是动词？", say: "a record", options: ["名词 REcord", "动词 reCORD"], answer: 0, skill: "word-stress",
      explain: "a record /ə ˈrekɔːd/：名词重音在前。",
    },
    {
      id: "d5-record-v", kind: "hear", prompt: "这里的 record 是名词还是动词？", say: "to record", options: ["名词 REcord", "动词 reCORD"], answer: 1, skill: "word-stress",
      explain: "to record /tə rɪˈkɔːd/：动词重音在后，第一个音节弱化为 /rɪ/。",
    },
    know("k1", "sentence-stress", "「We need the results by Friday.」如果在回答「你们什么时候要结果？」，核心重音落在？", ["need", "results", "Friday"], 2, "新信息是时间，所以重音在 FRIDAY。"),
    know("k2", "sentence-stress", "「I didn't say he stole it.」如果意思是「是别人说的，不是我」，重读哪个词？", ["I", "say", "stole"], 0, "对比说话人时重读 I。重音位置改变，意思也改变。"),
    know("k3", "sentence-stress", "下列哪个词在句中通常不重读？", ["important", "the", "never"], 1, "冠词 the 是功能词，弱读 /ðə/；否定词 never 通常重读。"),
    know("k4", "rhythm", "英语的节奏更接近？", ["每个音节等长", "重音之间的时间大致相等"], 1, "英语重音计时（stress-timed）倾向，弱读音节被压缩。"),
    know("k5", "word-stress", "chocolate 在 SSBE 通常有几个音节？", ["2", "3", "4"], 0, "/ˈtʃɒklət/：两个音节。"),
  ],
  produce: [
    { id: "d5-p1", text: "photograph photographer photographic", ipa: "ˈfəʊtəɡrɑːf fəˈtɒɡrəfə ˌfəʊtəˈɡræfɪk", cue: "边说边拍手，在重读音节上拍得更重；非重读元音变成 /ə/。", skill: "word-stress" },
    { id: "d5-p2", text: "economy economic", ipa: "ɪˈkɒnəmi ˌiːkəˈnɒmɪk", cue: "e-CO-no-my vs e-co-NO-mic，重读元音读饱满。", skill: "word-stress" },
    { id: "d5-p3", text: "comfortable chocolate vegetable", ipa: "ˈkʌmftəbl ˈtʃɒklət ˈvedʒtəbl", cue: "第一个音节重，后面压缩。", skill: "word-stress" },
    { id: "d5-p4", text: "a record, to record", ipa: "ə ˈrekɔːd, tə rɪˈkɔːd", cue: "名词重音在前，动词重音在后。", skill: "word-stress" },
    { id: "d5-p5", text: "Cats chase mice.", ipa: "ˈkæts ˈtʃeɪs ˈmaɪs", cue: "三个拍子，用手指敲桌子打拍。", skill: "rhythm" },
    { id: "d5-p6", text: "The cats have been chasing the mice.", ipa: "ðə ˈkæts həv bɪn ˈtʃeɪsɪŋ ðə ˈmaɪs", cue: "同样三个拍子，弱读部分加速塞进去。", skill: "rhythm" },
    { id: "d5-p7", text: "We need the results by Friday.", ipa: "wi ˈniːd ðə rɪˈzʌlts baɪ ˈfraɪdeɪ", cue: "读三遍，每遍把核心重音放在不同的词上：NEED / RESULTS / FRIDAY。", skill: "sentence-stress" },
    { id: "d5-p8", text: "I didn't say he stole it.", ipa: "aɪ ˈdɪdnt ˈseɪ hi ˈstəʊl ɪt", cue: "轮流重读 I / say / he / stole，体会意思的变化。", skill: "sentence-stress" },
  ],
  shadow: [
    { id: "d5-s1", text: "The photographer took a photograph.", marked: "The phoTOGrapher TOOK a PHOtograph.", ipa: "ðə fəˈtɒɡrəfə ˈtʊk ə ˈfəʊtəɡrɑːf", focus: "两个词的重音位置不同。", skill: "word-stress" },
    { id: "d5-s2", text: "The economy is the main economic problem.", marked: "The eCONomy is the MAIN ecoNOMic PROBlem.", ipa: "ði ɪˈkɒnəmi ɪz ðə ˈmeɪn ˌiːkəˈnɒmɪk ˈprɒbləm", focus: "economy / economic 的重音移动。", skill: "word-stress" },
    { id: "d5-s3", text: "We need the results by Friday.", marked: "We need the results by FRIday.", ipa: "wi ˈniːd ðə rɪˈzʌlts baɪ ˈfraɪdeɪ", focus: "中性读法：核心重音在 Friday。录完后再自己试另外两种重音。", skill: "sentence-stress" },
    { id: "d5-s4", text: "The cats have been chasing the mice.", marked: "the CATS have been CHASing the MICE.", ipa: "ðə ˈkæts həv bɪn ˈtʃeɪsɪŋ ðə ˈmaɪs", focus: "三个重音拍子，弱读部分快而轻。", skill: "rhythm" },
    { id: "d5-s5", text: "It's not the price, it's the quality.", marked: "It's NOT the PRICE, | it's the QUALity.", ipa: "ɪts ˈnɒt ðə ˈpraɪs | ɪts ðə ˈkwɒləti", focus: "对比重音：price 与 quality；quality 的 /ɒ/。", skill: "sentence-stress" },
    { id: "d5-s6", text: "I'd like to record a new record next week.", marked: "I'd LIKE to reCORD a NEW REcord NEXT WEEK.", ipa: "aɪd ˈlaɪk tə rɪˈkɔːd ə ˈnjuː ˈrekɔːd ˈnekst ˈwiːk", focus: "动词 reCORD 与名词 REcord；new 的英式 /njuː/。", skill: "word-stress" },
  ],
  reviewPrompts: ["哪类词的重音你最常放错？", "读句子时能不能做到只突出一个核心重音？", "录音里的节奏是「一字一顿」还是有快有慢？"],
  skills: ["word-stress", "sentence-stress", "rhythm"],
};
