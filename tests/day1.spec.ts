import { expect, test } from "@playwright/test";
import { fakeSpeech } from "./helpers";
import { runDay } from "./flow";

test("Day 1 end to end: timer, audio, quiz, recording, compare, review, completion, persistence", async ({ page }) => {
  await fakeSpeech(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /今天：Day 1/ })).toBeVisible();
  await page.screenshot({ path: "test-results/dashboard-empty.png", fullPage: true });
  await page.getByRole("link", { name: /开始今天的训练/ }).click();
  await expect(page).toHaveURL(/bootcamp\/1/);

  await runDay(page, 1, { wrongEvery: 5, issuesOnCompare: true, shot: "day1" });

  // only the British voice was ever used
  const spoken = await page.evaluate(() => (window as any).__spoken);
  // (reload cleared the log; play one more model to check)
  await page.locator(".step-pill").nth(1).click();
  await page.getByRole("button", { name: /^听示范:/ }).first().click();
  await page.waitForTimeout(200);
  const after = await page.evaluate(() => (window as any).__spoken);
  expect(after.length).toBeGreaterThan(0);
  for (const u of after) expect(u.lang).toBe("en-GB");

  // persisted state
  const st = await page.evaluate(() => JSON.parse(localStorage.getItem("english-os:v1")!));
  expect(st.days[1].completedAt).toBeTruthy();
  expect(Object.keys(st.days[1].recordings).length).toBe(7);
  expect(st.errors.length).toBeGreaterThan(0);
  expect(st.reviews.length).toBeGreaterThan(0);
  expect(st.reviews.every((r: any) => r.dueDay >= 2)).toBe(true);

  // recordings really exist in IndexedDB and play back
  const n = await page.evaluate(async () => {
    const db: IDBDatabase = await new Promise((res) => { const r = indexedDB.open("english-os"); r.onsuccess = () => res(r.result); });
    return await new Promise<number>((res) => { const t = db.transaction("recordings").objectStore("recordings").getAll(); t.onsuccess = () => res(t.result.filter((x: any) => x.blob.size > 0).length); });
  });
  expect(n).toBe(7);

  await page.goto("/");
  await expect(page.getByRole("heading", { name: /今天：Day 2/ })).toBeVisible();
  await page.screenshot({ path: "test-results/dashboard-after-day1.png", fullPage: true });
});

test("no British voice: warns instead of using an American voice", async ({ page }) => {
  await fakeSpeech(page, false);
  await page.goto("/bootcamp/1");
  await expect(page.getByText(/没有找到英式（en-GB）语音/)).toBeVisible();
  await page.locator(".step-pill").nth(1).click();
  await page.getByRole("button", { name: /^听示范:/ }).first().click();
  await expect(page.getByText("未找到 en-GB 声音").first()).toBeVisible();
  const spoken = await page.evaluate(() => (window as any).__spoken);
  expect(spoken.length).toBe(0);
});

test("timer pause/resume and reload recovery", async ({ page }) => {
  await fakeSpeech(page);
  await page.goto("/bootcamp/1");
  await page.getByRole("button", { name: /开始训练/ }).click();
  await page.waitForTimeout(2300);
  await page.getByRole("button", { name: /❚❚ 暂停/ }).click();
  const t1 = await page.evaluate(() => JSON.parse(localStorage.getItem("english-os:v1")!).days[1].totalMs);
  expect(t1).toBeGreaterThan(2000);
  await page.waitForTimeout(1500);
  const t2 = await page.evaluate(() => JSON.parse(localStorage.getItem("english-os:v1")!).days[1].totalMs);
  expect(t2).toBe(t1); // paused: no time accrues
  await page.getByRole("button", { name: /继续训练/ }).click();
  await page.waitForTimeout(1200);
  await page.reload(); // closing mid-run: credited up to last heartbeat, then paused
  await expect(page.getByRole("button", { name: /继续训练/ })).toBeVisible();
});
