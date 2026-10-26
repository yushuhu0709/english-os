"use client";

import { useEffect, useRef } from "react";
import { backupNow } from "@/lib/backup";
import { useAppState } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";

// Mounted once in the layout. Backs up a few seconds after progress changes or a
// new recording is saved, and when the tab is hidden or closed. The running timer
// touches progress every few seconds, so state-only saves are spaced 30 s apart.
const DELAY_MS = 4000;
const MIN_GAP_MS = 30000;

export function AutoBackup() {
  const s = useAppState();
  const h = useHydrated();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);
  const last = useRef(0);

  const schedule = (ms: number) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { last.current = Date.now(); void backupNow(); }, ms);
  };

  useEffect(() => {
    if (!h) return;
    schedule(first.current ? 1500 : Math.max(DELAY_MS, MIN_GAP_MS - (Date.now() - last.current)));
    first.current = false;
  }, [s, h]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onFile = () => schedule(DELAY_MS);
    const onHide = () => { if (document.visibilityState === "hidden") void backupNow(); };
    window.addEventListener("english-os:file-saved", onFile);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("english-os:file-saved", onFile);
      document.removeEventListener("visibilitychange", onHide);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
