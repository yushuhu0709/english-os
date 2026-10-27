// Every piece of text the course plays as a model, so real British recordings
// can be imported for all of them at once and matched to the right sentence.
import { DAYS } from "@/content/days";
import { shortPlan } from "./progress";

export type ModelKind = "listen" | "hear" | "produce" | "shadow" | "word";

export interface ModelText {
  id: string; // first item id that uses this text, e.g. "d2-l1"
  ids: string[]; // every item id that plays this exact text
  day: number;
  kind: ModelKind;
  text: string;
  key: string; // normalised text, the refAudio key
  short: boolean; // also used in the short version of its day
}

export const KIND_LABEL: Record<ModelKind, string> = {
  listen: "听示范",
  hear: "辨音",
  produce: "发音练习",
  shadow: "跟读",
  word: "例词",
};

// Same normalisation as audioDb.normKey (kept here so this file has no browser deps).
export const textKey = (text: string) => text.trim().toLowerCase().replace(/\s+/g, " ");
// Looser form for matching file names: letters, digits and apostrophes only.
const loose = (s: string) => s.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9']+/g, " ").trim();

export function courseTexts(): ModelText[] {
  const out = new Map<string, ModelText>();
  for (const full of DAYS) {
    const sp = shortPlan(full);
    const inShort = new Set([...sp.listen, ...sp.produce, ...sp.shadow, ...sp.identify].map((x) => x.id));
    const add = (id: string, kind: ModelKind, text: string | undefined, short: boolean) => {
      if (!text?.trim()) return;
      const key = textKey(text);
      const have = out.get(key);
      if (have) {
        if (!have.ids.includes(id)) have.ids.push(id);
        have.short ||= short;
        return;
      }
      out.set(key, { id, ids: [id], day: full.day, kind, text, key, short });
    };
    for (const sec of full.learn) sec.phonemes?.forEach((p, i) => add(`${sec.id}-w${i + 1}`, "word", p.word, false));
    for (const x of full.listen) add(x.id, "listen", x.text, inShort.has(x.id));
    for (const q of full.identify) if (q.kind === "hear") add(q.id, "hear", q.say, inShort.has(q.id));
    for (const x of full.produce) add(x.id, "produce", x.text, inShort.has(x.id));
    for (const x of full.shadow) add(x.id, "shadow", x.text, inShort.has(x.id));
  }
  return [...out.values()];
}

// Finds the course text a file belongs to. File names may be an item id
// ("d2-l1.m4a", "d2-l1 ship sheep.mp3", "07_d2-l1.wav") or the sentence itself
// ("Ship or sheep.mp3"). Returns null when nothing fits.
export function matchFile(fileName: string, texts: ModelText[]): ModelText | null {
  const base = fileName.replace(/^.*[\\/]/, "").replace(/\.[a-z0-9]{2,5}$/i, "");
  const lower = base.toLowerCase();
  const byId = new Map<string, ModelText>();
  for (const t of texts) for (const id of t.ids) byId.set(id.toLowerCase(), t);
  // longest id that appears as a whole token wins, so "d2-l10" beats "d2-l1"
  const ids = [...byId.keys()].sort((a, b) => b.length - a.length);
  for (const id of ids) {
    const re = new RegExp(`(^|[^a-z0-9-])${id.replace(/[-]/g, "\\-")}($|[^a-z0-9-])`);
    if (re.test(lower)) return byId.get(id)!;
  }
  const name = loose(base);
  if (!name) return null;
  return texts.find((t) => loose(t.text) === name) ?? null;
}

// A plain list to record from, or to name clips by. Opens in Numbers / Excel.
export function scriptCsv(texts: ModelText[]): string {
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const rows = texts.map((t) => [t.id, `Day ${t.day}`, KIND_LABEL[t.kind], t.short ? "是" : "", esc(t.text)].join(","));
  return ["文件名（不含扩展名）,天,类型,短课要用,文本", ...rows].join("\n") + "\n";
}
