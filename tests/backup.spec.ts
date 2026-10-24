import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fakeSpeech } from "./helpers";

const DIR = path.join(process.cwd(), "test-results/backup");

test("progress and recordings are backed up to the folder and can be restored", async ({ page }) => {
  fs.rmSync(DIR, { recursive: true, force: true });
  await fakeSpeech(page);

  // a recording in the Lab and a self-reported error
  await page.goto("/lab");
  await page.getByRole("button", { name: "自由跟读录音" }).click();
  await page.getByRole("button", { name: "● 录音" }).click();
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: /停止录音/ }).click();
  await expect(page.getByRole("button", { name: /第 1 次/ })).toBeVisible();
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem("english-os:v1") ?? '{"version":1,"days":{},"errors":[],"reviews":[],"elsa":[],"coach":[],"settings":{}}');
    s.settings.apiKey = "sk-ant-secret";
    s.errors.push({ id: "err-test", createdAt: new Date().toISOString(), day: 1, source: "self", skill: "θ-s", text: "three → free" });
    localStorage.setItem("english-os:v1", JSON.stringify(s));
  });

  await page.goto("/progress");
  await page.getByRole("button", { name: "立即备份" }).click();
  await expect(page.getByText(/自动备份：已开启/)).toBeVisible();
  await expect(page.getByText(/共 1 个录音和文件/)).toBeVisible();

  const latest = JSON.parse(fs.readFileSync(path.join(DIR, "progress-latest.json"), "utf8"));
  expect(latest.state.errors.some((e: { id: string }) => e.id === "err-test")).toBe(true);
  expect(JSON.stringify(latest)).not.toContain("sk-ant-secret");
  expect(fs.readdirSync(path.join(DIR, "daily")).length).toBe(1);
  expect(fs.readdirSync(path.join(DIR, "recordings")).filter((f) => !f.endsWith(".json")).length).toBe(1);

  // requests that do not come from localhost are refused
  const res = await page.request.post("/api/backup", { headers: { host: "evil.example" }, data: { state: { version: 1 } } });
  expect(res.status()).toBe(403);

  // wipe the browser, restore from the folder
  await page.evaluate(async () => {
    localStorage.clear();
    await new Promise((r) => { const q = indexedDB.deleteDatabase("english-os"); q.onsuccess = q.onerror = q.onblocked = () => r(null); });
  });
  await page.reload();
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "从自动备份恢复" }).click();
  await expect(page.getByText(/恢复 1 个录音和文件/)).toBeVisible();
  const st = await page.evaluate(() => JSON.parse(localStorage.getItem("english-os:v1")!));
  expect(st.errors.some((e: { id: string }) => e.id === "err-test")).toBe(true);
  const recs = await page.evaluate(() => new Promise<number>((resolve) => {
    const q = indexedDB.open("english-os");
    q.onsuccess = () => { const c = q.result.transaction("recordings").objectStore("recordings").count(); c.onsuccess = () => resolve(c.result); };
  }));
  expect(recs).toBe(1);

  // the restored error shows up in today's daily review
  await page.goto("/review");
  await expect(page.getByText("/θ/ vs /s/ /f/").first()).toBeVisible();
});
