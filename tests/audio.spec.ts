import { expect, test } from "@playwright/test";
import { fakeSpeech } from "./helpers";

// 0.1 s of silence, 8 kHz mono 16-bit
function wav(): Buffer {
  const n = 800, b = Buffer.alloc(44 + n * 2);
  b.write("RIFF", 0); b.writeUInt32LE(36 + n * 2, 4); b.write("WAVEfmt ", 8); b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(8000, 24); b.writeUInt32LE(16000, 28);
  b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(n * 2, 40);
  return b;
}

test("audio library: bulk import matches files to sentences and the course plays them", async ({ page }) => {
  await fakeSpeech(page);
  await page.goto("/audio");
  await expect(page.getByRole("heading", { name: "真人示范音频" })).toBeVisible();
  await expect(page.getByText(/^0 \/ \d+$/).first()).toBeVisible();

  // recording script download
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: /下载录音清单/ }).click();
  const csv = require("fs").readFileSync(await (await dl).path(), "utf8");
  expect(csv).toContain("d2-l1");

  await page.getByTestId("audio-files").setInputFiles([
    { name: "d2-l1.wav", mimeType: "audio/wav", buffer: wav() },
    { name: "Sheep ship leave live.wav", mimeType: "audio/wav", buffer: wav() }, // same sentence by name
    { name: "my holiday.wav", mimeType: "audio/wav", buffer: wav() },
    { name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("x") },
  ]);
  await expect(page.getByText("找到 3 个音频文件，其中 2 个已匹配。", { exact: false })).toBeVisible();
  await expect(page.getByText("有多个文件对应这一句").first()).toBeVisible();
  // assign the unmatched file by hand to the first Day 1 baseline sentence
  const sel = page.getByLabel("my holiday.wav 对应的句子");
  const firstReal = await sel.locator("option").nth(1).getAttribute("value");
  await sel.selectOption(firstReal!);
  await page.getByRole("button", { name: "导入 3 段" }).click();
  await expect(page.getByText("已导入 3 段真人音频。")).toBeVisible();
  await expect(page.getByText(/^2 \/ \d+$/).first()).toBeVisible(); // two distinct sentences now covered

  // the course now plays the human recording for that sentence
  await page.getByRole("button", { name: "全部" }).click();
  const row = page.locator("tr", { hasText: "sheep ship leave live" });
  await expect(row.getByText("真人音频", { exact: true })).toBeVisible();
  await expect(row.getByText("已导入真人音频")).toBeVisible();
  await page.goto("/bootcamp/2");
  const open = page.getByRole("button", { name: "仍然打开" });
  if (await open.isVisible().catch(() => false)) await open.click();
  await page.locator(".step-pill").nth(1).click();
  await page.getByRole("button", { name: "听示范: sheep ship leave live" }).first().click();
  await page.waitForTimeout(500);
  const spoken = await page.evaluate(() => (window as any).__spoken.map((x: any) => x.text));
  expect(spoken.join(" ")).not.toContain("sheep ship");

  // removing it falls back to synthesis and updates the count
  await page.goto("/audio");
  await page.getByRole("button", { name: "全部" }).click();
  await page.locator("tr", { hasText: "sheep ship leave live" }).getByRole("button", { name: "移除" }).click();
  await expect(page.getByText(/^1 \/ \d+$/).first()).toBeVisible();
});
