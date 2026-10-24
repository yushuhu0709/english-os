"use client";

import { getRefAudio } from "./audioDb";
import { getState } from "./store";

// Model audio. Order of preference:
//   1. a human reference recording the learner imported for this exact text
//   2. the browser's British English (en-GB) speech-synthesis voice
// There is deliberately no fallback to American voices.

export type ModelSource = "human" | "tts-gb" | "none";

// Preferred British voices, best first. macOS names carry a quality suffix that
// is localised, e.g. "Jamie (Premium)" or "Jamie（高音质）", so quality is ranked
// separately from the base name.
const PREFERRED = [
  "Jamie", "Serena", "Daniel", "Kate", "Oliver", "Stephanie", "Arthur", "Martha",
  // Edge / Windows neural
  "Microsoft Sonia Online (Natural)", "Microsoft Ryan Online (Natural)", "Microsoft Libby Online (Natural)",
  // Chrome
  "Google UK English Female", "Google UK English Male",
];

// macOS novelty / Eloquence voices: en-GB in name only, robotic and inaccurate.
const NOVELTY = /^(Eddy|Flo|Grandma|Grandpa|Reed|Rocko|Sandy|Shelley)\b/;

export function isBritish(v: SpeechSynthesisVoice) {
  return /^en[-_]GB/i.test(v.lang) && !NOVELTY.test(v.name);
}

// 0 = premium / neural, 1 = enhanced, 2 = compact or unknown.
function quality(v: SpeechSynthesisVoice): number {
  if (/Premium|高音质|高品质|Natural/i.test(v.name)) return 0;
  if (/Enhanced|优化音质|增强/i.test(v.name)) return 1;
  return 2;
}

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return Promise.resolve([]);
  const now = window.speechSynthesis.getVoices();
  if (now.length) return Promise.resolve(now);
  return new Promise((resolve) => {
    const done = () => resolve(window.speechSynthesis.getVoices());
    window.speechSynthesis.addEventListener("voiceschanged", done, { once: true });
    setTimeout(done, 1500);
  });
}

export async function britishVoices(): Promise<SpeechSynthesisVoice[]> {
  const all = await loadVoices();
  const gb = all.filter(isBritish);
  const rank = (v: SpeechSynthesisVoice) => {
    const i = PREFERRED.findIndex((p) => v.name.startsWith(p));
    return quality(v) * 100 + (i === -1 ? 99 : i);
  };
  return gb.sort((a, b) => rank(a) - rank(b));
}

export async function pickVoice(): Promise<SpeechSynthesisVoice | null> {
  const gb = await britishVoices();
  const { voiceURI, voicePicked } = getState().settings;
  const chosen = voicePicked ? gb.find((v) => v.voiceURI === voiceURI) : undefined;
  return chosen ?? gb[0] ?? null;
}

let currentAudio: HTMLAudioElement | null = null;
// Every stopAll() bumps this, so an older playback loop knows it was cancelled.
let generation = 0;
// Chrome can garbage-collect an utterance mid-speech and never fire its events;
// holding references until it finishes prevents that.
const live = new Set<SpeechSynthesisUtterance>();

export const SLOW_RATE = 0.7;

export function stopAll() {
  if (typeof window === "undefined") return;
  generation++;
  const ss = window.speechSynthesis;
  if (ss && (ss.speaking || ss.pending)) ss.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

export function playBlob(blob: Blob, rate = 1): Promise<void> {
  stopAll();
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const a = new Audio(url);
    // Slow playback of a real recording keeps the speaker's pitch.
    a.playbackRate = rate;
    a.preservesPitch = true;
    currentAudio = a;
    const end = () => {
      URL.revokeObjectURL(url);
      if (currentAudio === a) currentAudio = null;
      resolve();
    };
    a.onended = end;
    a.onerror = end;
    a.play().catch(end);
  });
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Chrome stops long utterances after ~15 s, so speak sentence by sentence.
function chunks(text: string): string[] {
  return text.match(/[^.!?;]+[.!?;]?/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
}

// Function words carry weak forms, so a phrase containing them is never split.
const FUNCTION_WORDS = new Set(["a", "an", "the", "of", "to", "and", "in", "on", "at", "for", "is", "are", "was", "be", "been", "have", "has", "you", "i", "it", "he", "she", "we", "they", "him", "her", "us", "them", "some", "can", "do", "did", "there", "here"]);

// Slow mode for a word list such as "sheep ship": each word on its own with a
// gap, because macOS voices barely stretch a two-word utterance.
function slowParts(text: string): string[] {
  if (/[.,!?;:]/.test(text)) return chunks(text);
  const words = text.trim().split(/\s+/);
  if (words.length < 2 || words.some((w) => FUNCTION_WORDS.has(w.toLowerCase()))) return [text.trim()];
  return words;
}

// Speak one utterance; resolves true once it actually started and finished.
// Retries once when Chrome silently drops it (no "start" event).
function speakOnce(text: string, voice: SpeechSynthesisVoice, rate: number, gen: number): Promise<boolean> {
  const ss = window.speechSynthesis;
  const attempt = () =>
    new Promise<"done" | "dropped">((resolve) => {
      const u = new SpeechSynthesisUtterance(text);
      u.voice = voice;
      u.lang = voice.lang;
      u.rate = rate;
      live.add(u);
      let started = false;
      let settled = false;
      const finish = (r: "done" | "dropped") => {
        if (settled) return;
        settled = true;
        live.delete(u);
        clearTimeout(startTimer);
        clearTimeout(hardTimer);
        resolve(r);
      };
      u.onstart = () => { started = true; };
      u.onend = () => finish(started ? "done" : "dropped");
      u.onerror = () => finish(started ? "done" : "dropped");
      const startTimer = setTimeout(() => { if (!started) finish("dropped"); }, 1500);
      // Never leave the button stuck on "停止" if "end" goes missing.
      const hardTimer = setTimeout(() => finish("done"), 4000 + (text.length * 180) / rate);
      if (ss.paused) ss.resume();
      ss.speak(u);
    });
  return (async () => {
    for (let i = 0; i < 2; i++) {
      if (gen !== generation) return false;
      const r = await attempt();
      if (r === "done") return true;
      if (gen !== generation) return false;
      if (ss.speaking || ss.pending) ss.cancel();
      await wait(120);
    }
    return false;
  })();
}

export async function speakTTS(text: string, rate?: number): Promise<boolean> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const voice = await pickVoice();
  if (!voice) return false;
  stopAll();
  const gen = generation;
  // Speaking straight after cancel() makes Chrome drop the new utterance.
  await wait(80);
  if (gen !== generation) return true;
  const r = rate ?? getState().settings.rate;
  const slow = r < 0.8;
  const clean = text.replace(/[|‿↗↘]/g, " ");
  const parts = slow ? slowParts(clean) : chunks(clean);
  let any = false;
  for (let i = 0; i < parts.length; i++) {
    if (gen !== generation) break;
    if (await speakOnce(parts[i], voice, r, gen)) any = true;
    if (slow && i < parts.length - 1) await wait(450);
  }
  return any || gen !== generation;
}

export async function modelSource(text: string): Promise<ModelSource> {
  try {
    if (await getRefAudio(text)) return "human";
  } catch {
    /* IndexedDB unavailable */
  }
  return (await pickVoice()) ? "tts-gb" : "none";
}

export async function playModel(text: string, rate?: number): Promise<ModelSource> {
  try {
    const ref = await getRefAudio(text);
    if (ref) {
      await playBlob(ref.blob, rate && rate < 1 ? rate : 1);
      return "human";
    }
  } catch {
    /* ignore and fall through */
  }
  const ok = await speakTTS(text, rate);
  return ok ? "tts-gb" : "none";
}

// Contrasts the macOS en-GB synthetic voice renders with little acoustic
// difference (measured on Daniel: /θ/ vs /f/ fricatives within ~0.3 kHz of each
// other, /ð/ reduced to a ~10 ms burst like /d/; "an ice" vs "a nice" differ
// only in a slight timing change).
const WEAK_SETS: [string[], string][] = [
  [["thin", "fin"], "/θ/–/f/"],
  [["three", "free"], "/θ/–/f/"],
  [["then", "den"], "/ð/–/d/"],
  [["though", "dough"], "/ð/–/d/"],
  [["they", "day"], "/ð/–/d/"],
  [["an ice cream", "a nice cream"], "连读边界"],
];

export function ttsWeakContrast(options: string[]): string | null {
  const lower = options.map((o) => o.toLowerCase());
  const hit = WEAK_SETS.find(([set]) => set.every((w) => lower.includes(w)));
  return hit ? hit[1] : null;
}
