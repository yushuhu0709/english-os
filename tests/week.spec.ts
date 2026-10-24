import { expect, test } from "@playwright/test";
import { fakeSpeech } from "./helpers";
import { runDay } from "./flow";

test("full week: Days 1–7, reviews, Day 7 report", async ({ page }) => {
  test.setTimeout(600_000);
  await fakeSpeech(page);
  await runDay(page, 1, { wrongEvery: 4, issuesOnCompare: true });
  for (const d of [2, 3, 4, 5, 6]) {
    await runDay(page, d, { wrongEvery: 6, shot: d === 2 || d === 6 ? `day${d}` : undefined });
    const st = await page.evaluate(() => JSON.parse(localStorage.getItem("english-os:v1")!));
    // review tasks due today were worked through
    expect(Object.keys(st.days[d].reviewed).length).toBeGreaterThan(0);
  }
  await runDay(page, 7, { wrongEvery: 9, shot: "day7" });

  await page.goto("/progress");
  await expect(page.getByRole("heading", { name: "第一周发音报告" })).toBeVisible();
  await expect(page.getByText(/完成 Day 7 后生成/)).toHaveCount(0);
  const report = page.locator("#report");
  await expect(report.getByText(/基线听辨正确率：Day 1 \d+%/)).toBeVisible();
  await expect(report.getByText("6. 第二周建议的三个最高优先级项目")).toBeVisible();
  expect(await report.locator("ol li").count()).toBe(3);
  // comparable recordings play back for both days
  await expect(page.getByRole("button", { name: /Day 1 · 3\/5/ }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Day 7 · 3\/5/ }).first()).toBeVisible();
  await page.screenshot({ path: "test-results/progress-report.png", fullPage: true });

  // markdown export
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载 Markdown" }).click();
  const file = await (await dl).path();
  const md = require("fs").readFileSync(file, "utf8");
  expect(md).toContain("# Week 1 Pronunciation Report");
  expect(md).toContain("## 6. 第二周建议的三个最高优先级项目");
  require("fs").writeFileSync("test-results/sample-report.md", md);

  // backup export → wipe → import restores everything
  const dl2 = page.waitForEvent("download");
  await page.getByRole("button", { name: "导出全部数据（含录音）" }).click();
  const backup = await (await dl2).path();
  await page.evaluate(() => localStorage.clear());
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /今天：Day 1/ })).toBeVisible();
  await page.goto("/progress");
  page.once("dialog", (d) => d.accept());
  await page.locator('input[type=file][accept="application/json"]').setInputFiles(backup!);
  await expect(page.getByText("导入完成。")).toBeVisible();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "第一周训练已完成" })).toBeVisible();
  await page.screenshot({ path: "test-results/dashboard-done.png", fullPage: true });
});
