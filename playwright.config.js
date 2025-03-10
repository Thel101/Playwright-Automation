// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000, // Increased timeout for slower connections
  expect: {
    timeout: 30000
  },
  fullyParallel: false, // Disable parallel execution for better debugging
  forbidOnly: !!process.env.CI,
  retries: 0, // Disable retries for debugging
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'https://compliancerdev.auditmypayroll.com.au',
    trace: 'on',
    video: 'on',
    screenshot: 'on',
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 30000,
    navigationTimeout: 60000
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--start-maximized']
        }
      },
    },
  ],
});
