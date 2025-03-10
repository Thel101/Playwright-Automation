// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000,
  expect: {
    timeout: 30000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 4,
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
      testMatch: /global\.setup\.js/,
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'chrome-authenticated',
      dependencies: ['setup'],
      testMatch: /.*\.spec\.js/,
      testIgnore: /login\.spec\.js/,
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'auth.json',
        launchOptions: {
          args: ['--start-maximized']
        }
      },
    },
    {
      name: 'edge-authenticated',
      dependencies: ['setup'],
      testMatch: /.*\.spec\.js/,
      testIgnore: /login\.spec\.js/,
      use: { 
        ...devices['Desktop Edge'],
        storageState: 'auth.json',
        launchOptions: {
          args: ['--start-maximized']
        }
      },
    },
    {
      name: 'firefox-authenticated',
      dependencies: ['setup'],
      testMatch: /.*\.spec\.js/,
      testIgnore: /login\.spec\.js/,
      use: { 
        ...devices['Desktop Firefox'],
        storageState: 'auth.json',
        launchOptions: {
          args: ['--start-maximized']
        }
      },
    },
    {
      name: 'webkit-authenticated',
      dependencies: ['setup'],
      testMatch: /.*\.spec\.js/,
      testIgnore: /login\.spec\.js/,
      use: { 
        ...devices['Desktop Safari'],
        storageState: 'auth.json',
        launchOptions: {
          args: ['--start-maximized']
        }
      },
    },
    {
      name: 'chrome',
      testMatch: /login\.spec\.js/,
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--start-maximized']
        }
      },
    },
    {
      name: 'edge',
      testMatch: /login\.spec\.js/,
      use: { 
        ...devices['Desktop Edge'],
        launchOptions: {
          args: ['--start-maximized']
        }
      },
    },
    {
      name: 'firefox',
      testMatch: /login\.spec\.js/,
      use: { 
        ...devices['Desktop Firefox'],
        launchOptions: {
          args: ['--start-maximized']
        }
      },
    },
    {
      name: 'webkit',
      testMatch: /login\.spec\.js/,
      use: { 
        ...devices['Desktop Safari'],
        launchOptions: {
          args: ['--start-maximized']
        }
      },
    }
  ],
});
