// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000, // Match your Azure AD B2C extended timeout
  expect: {
    timeout: 30000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html'],
    ['junit', { 
      outputFile: 'test-results/junit-results.xml',
      embedAnnotationsAsProperties: true,
      attachmentsAnnotationPattern: '.*'
    }]
  ],
  use: {
    baseURL: 'https://compliancerdev.auditmypayroll.com.au',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    headless: process.env.CI ? true : false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 30000,
    navigationTimeout: 60000,  // Match your Azure AD B2C navigation timeout
    testIdAttribute: 'data-testid'
  },
  projects: [
    {
      name: 'setup',
      testMatch: /global\.setup\.js/,
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'unauthenticated',  // For login tests
      testMatch: /login\.spec\.js/,
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--start-maximized']
        }
      }
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
    }
  ],
});
