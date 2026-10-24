import { expect, type Page } from "@playwright/test";
import { addMinutes } from "./helpers";

const step = (page: Page, n: number) => page.locator(".step-pill").nth(n).click();

// Works through every step of a day through the real UI.
export async function runDay(page: Page, day: number, opts: { wrongEvery?: number; issuesOnCompare?: boolean; shot?: string } = {}) {
  await page.goto(`/bootcamp/${day}`);
  const open = page.getByRole("button", { name: "仍然打开" });
  if (await open.isVisible().catch(() => false)) await open.click();
  await page.getByRole("button", { name: /开始训练|继续训练/ }).click();
  await expect(page.getByRole("button", { name: /暂停/ }).first()).toBeVisible();

  // 1 Learn
  await step(page, 0);
  const learnBtn = page.getByRole("button", { name: "我已理解这一节" });
  while (await learnBtn.count()) await learnBtn.first().click();
  if (opts.shot) await page.screenshot({ path: `test-results/${opts.shot}-learn.png`, fullPage: true });

  // 2 Listen
  await step(page, 1);
  const cards = page.locator(".card.flat");
  const nListen = await cards.count();
  for (let i = 0; i < nListen; i++) await cards.nth(i).getByRole("button", { name: /^听示范:/ }).first().click();
  await page.waitForTimeout(300);

  // 3 Identify
  await step(page, 2);
  const quiz = page.locator(".card.flat");
  const nq = await quiz.count();
  for (let i = 0; i < nq; i++) {
    const opts2 = quiz.nth(i).locator("button.opt");
    const k = await opts2.count();
    // pick the right answer by trying: first click option 0, the card reveals the right one
    const pick = opts.wrongEvery && i % opts.wrongEvery === 0 ? 0 : -1;
    if (pick === 0) {
      await opts2.nth(0).click();
    } else {
      // answer correctly using the data exposed in the DOM after a dry look is not possible,
      // so read the answer from the app's plan via window.__plan
      const ans = await page.evaluate((idx) => (window as any).__plan.identify[idx].answer, i);
      await opts2.nth(Math.min(ans, k - 1)).click();
    }
  }
  if (opts.shot) await page.screenshot({ path: `test-results/${opts.shot}-identify.png`, fullPage: true });

  // 4 Produce
  await step(page, 3);
  for (const b of await page.getByRole("button", { name: "+1 我说了一遍" }).all()) {
    await b.click(); await b.click(); await b.click();
  }

  // 5 Record
  await step(page, 4);
  const recButtons = await page.getByRole("button", { name: "● 录音" }).count();
  for (let i = 0; i < recButtons; i++) {
    await page.getByRole("button", { name: "● 录音" }).nth(i).click();
    await page.waitForTimeout(700);
    await page.getByRole("button", { name: /停止录音/ }).click();
    await expect(page.locator(".card.flat").nth(i).getByRole("button", { name: /第 1 次/ })).toBeVisible();
  }
  if (opts.shot) await page.screenshot({ path: `test-results/${opts.shot}-record.png`, fullPage: true });

  // 6 Compare
  await step(page, 5);
  const cmp = page.locator(".card.flat");
  const nc = await cmp.count();
  for (let i = 0; i < nc; i++) {
    const c = cmp.nth(i);
    await c.locator(".rating button").nth(2).click();
    if (opts.issuesOnCompare && i === 0) await c.locator(".row button.btn.sm").filter({ hasNotText: /示范|我的/ }).first().click();
    await c.getByRole("button", { name: /保存对比/ }).click();
    await expect(c.getByText(/已对比/)).toBeVisible();
  }
  if (opts.shot) await page.screenshot({ path: `test-results/${opts.shot}-compare.png`, fullPage: true });

  // 7 Repeat
  await step(page, 6);
  // answer due reviews correctly
  const reviewCards = page.locator("section.card").first().locator(".card.flat .card.flat");
  const nr = await reviewCards.count();
  for (let i = 0; i < nr; i++) await reviewCards.nth(i).locator("button.opt").first().click();
  await page.getByText("我检查过了，今天没有需要额外补充的错误").click();
  const rates = page.locator("section.card").nth(3).locator(".rating");
  for (let i = 0; i < 3; i++) await rates.nth(i).locator("button").nth(3).click();
  await page.locator("section.card").nth(3).locator("textarea").fill(`Day ${day} 复盘：测试`);
  await page.getByRole("button", { name: "保存自评" }).click();
  if (opts.shot) await page.screenshot({ path: `test-results/${opts.shot}-repeat.png`, fullPage: true });

  // time: pause, then credit the remaining minutes directly (cannot wait an hour in a test)
  await page.getByRole("button", { name: /❚❚ 暂停/ }).click();
  await addMinutes(page, day, 90);
  await page.reload();
  await expect(page.getByRole("button", { name: `完成 Day ${day}` })).toBeEnabled();
  await page.getByRole("button", { name: `完成 Day ${day}` }).click();
  await expect(page.getByText(/已于 .* 完成/)).toBeVisible();
}
