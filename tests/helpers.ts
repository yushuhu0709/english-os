import type { Page } from "@playwright/test";

// Headless Chromium on Linux has no speech voices. Install a fake speechSynthesis that
// exposes one en-GB and one en-US voice and logs what was spoken, so tests can check
// that only the British voice is used.
export async function fakeSpeech(page: Page, withGb = true) {
  await page.addInitScript((withGb: boolean) => {
    const voices = [
      ...(withGb ? [{ name: "Daniel", lang: "en-GB", voiceURI: "Daniel", default: false, localService: true }] : []),
      { name: "Samantha", lang: "en-US", voiceURI: "Samantha", default: true, localService: true },
    ];
    (window as any).__spoken = [];
    const synth = {
      getVoices: () => voices,
      speak: (u: any) => {
        (window as any).__spoken.push({ text: u.text, voice: u.voice?.name, lang: u.lang });
        setTimeout(() => u.onend && u.onend(), 30);
      },
      cancel: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      speaking: false,
      pending: false,
    };
    Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
    (window as any).SpeechSynthesisUtterance = function (this: any, text: string) { this.text = text; };
  }, withGb);
}

export async function addMinutes(page: Page, day: number, minutes: number) {
  await page.evaluate(([day, minutes]) => {
    const key = "english-os:v1";
    const s = JSON.parse(localStorage.getItem(key)!);
    const d = s.days[day];
    d.running = false;
    d.runStartedAt = undefined;
    d.blocks.perceive += minutes * 60000;
    d.totalMs += minutes * 60000;
    const now = new Date().toISOString();
    d.log.push({ start: now, end: now, ms: minutes * 60000, block: "perceive" });
    localStorage.setItem(key, JSON.stringify(s));
  }, [day, minutes] as const);
}
