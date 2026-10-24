import { expect, test } from "@playwright/test";
import { fakeSpeech } from "./helpers";

test("Lab, Coach, Progress pages work", async ({ page }) => {
  await fakeSpeech(page);
  await page.goto("/lab");
  await expect(page.getByRole("heading", { name: "Pronunciation Lab" })).toBeVisible();
  await page.screenshot({ path: "test-results/lab.png", fullPage: true });
  await page.getByRole("button", { name: "辨音练习" }).click();
  await page.locator("button.opt").first().click();
  await expect(page.getByText(/本组 [01]\/1/)).toBeVisible();
  await page.getByRole("button", { name: "自由跟读录音" }).click();
  await page.getByRole("button", { name: "● 录音" }).click();
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: /停止录音/ }).click();
  await expect(page.getByRole("button", { name: /第 1 次/ })).toBeVisible();
  await page.getByRole("button", { name: "示范声音设置" }).click();
  await expect(page.getByText("Daniel", { exact: true })).toBeVisible();
  await expect(page.getByText("Samantha")).toHaveCount(0);

  await page.goto("/coach");
  await page.getByRole("button", { name: "错误分析" }).click();
  await page.getByPlaceholder("单词或短语").fill("three");
  await page.getByPlaceholder("哪里不对").fill("th 发成了 f，听起来像 free");
  await page.getByRole("button", { name: "分析", exact: true }).click();
  await expect(page.getByRole("heading", { name: "/θ/ vs /s/ /f/" })).toBeVisible();
  await page.getByRole("button", { name: "加入错误记录和复习" }).first().click();
  await page.getByRole("button", { name: "句子重音与语流" }).click();
  await page.screenshot({ path: "test-results/coach-sentence.png", fullPage: true });
  await page.getByRole("button", { name: "ELSA 辅助记录" }).click();
  await page.getByPlaceholder("例如 water").fill("car");
  await page.getByPlaceholder(/例如 \/t\//).fill("missing r sound at the end");
  await expect(page.getByText("可能是口音差异，不是 SSBE 错误")).toBeVisible();
  await page.getByRole("button", { name: "保存 ELSA 记录" }).click();
  await expect(page.getByText("口音差异").last()).toBeVisible();
  await page.getByPlaceholder("例如 water").fill("think");
  await page.getByPlaceholder(/例如 \/t\//).fill("th sounded like s");
  await expect(page.getByText("可能是口音差异，不是 SSBE 错误")).toHaveCount(0);
  await page.getByRole("button", { name: "保存 ELSA 记录" }).click();
  await page.screenshot({ path: "test-results/coach-elsa.png", fullPage: true });
  const st = await page.evaluate(() => JSON.parse(localStorage.getItem("english-os:v1")!));
  expect(st.elsa.length).toBe(2);
  expect(st.elsa[0].accentDifference).toBe(true);
  expect(st.elsa[1].accentDifference).toBe(false);
  expect(st.errors.filter((e: any) => e.source === "elsa").length).toBe(1);
  expect(st.errors.filter((e: any) => e.source === "coach").length).toBe(1);

  await page.getByRole("button", { name: "AI 设置与提问" }).click();
  await page.getByPlaceholder(/为什么我的/).fill("test");
  await page.getByRole("button", { name: "提问", exact: true }).click();
  await expect(page.getByText(/没有配置 API key/)).toBeVisible();

  await page.goto("/progress");
  await expect(page.getByRole("heading", { name: "训练记录" })).toBeVisible();
  await expect(page.getByText(/完成 Day 7 后生成/)).toBeVisible();
  await page.screenshot({ path: "test-results/progress.png", fullPage: true });
});
