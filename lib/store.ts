"use client";

import { useSyncExternalStore } from "react";
import type { BlockId } from "@/content/types";

// Local-first persistence. Structured progress lives in localStorage; audio and
// screenshots live in IndexedDB (see audioDb.ts) and are referenced by id here.

export const STORAGE_KEY = "english-os:v1";

export interface QuizAttempt {
  choice: number;
  correct: boolean;
  at: string;
}

export interface CompareCheck {
  rating: number; // 1–5 self rating of closeness to model
  issues: string[]; // skill ids the learner marked as still off
  note?: string;
  at: string;
}

export interface RoundSummary {
  round: number;
  finishedAt: string;
  activeMs: number;
  quizFirstAccuracy: number | null;
  recordings: number;
}

export interface DayRecord {
  day: number;
  round: number;
  startedAt?: string;
  completedAt?: string;
  blocks: Record<BlockId, number>; // active ms per block (this round)
  totalMs: number; // all rounds, all blocks
  running: boolean;
  activeBlock: BlockId;
  runStartedAt?: number; // epoch ms of the current running segment
  heartbeatAt?: number; // last time running time was flushed
  learnRead: string[];
  listened: Record<string, number>; // item id -> plays
  quiz: Record<string, QuizAttempt[]>; // item id -> attempts (first = scored)
  produced: Record<string, number>; // drill id -> reps said aloud
  recordings: Record<string, string[]>; // item id -> recording ids
  compared: Record<string, CompareCheck>;
  reviewed: Record<string, boolean>; // review task id -> done in this day's review
  selfAssessment?: { clarity: number; confidence: number; effort: number; note: string; at: string };
  noNewErrors?: boolean;
  short?: boolean; // learner chose the short (~30 min) version of this day
  rounds: RoundSummary[];
  log: { start: string; end: string; ms: number; block: BlockId }[];
}

export type ErrorSource = "quiz" | "self" | "compare" | "elsa" | "coach";

export interface ErrorEntry {
  id: string;
  createdAt: string;
  day: number;
  source: ErrorSource;
  skill: string;
  text: string; // word or description
  detail?: string;
  resolved?: boolean;
}

export interface ReviewTask {
  id: string;
  skill: string;
  label: string;
  createdDay: number;
  dueDay: number; // bootcamp day on which it is due
  stage: number; // 0,1,2 → intervals 1,2,3 training days
  history: { day: number; correct: boolean; at: string }[];
  mastered?: boolean;
  sourceErrorId?: string;
}

export interface ElsaEntry {
  id: string;
  createdAt: string;
  word: string;
  issue: string; // what ELSA flagged
  score?: number; // ELSA % if given
  accentSetting: "british" | "american" | "unknown";
  skills: string[];
  accentDifference: boolean; // flagged as possible US-vs-SSBE difference, not an SSBE error
  screenshotId?: string;
  note?: string;
}

export interface CoachNote {
  id: string;
  createdAt: string;
  question: string;
  answer: string;
  source: "rules" | "ai";
  model?: string;
}

export interface Settings {
  voiceURI?: string;
  // Set when the learner picks a voice in the Lab after voice ranking was fixed;
  // earlier stored choices were made automatically and are ignored.
  voicePicked?: boolean;
  rate: number;
  apiKey?: string; // optional; stored only in this browser
  model: string;
  previewLocked: boolean;
  reminder?: { enabled: boolean; time: string }; // daily practice reminder (lib/reminderServer.ts)
}

// Calendar-based daily review (lib/daily.ts), separate from the in-lesson
// review that is scheduled by bootcamp day.
export interface DailyItem {
  skill: string;
  addedAt: string; // YYYY-MM-DD
  due: string; // YYYY-MM-DD
  stage: number; // index into DAILY_INTERVALS
  evidence: number; // errors + failed reviews seen for this skill when last synced
  history: { date: string; correct: boolean }[];
  mastered?: boolean;
}

export interface DailyState {
  items: Record<string, DailyItem>;
  log: Record<string, string[]>; // date -> skills reviewed that day
}

export interface AppState {
  version: 1;
  createdAt: string;
  days: Record<number, DayRecord>;
  errors: ErrorEntry[];
  reviews: ReviewTask[];
  elsa: ElsaEntry[];
  coach: CoachNote[];
  settings: Settings;
  report?: { generatedAt: string; aiSummary?: string; aiModel?: string };
  daily?: DailyState;
}

export function emptyDay(day: number): DayRecord {
  return {
    day,
    round: 1,
    blocks: { understand: 0, perceive: 0, shadow: 0, review: 0 },
    totalMs: 0,
    running: false,
    activeBlock: "understand",
    learnRead: [],
    listened: {},
    quiz: {},
    produced: {},
    recordings: {},
    compared: {},
    reviewed: {},
    rounds: [],
    log: [],
  };
}

export function initialState(): AppState {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    days: {},
    errors: [],
    reviews: [],
    elsa: [],
    coach: [],
    settings: { rate: 0.9, model: "claude-sonnet-5-5", previewLocked: true },
  };
}

let state: AppState | null = null;
const listeners = new Set<() => void>();
const SERVER_STATE = initialState();

function load(): AppState {
  if (state) return state;
  if (typeof window === "undefined") return SERVER_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      state = { ...initialState(), ...parsed, settings: { ...initialState().settings, ...parsed.settings } };
      recoverRunningTimers(state);
      return state;
    }
  } catch {
    // corrupted or blocked storage: start fresh in memory
  }
  state = initialState();
  return state;
}

// A page closed while a timer was running: credit time up to the last heartbeat
// only, and leave the day paused. Time while the page was closed is not counted.
function recoverRunningTimers(s: AppState) {
  for (const d of Object.values(s.days)) {
    if (d.running && d.runStartedAt) {
      const end = d.heartbeatAt && d.heartbeatAt > d.runStartedAt ? d.heartbeatAt : d.runStartedAt;
      const ms = end - d.runStartedAt;
      d.blocks[d.activeBlock] += ms;
      d.totalMs += ms;
      if (ms > 0) d.log.push({ start: new Date(d.runStartedAt).toISOString(), end: new Date(end).toISOString(), ms, block: d.activeBlock });
    }
    d.running = false;
    d.runStartedAt = undefined;
  }
}

function persist() {
  if (typeof window === "undefined" || !state) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("English OS: could not save progress", e);
  }
}

export function getState(): AppState {
  return load();
}

export function update(mutator: (draft: AppState) => void) {
  const draft = structuredClone(load());
  mutator(draft);
  state = draft;
  persist();
  listeners.forEach((l) => l());
}

export function replaceState(next: AppState) {
  state = { ...initialState(), ...next };
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      state = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, load, () => SERVER_STATE);
}

export function ensureDay(s: AppState, day: number): DayRecord {
  if (!s.days[day]) s.days[day] = emptyDay(day);
  return s.days[day];
}

export function uid(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
