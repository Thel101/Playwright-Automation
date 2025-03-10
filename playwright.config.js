// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000,
  expect: {
    timeout: 30000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
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
      name: 'setup',
      testMatch: /global\.setup\.js/
    },
    {
      name: 'authenticated',
      dependencies: ['setup'],
      testMatch: /.*\.spec\.js/,
      testIgnore: /login\.spec\.js/,  // Ignore login tests for authenticated project
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'auth.json',
        launchOptions: {
          args: ['--start-maximized']
        }
      },
    },
    {
      name: 'unauthenticated',
      testMatch: /login\.spec\.js/,  // Only run login tests in unauthenticated project
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--start-maximized']
        }
      },
    }
  ],
});
