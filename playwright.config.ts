import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: /.*\.spec\.ts/,
  timeout: 180_000,
  // every spec auto-backs up to the same folder, and backup.spec restores from it
  workers: 1,
  expect: { timeout: 8000 },
  use: {
    baseURL: "http://localhost:3123",
    launchOptions: {
      executablePath: process.env.PW_CHROMIUM ?? undefined,
      args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"],
    },
    permissions: ["microphone"],
    viewport: { width: 1280, height: 900 },
    actionTimeout: 15000,
  },
  webServer: {
    command: "npx next start -p 3123",
    env: { ENGLISH_OS_BACKUP_DIR: "test-results/backup" },
    url: "http://localhost:3123",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
