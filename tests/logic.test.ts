// Content integrity and pure-logic checks. Run: npm run test:logic
import assert from "node:assert/strict";
import { DAYS } from "../content/days";
import { SKILL_MAP, matchSkills } from "../content/skills";
import { BASELINE_QUIZ, BASELINE_RECORD } from "../content/baseline";
import { checkAccentDifference } from "../lib/elsa";
import { analyzeSentence } from "../lib/coach";

let n = 0;
const ok = (cond: unknown, msg: string) => { assert.ok(cond, msg); n++; };

assert.equal(DAYS.length, 7);
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

console.log(`logic tests passed: ${n} checks`);
