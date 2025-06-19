require('dotenv').config();
const { test: setup, expect } = require('@playwright/test');
const LoginPage = require('./features/auth/login/pageObjects/LoginPage');
const testData = require('./features/auth/login/testData/loginData.json');
const role = process.env.ROLE || 'basic_user'; // Default to 'basic_user'
const authFilePath = `auth-${role}.json`;

setup('Setting up Authenticate', async ({ page }) => {
    const loginPage = new LoginPage(page);

    try {
        console.log('Starting authentication setup...');
        await page.goto(testData.urls.baseUrl);

        // Check if running in CI/CD pipeline
        const isInPipeline = process.env.CI || process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI;
        console.log(`Running in pipeline: ${isInPipeline ? 'Yes' : 'No'}`);

        if (isInPipeline) {
            console.log('Using pipeline-specific authentication approach...');
            // Option 1: Use pre-generated auth token if available
            if (process.env.AUTH_TOKEN) {
                console.log('Setting pre-generated auth token...');
                // Set the token in localStorage or cookies as needed
                await page.evaluate((token) => {
                    localStorage.setItem('auth_token', token);
                }, process.env.AUTH_TOKEN);

                // Navigate directly to home page
                await page.goto(testData.urls.expectedHomeUrl);
            } else {
                // Option 2: Use headful mode for authentication in pipeline
                console.log('Using headful mode for authentication...');

                // Handle Azure AD B2C login flow with extended timeouts
                await loginPage.loginWithExtendedTimeouts(
                    process.env.AZURE_AD_B2C_USERNAME,
                    process.env.AZURE_AD_B2C_PASSWORD
                );

                // Take screenshot for debugging
                await page.screenshot({ path: 'auth-after-login.png', fullPage: true });
                console.log(`Current URL after login attempt: ${page.url()}`);

                // Use a more flexible URL check
                if (page.url().includes('auditmypayrollv1.b2clogin.com')) {
                    console.log('Still on login page, authentication failed in pipeline');
                    throw new Error('Authentication failed in pipeline environment');
                }
            }
        } else {
            // Local environment - use normal login flow
            console.log('Using standard authentication flow...');

            // Dynamically select credentials based on the ROLE environment variable
            const credentials = testData.roles[process.env.ROLE || 'basic_user']; // Default to 'basic_user'

            if (!credentials) {
                throw new Error(`No credentials found for role: ${process.env.ROLE}`);
            }

            console.log(`Logging in as ${process.env.ROLE || 'basic_user'}...`);
            await loginPage.login(credentials.username, credentials.password);
            const [response] = await Promise.all([
                page.waitForResponse((resp) =>
                    resp.url().includes('https://dev-compliancer-app-service-1.azurewebsites.net/api/locations/suburbs') && resp.status() === 200, { timeout: 60000 })
            ]);
            await response.json();
            console.log('Login flow completed');

        }

        // Verify successful login with more flexible approach
        console.log('Verifying successful login...');
        console.log(`Current URL: ${page.url()}`);
        console.log(`Expected URL: ${testData.urls.expectedAdminUserHomeUrl}`);

        // Use a more flexible check for pipeline environments
        if (isInPipeline) {
            // Just check if we're not on the login page anymore
            const isOnLoginPage = page.url().includes('b2clogin.com');
            if (!isOnLoginPage) {
                console.log('Successfully navigated away from login page');
            } else {
                throw new Error('Still on login page after authentication attempt');
            }
        } else {
            const expectedHomeUrlKey = `expected${role.charAt(0).toUpperCase() + role.slice(1)}HomeUrl`;
            const expectedHomeUrl = testData.urls[expectedHomeUrlKey];

            // For local environment, use the exact URL check
            await expect(page).toHaveURL(expectedHomeUrl, { timeout: 60000 });
        }

        // Save authentication state
        console.log('Saving authentication state...');

        await page.context().storageState({ path: authFilePath });
        console.log(`Authentication state saved to ${authFilePath}`);

        // await page.evaluate(() => {
        //     localStorage.clear(); // Clear local storage if needed
        // });

        console.log('Authentication setup completed successfully');
    } catch (error) {
        console.error('Authentication setup failed:', error);
        await page.screenshot({ path: 'auth-setup-error.png', fullPage: true });
        throw error;
    }
});