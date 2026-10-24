import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: /.*\.spec\.ts/,
  timeout: 180_000,
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
    url: "http://localhost:3123",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
