// Content integrity and pure-logic checks. Run: npm run test:logic
import assert from "node:assert/strict";
import { DAYS } from "../content/days";
import { SKILL_MAP, matchSkills } from "../content/skills";
import { BASELINE_QUIZ, BASELINE_RECORD } from "../content/baseline";
import { BASELINE2_QUIZ, BASELINE2_RECORD } from "../content/baseline2";
import { WEEKS, weekOf } from "../content/days";
import { addDays, applyDailyResult, dailyQueue, streak, syncDaily, DAILY_INTERVALS } from "../lib/daily";
import { fileBase, isLocalRequest } from "../lib/backupServer";
import { initialState } from "../lib/store";
import { planFor, shortPlan, SHORT, dueReviews } from "../lib/progress";
import { checkAccentDifference } from "../lib/elsa";
import { analyzeSentence } from "../lib/coach";

let n = 0;
const ok = (cond: unknown, msg: string) => { assert.ok(cond, msg); n++; };

assert.equal(DAYS.length, 14);
DAYS.forEach((d, i) => assert.equal(d.day, i + 1, `DAYS[${i}] is Day ${d.day}`));
// ids are unique across the whole course, except the baseline items that are reused on purpose
const seenIds = new Map<string, number>();
for (const d of DAYS) for (const x of [...d.learn, ...d.listen, ...d.identify, ...d.produce, ...d.shadow]) {
  if (/^(base|b2)-/.test(x.id)) continue;
  ok(!seenIds.has(x.id), `id ${x.id} on Day ${d.day} already used on Day ${seenIds.get(x.id)}`);
  seenIds.set(x.id, d.day);
}
for (const d of DAYS) {
  const ids = new Set<string>();
  const all = [...d.learn, ...d.listen, ...d.identify, ...d.produce, ...d.shadow].map((x) => x.id);
  for (const id of all) { ok(!ids.has(id), `Day ${d.day}: duplicate id ${id}`); ids.add(id); }
  for (const q of d.identify) {
    ok(SKILL_MAP[q.skill], `Day ${d.day} quiz ${q.id}: unknown skill ${q.skill}`);
    ok(q.answer >= 0 && q.answer < q.options.length, `Day ${d.day} quiz ${q.id}: bad answer index`);
    if (q.kind === "hear") ok(q.say, `Day ${d.day} quiz ${q.id}: hear item without audio text`);
  }
  for (const p of d.produce) ok(SKILL_MAP[p.skill], `Day ${d.day} drill ${p.id}: unknown skill ${p.skill}`);
  for (const s of d.shadow) ok(SKILL_MAP[s.skill], `Day ${d.day} shadow ${s.id}: unknown skill ${s.skill}`);
  for (const s of d.skills) ok(SKILL_MAP[s], `Day ${d.day}: unknown day skill ${s}`);
  const mins = Object.values(d.blocks).reduce((a, b) => a + b, 0);
  ok(mins >= 60 && mins <= 90, `Day ${d.day}: block total ${mins} outside 60–90`);
  ok(d.minMinutes <= mins, `Day ${d.day}: minMinutes above target`);
}
// Day 1 and Day 7 share the comparable set
const d1 = DAYS[0], d7 = DAYS[6];
for (const q of BASELINE_QUIZ) { ok(d1.identify.some((x) => x.id === q.id), `baseline ${q.id} missing on Day 1`); ok(d7.identify.some((x) => x.id === q.id), `baseline ${q.id} missing on Day 7`); }
for (const r of BASELINE_RECORD) { ok(d1.shadow.some((x) => x.id === r.id), `baseline rec ${r.id} missing on Day 1`); ok(d7.shadow.some((x) => x.id === r.id), `baseline rec ${r.id} missing on Day 7`); }

// Day 8 and Day 14 share the Week 2 comparable set
const d8 = DAYS[7], d14 = DAYS[13];
for (const q of BASELINE2_QUIZ) { ok(d8.identify.some((x) => x.id === q.id), `w2 baseline ${q.id} missing on Day 8`); ok(d14.identify.some((x) => x.id === q.id), `w2 baseline ${q.id} missing on Day 14`); }
for (const r of BASELINE2_RECORD) { ok(d8.shadow.some((x) => x.id === r.id), `w2 baseline rec ${r.id} missing on Day 8`); ok(d14.shadow.some((x) => x.id === r.id), `w2 baseline rec ${r.id} missing on Day 14`); }
ok(weekOf(1).week === 1 && weekOf(7).week === 1 && weekOf(8).week === 2 && weekOf(14).week === 2, "weekOf");
ok(WEEKS.every((w) => w.baselineDay === w.firstDay && w.retestDay === w.lastDay), "weeks open with a baseline and end with a re-test");
// IPA fields use IPA, not capitals (stress is marked with ˈ)
for (const d of DAYS) for (const x of [...d.produce, ...d.shadow]) if (x.ipa) ok(!/[A-Z]/.test(x.ipa), `Day ${d.day} ${x.id}: capital letter in IPA`);

// daily review
{
  const s0 = initialState();
  const today = "2026-10-24";
  ok(addDays(today, 1) === "2026-10-25" && addDays("2026-10-31", 1) === "2026-11-01", "addDays");
  s0.errors.push({ id: "e1", createdAt: "", day: 1, source: "quiz", skill: "ʊ-uː", text: "pull" });
  s0.errors.push({ id: "e2", createdAt: "", day: 1, source: "quiz", skill: "voicing", text: "van", resolved: true });
  let q = dailyQueue(s0, today);
  ok(q.items.length === 1 && q.items[0].skill === "ʊ-uː", "unresolved error enters the daily queue; resolved one does not");
  s0.daily = syncDaily(s0, today);
  applyDailyResult(s0.daily, "ʊ-uː", true, today);
  ok(s0.daily.items["ʊ-uː"].due === addDays(today, DAILY_INTERVALS[1]), "correct answer pushes the next review out");
  q = dailyQueue(s0, today);
  ok(q.doneToday.includes("ʊ-uː") && q.streak === 1, "done today and streak 1");
  ok(dailyQueue(s0, addDays(today, 1)).items.length === 0, "nothing due tomorrow");
  applyDailyResult(s0.daily, "ʊ-uː", false, addDays(today, 2));
  ok(s0.daily.items["ʊ-uː"].stage === 0 && s0.daily.items["ʊ-uː"].due === addDays(today, 3), "a miss comes back the next day");
  ok(streak(s0.daily, addDays(today, 2)) === 1, "streak breaks after a skipped day");
  let d = today;
  for (let i = 0; i < DAILY_INTERVALS.length; i++) { applyDailyResult(s0.daily, "ʊ-uː", true, d); d = s0.daily.items["ʊ-uː"].due; }
  ok(s0.daily.items["ʊ-uː"].mastered, "mastered after passing every interval");
  s0.errors.push({ id: "e3", createdAt: "", day: 9, source: "self", skill: "ʊ-uː", text: "book" });
  s0.daily = syncDaily(s0, d);
  ok(!s0.daily.items["ʊ-uː"].mastered && s0.daily.items["ʊ-uː"].stage === 0, "a new mistake brings a mastered skill back");
}

// automatic backup helpers
ok(fileBase("rec-abc") !== fileBase("rec-abd") && /^[A-Za-z0-9._-]+$/.test(fileBase("a cup of tea / 茶?")), "backup file names are safe and distinct");
ok(isLocalRequest(new Request("http://localhost:3000/api/backup", { headers: { host: "localhost:3000" } })), "localhost allowed");
ok(!isLocalRequest(new Request("http://evil.example/api/backup", { headers: { host: "evil.example" } })), "other hosts refused");

// matchSkills
ok(matchSkills("three 发成了 free, th 不对").includes("θ-s"), "th error maps to θ-s");
ok(matchSkills("bad 和 bed 分不清").includes("æ-e"), "bad/bed maps to æ-e");
ok(matchSkills("重音放错了").includes("word-stress"), "stress maps to word-stress");

// ELSA accent-difference rules
ok(checkAccentDifference("car", "missing r sound").length > 0, "rhotic r is accent difference");
ok(checkAccentDifference("water", "t should be a flap").length > 0, "flap t is accent difference");
ok(checkAccentDifference("ask", "vowel should be /æ/").length > 0, "BATH /æ/ is accent difference");
ok(checkAccentDifference("think", "th sounded like s").length === 0, "th→s is a real error");
ok(checkAccentDifference("ship", "vowel too long, sounds like sheep").length === 0, "ship/sheep is a real error");

// sentence analysis
const toks = analyzeSentence("I was going to ask for some of them, but they were sold out.");
ok(toks.find((t) => t.clean === "for")?.weak === "fə", "for weak form");
ok(toks.find((t) => t.clean === "them")?.pauseAfter, "pause after comma");
ok(analyzeSentence("far away").find((t) => t.clean === "far")?.linkNext === "linking-r", "linking r detected");
ok(analyzeSentence("turn it off").find((t) => t.clean === "turn")?.linkNext === "consonant-vowel", "C+V linking detected");

// short lessons
for (const d of DAYS) {
  const q = shortPlan(d);
  ok(Object.values(q.blocks).reduce((a, b) => a + b, 0) === 30, `Day ${d.day} short blocks add up to 30`);
  ok(q.learn.length === Math.min(SHORT.learn, d.learn.length) && q.listen.length <= SHORT.listen && q.produce.length <= SHORT.produce, `Day ${d.day} short trims content`);
  ok(q.learn.every((x, i, a) => i === 0 || d.learn.indexOf(x) > d.learn.indexOf(a[i - 1])), `Day ${d.day} short keeps learn order`);
  const baseQ = d.identify.filter((x) => /^(base|b2)-/.test(x.id));
  if (baseQ.length) ok(q.identify.length === baseQ.length, `Day ${d.day} short keeps every baseline question`);
  const baseR = d.shadow.filter((x) => x.baseline);
  if (baseR.length) ok(q.shadow.length === baseR.length, `Day ${d.day} short keeps every baseline recording`);
  ok(q.shadow.length > 0 && q.identify.length > 0 && q.learn.length > 0, `Day ${d.day} short is not empty`);
  ok(JSON.stringify(shortPlan(q)) === JSON.stringify(q), `Day ${d.day} shortPlan is idempotent`);
  ok(planFor(d, undefined) === d, "no record → full plan");
}
{
  const st = initialState();
  for (let i = 0; i < 10; i++) st.reviews.push({ id: `r${i}`, skill: "θ-s", createdDay: 1, dueDay: 2, stage: 0, history: [], mastered: false } as never);
  ok(dueReviews(st, 2).length === 6 && dueReviews(st, 2, SHORT.reviews).length === 3, "short lessons cap reviews at 3");
}

console.log(`logic tests passed: ${n} checks`);
