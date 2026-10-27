import type { DayPlan, QuizItem } from "../types";

const know = (id: string, skill: string, prompt: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d17-${id}`, kind: "know", prompt, options, answer, skill, explain,
});
const hearQ = (id: string, skill: string, prompt: string, say: string, options: string[], answer: number, explain: string): QuizItem => ({
  id: `d17-${id}`, kind: "hear", prompt, say, options, answer, skill, explain,
});

export const day17: DayPlan = {
  day: 17,
  title: "礼貌与委婉",
  titleEn: "Polite Requests & Softening",
  outcome: "用 Could you / Would you mind / I was wondering if 提出请求；用 I'm afraid、Actually 委婉地拒绝或不同意；语调和弱读让句子听起来客气。",
  minMinutes: 60,
  blocks: { understand: 15, perceive: 30, shadow: 30, review: 10 },
  intro: "在英式英语里，一句话客不客气，很大程度取决于语调和缓冲词。同样是请人帮忙，Open the window, please 加上平平的降调，可能听起来像命令；Could you open the window? 用升调，就自然得多。今天练请求、回应请求和委婉地说「不」。",
  learn: [
    {
      id: "d17-ladder",
      title: "请求的几个层次",
      paragraphs: [
        "从随意到正式，大致是：",
      ],
      bullets: [
        "Can you pass me the salt? ↗（熟人之间）",
        "Could you send me the file? ↗（日常最常用）",
        "Would you mind closing the door? ↗（更客气，回答 No, not at all = 可以）",
        "I was wondering if you could help me with something. ↘↗（最委婉，常用在工作中）",
      ],
      source: "马徐骏 03（语调与态度）",
    },
    {
      id: "d17-sound",
      title: "怎么说才客气：弱读、同化和语调",
      paragraphs: [
        "请求句的开头说得轻快：could you /kʊdʒu/、would you /wʊdʒu/、can you /kən ju/。把力气留给关键的实词：Could you SEND me the FILE?",
        "结尾用升调 ↗ 或降升调 ↘↗，表示「如果方便的话」。用很重的降调，即使加了 please，也会显得在下命令。",
        "please 放在句末时轻读：Could you help me, please? ↗",
      ],
      bullets: ["Could you send me the file? ↗", "Would you mind waiting a moment? ↗", "Can you help me, please? ↗"],
    },
    {
      id: "d17-reply",
      title: "答应和婉拒",
      paragraphs: [
        "答应：Sure. / Of course. / No problem. / Yes, of course（用降调，干脆友好）。注意 Would you mind…? 的「可以」是 No, not at all. / No, go ahead.",
        "婉拒：先缓冲，再说原因。I'm afraid I can't. ↘↗ / I'd love to, but… ↘↗ / I'm not sure I can, actually. ↘↗",
        "I'm afraid 在这里不是「害怕」，而是「很抱歉地告诉你」。afraid 上常用降升调，留出余地。",
      ],
      bullets: ["Of course. ↘", "No, not at all. ↘", "I'm afraid I can't. ↘↗", "I'd love to, but I'm busy on Friday. ↘↗"],
    },
    {
      id: "d17-disagree",
      title: "委婉地不同意",
      paragraphs: [
        "英式英语很少直接说 No, you're wrong。常用的方式：",
      ],
      bullets: [
        "Actually, ↘↗ I think it's on Tuesday.",
        "I'm not sure about that. ↘↗",
        "That's true, ↘↗ but…",
        "I see what you mean, ↘↗ but…",
      ],
    },
  ],
  listen: [
    { id: "d17-l1", text: "Could you send me the file?", note: "could you 同化，句末升调。" },
    { id: "d17-l2", text: "Would you mind closing the door?", note: "would you /wʊdʒu/。" },
    { id: "d17-l3", text: "I was wondering if you could help me with something.", note: "最委婉的请求。" },
    { id: "d17-l4", text: "No, not at all.", note: "Would you mind 的「可以」。" },
    { id: "d17-l5", text: "I'm afraid I can't.", note: "婉拒：afraid 降升调。" },
    { id: "d17-l6", text: "I'd love to, but I'm busy on Friday.", note: "先接受，再说原因。" },
    { id: "d17-l7", text: "Actually, I think it's on Tuesday.", note: "委婉地纠正。" },
  ],
  identify: [
    know("k1", "polite-requests", "下面哪句最委婉？", ["Send me the file.", "Can you send me the file?", "I was wondering if you could send me the file."], 2, "I was wondering if… 是最委婉的请求方式之一。"),
    know("k2", "polite-requests", "「Would you mind waiting a moment?」你愿意等，应该说？", ["Yes, I mind.", "No, not at all.", "Yes, please."], 1, "mind = 介意。No, not at all = 不介意，可以。"),
    know("k3", "polite-requests", "「I'm afraid I can't come.」里的 I'm afraid 意思是？", ["我很害怕", "很抱歉地告诉你"], 1, "I'm afraid 用来委婉地带出坏消息或拒绝。"),
    know("k4", "polite-requests", "请求句「Could you help me, please」用哪种语调更客气？", ["升调 ↗", "很重的降调 ↘"], 0, "升调表示「如果方便的话」；重降调像命令。"),
    know("k5", "polite-requests", "请求句里，力气应该放在？", ["could you", "关键的实词，比如 SEND、FILE"], 1, "could you 轻快带过，重音留给实词。"),
    know("k6", "fall-rise", "「That's true, ↘↗ but…」里的降升调表示？", ["完全同意", "部分同意，接下来要说不同意见"], 1, "降升调表示保留：「但是……」。"),
    hearQ("h1", "polite-requests", "这是在请求还是在命令？", "Could you open the window?", ["请求 ↗", "命令 ↘"], 0, "Could you 开头、升调：客气的请求。"),
    hearQ("h2", "weak-forms", "这句话一共有几个词？", "Could you send me the file?", ["5 个", "6 个", "7 个"], 1, "Could you send me the file? 6 个词：could you 连成 /kʊdʒu/。"),
    hearQ("h3", "polite-requests", "说话人答应了吗？", "No, not at all.", ["答应了", "拒绝了"], 0, "这是对 Would you mind…? 的肯定回答。"),
    hearQ("h4", "polite-requests", "说话人答应了吗？", "I'm afraid I can't.", ["答应了", "拒绝了"], 1, "I'm afraid I can't = 很抱歉，不行。"),
  ],
  produce: [
    { id: "d17-p1", text: "Could you send me the file? Would you mind closing the door?", ipa: "kʊdʒu ˈsend mi ðə ˈfaɪl ↗. wʊdʒu ˈmaɪnd ˈkləʊzɪŋ ðə ˈdɔː ↗", cue: "could you /kʊdʒu/、would you /wʊdʒu/ 轻快带过；file 的暗 l；door 结尾不卷舌。", skill: "polite-requests" },
    { id: "d17-p2", text: "I was wondering if you could help me with something.", ipa: "aɪ wəz ˈwʌndərɪŋ ɪf ju kʊd ˈhelp mi wɪð ˈsʌmθɪŋ ↘↗", cue: "was 弱读；wondering 的 /ʌ/，连接 r；something 上降升调。", skill: "polite-requests" },
    { id: "d17-p3", text: "Of course. No problem. No, not at all.", ipa: "əv ˈkɔːs ↘. ˌnəʊ ˈprɒbləm ↘. ˈnəʊ | ˌnɒt ət ˈɔːl ↘", cue: "of course 的 /ɔː/；not at all 连读成 /nɒtəˈtɔːl/，t 可轻弹或喉塞。", skill: "linking" },
    { id: "d17-p4", text: "I'm afraid I can't. I'd love to, but I'm busy on Friday.", ipa: "aɪm əˈfreɪd aɪ ˈkɑːnt ↘↗. aɪd ˈlʌv tuː ↘↗ | bət aɪm ˈbɪzi ɒn ˈfraɪdeɪ ↘", cue: "afraid、love to 上降升调；can't 英式 /kɑːnt/；句末 to 强读 /tuː/。", skill: "fall-rise" },
    { id: "d17-p5", text: "Actually, I think it's on Tuesday.", ipa: "ˈæktʃuəli ↘↗ | aɪ ˈθɪŋk ɪts ɒn ˈtjuːzdeɪ ↘", cue: "actually 自成一个意群；Tuesday 英式 /ˈtjuːzdeɪ/，也常读 /ˈtʃuːzdeɪ/。", skill: "discourse-markers" },
    { id: "d17-p6", text: "I see what you mean, but I'm not sure.", ipa: "aɪ ˈsiː wɒtʃu ˈmiːn ↘↗ | bət aɪm ˈnɒt ˈʃɔː ↘", cue: "what you 同化为 /wɒtʃu/；mean 上降升调。", skill: "fall-rise" },
  ],
  shadow: [
    { id: "d17-s1", text: "Excuse me, could you tell me where the station is?", marked: "Excuse me, | could‿you TELL me | where the STAtion is? ↗", ipa: "ɪkˈskjuːz mi | kʊdʒu ˈtel mi | weə ðə ˈsteɪʃn ɪz ↗", focus: "间接问句语序：where the station is；excuse 作动词时 s 读 /z/。", skill: "polite-requests" },
    { id: "d17-s2", text: "Would you mind if I sat here? No, go ahead.", marked: "Would‿you MIND if I SAT here? ↗ | NO, go aHEAD. ↘", ipa: "wʊdʒu ˈmaɪnd ɪf aɪ ˈsæt hɪə ↗ | ˈnəʊ | ɡəʊ əˈhed ↘", focus: "go ahead 之间有 [w] 滑音。", skill: "polite-requests" },
    { id: "d17-s3", text: "I was wondering if we could move the meeting to Thursday.", marked: "I was WONdering | if we could MOVE the MEETing to THURSday. ↘↗", ipa: "aɪ wəz ˈwʌndərɪŋ | ɪf wi kʊd ˈmuːv ðə ˈmiːtɪŋ tə ˈθɜːzdeɪ ↘↗", focus: "工作中最常用的委婉请求；Thursday 的 th 和 /ɜː/。", skill: "polite-requests" },
    { id: "d17-s4", text: "I'd love to, but I'm afraid I'm busy that evening.", marked: "I'd LOVE to, ↘↗ | but I'm aFRAID | I'm BUSy that EVEning. ↘", ipa: "aɪd ˈlʌv tuː ↘↗ | bət aɪm əˈfreɪd | aɪm ˈbɪzi ðæt ˈiːvnɪŋ ↘", focus: "先接受再婉拒；evening 两个音节 /ˈiːvnɪŋ/。", skill: "fall-rise" },
    { id: "d17-s5", text: "Actually, I think the deadline is next Friday, not this one.", marked: "ACtually, ↘↗ | I think the DEADline is NEXT Friday, | not THIS one. ↘", ipa: "ˈæktʃuəli ↘↗ | aɪ θɪŋk ðə ˈdedlaɪn ɪz ˈneks ˈfraɪdeɪ | nɒt ˈðɪs wʌn ↘", focus: "对比重音 NEXT / THIS；next Friday 的 t 省音。", skill: "tonic" },
  ],
  reviewPrompts: ["你的请求句录音听起来客气吗？结尾是升调还是重降调？", "could you、would you 说得够轻快吗？", "工作中你最常需要用英语请求或婉拒什么？试着用今天的句型说一遍。"],
  skills: ["polite-requests", "fall-rise", "weak-forms"],
};
