import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: ["**/e2e/**/*.spec.ts", "**/collapse.spec.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://127.0.0.1:4175", trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1200, height: 1000 } } },
    { name: "firefox", use: { ...devices["Desktop Firefox"], viewport: { width: 1200, height: 1000 } } },
    { name: "webkit", use: { ...devices["Desktop Safari"], viewport: { width: 1200, height: 1000 } } },
  ],
  webServer: [
    {
      command: "pnpm --filter drawesome-tests build && pnpm --filter drawesome-tests preview",
      url: "http://127.0.0.1:4175/fixtures/svelte.html",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "pnpm --filter drawesome-studio exec vite --host 127.0.0.1 --port 4176",
      url: "http://127.0.0.1:4176/collapse.html",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
