import { expect, test } from "@playwright/test";
import { fakeSpeech } from "./helpers";
import { runDay } from "./flow";

test("short lesson: Day 2 in ~30 minutes, then switch back to full", async ({ page }) => {
  test.setTimeout(300_000);
  await fakeSpeech(page);
  await runDay(page, 1, { wrongEvery: 3 });
  await runDay(page, 2, { short: true, wrongEvery: 5, shot: "day2-short" });

  const st = await page.evaluate(() => JSON.parse(localStorage.getItem("english-os:v1")!));
  expect(st.days[2].short).toBe(true);
  expect(st.days[2].completedAt).toBeTruthy();
  expect(Object.keys(st.days[2].recordings).length).toBe(2);
  expect(Object.keys(st.days[2].quiz).length).toBe(8);
  await expect(page.locator(".badge", { hasText: "短课" })).toBeVisible();

  // Day 3: pick short, see the trimmed plan, then switch back to the full version
  await page.goto("/bootcamp/3");
  await page.getByRole("button", { name: /短课/ }).click();
  await expect(page.getByText(/目标 30 分钟 · 最少 25 分钟/)).toBeVisible();
  await expect(page.locator(".step-pill").nth(4)).toContainText("0/2");
  await page.getByRole("button", { name: "完整版" }).click();
  await expect(page.locator(".step-pill").nth(4)).toContainText("0/6");
  await page.goto("/");
  await expect(page.getByText(/^目标 \d+ 分钟/)).toBeVisible();
});
