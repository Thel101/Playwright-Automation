// @ts-check
// @ts-ignore
const { defineConfig, devices } = require('@playwright/test');
// @ts-ignore
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000,
  expect: {
    timeout: 30000
  },
  fullyParallel: true,
  // @ts-ignore
  forbidOnly: !!process.env.CI,
  // @ts-ignore
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html'],
    ['junit', { 
      outputFile: 'test-results/junit-report.xml',
      embedAnnotationsAsProperties: true,
      attachmentsAnnotationPattern: '.*'
    }]
  ],
  use: {
    baseURL: 'https://compliancerdev.auditmypayroll.com.au',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    // @ts-ignore
    headless: process.env.CI ? true : false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 30000,
    navigationTimeout: 60000
  },
  projects: [
    // Setup project for generating auth state
    {
      name: 'setup',
      testMatch: /global\.setup\.js/,
      use: {
        ...devices['Desktop Chrome']
      }
    },

    // Unauthenticated projects for login tests
    {
      name: 'chrome-unauthenticated',
      testMatch: /login\.spec\.js/,
      use: { 
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
        launchOptions: {
          args: ['--start-maximized']
        }
      }
    },
    {
      name: 'edge-unauthenticated',
      testMatch: /login\.spec\.js/,
      use: { 
        channel: 'msedge',
        ...devices['Desktop Edge'],
        storageState: { cookies: [], origins: [] },
        launchOptions: {
          args: ['--start-maximized']
        }
      }
    },
    {
      name: 'firefox-unauthenticated',
      testMatch: /login\.spec\.js/,
      use: { 
        ...devices['Desktop Firefox'],
        storageState: { cookies: [], origins: [] },
        launchOptions: {
          args: ['--start-maximized']
        }
      }
    },
    {
      name: 'webkit-unauthenticated',
      testMatch: /login\.spec\.js/,
      use: { 
        ...devices['Desktop Safari'],
        storageState: { cookies: [], origins: [] },
        launchOptions: {
          args: ['--start-maximized']
        }
      }
    },

    // Authenticated projects for all other tests
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
      }
    },
    {
      name: 'edge-authenticated',
      dependencies: ['setup'],
      testMatch: /.*\.spec\.js/,
      testIgnore: /login\.spec\.js/,
      use: { 
        channel: 'msedge',
        ...devices['Desktop Edge'],
        storageState: 'auth.json',
        launchOptions: {
          args: ['--start-maximized']
        }
      }
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
      }
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
      }
    }
  ]
});
