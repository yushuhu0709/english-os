import { expect, test } from "@playwright/test";
import { fakeSpeech } from "./helpers";
import { runDay } from "./flow";

test("today plan, short lessons by default, reminder setting and practice calendar", async ({ page }) => {
  await fakeSpeech(page);
  await page.goto("/");
  const plan = page.getByTestId("today-plan");
  await expect(plan.getByText("今天这样练")).toBeVisible();
  await expect(plan.getByText("Day 1 短课")).toBeVisible();
  await expect(plan.getByText("今天已练 0 分钟")).toBeVisible();

  // a new day opens as a short lesson
  await page.goto("/bootcamp/2");
  const open = page.getByRole("button", { name: "仍然打开" });
  if (await open.isVisible().catch(() => false)) await open.click();
  await expect(page.getByRole("button", { name: /短课 · / })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(/目标 30 分钟 · 最少 25 分钟/)).toBeVisible();

  // Day 1 done the short way stays short after completion
  await runDay(page, 1, { short: true, wrongEvery: 3 });
  let st = await page.evaluate(() => JSON.parse(localStorage.getItem("english-os:v1")!));
  expect(st.days[1].short).toBe(true);

  await page.goto("/");
  await expect(plan.getByText(/连续 1 天/)).toBeVisible();
  await expect(plan.getByText("Day 2 短课")).toBeVisible();
  await expect(plan.getByText(/今天 \d+ 项/)).toBeVisible(); // mistakes from Day 1 are queued for review

  // reminder
  await plan.getByLabel("每天提醒我练习").check();
  await plan.getByLabel("提醒时间").fill("07:30");
  st = await page.evaluate(() => JSON.parse(localStorage.getItem("english-os:v1")!));
  expect(st.settings.reminder).toEqual({ enabled: true, time: "07:30" });
  await plan.getByRole("button", { name: "发一条测试通知" }).click();
  await expect(plan.getByText("只有在 Mac 上运行时才能弹出通知。")).toBeVisible(); // tests run on Linux
  const api = await page.request.get("/api/reminder");
  expect((await api.json()).supported).toBe(false);

  await page.goto("/progress");
  const cal = page.getByTestId("practice-calendar");
  await expect(cal.getByText(/练了 1 天 · 当前连续 1 天/)).toBeVisible();
  await page.screenshot({ path: "test-results/progress-calendar.png" });
});
