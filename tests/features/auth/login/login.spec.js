require('dotenv').config();
console.log(`Environment Variables: ${process.env.ROLE}`);
const { test, expect } = require('@playwright/test');
const LoginPage = require('./pageObjects/LoginPage');
const testData = require('./testData/loginData.json');

const role = process.env.ROLE || 'basic_user'; // Default to 'basic_user' if ROLE is not set
const credentials = testData.roles[role];

if (!credentials) {
    throw new Error(`No credentials found for role: ${role}`);
}

// Login tests should only run in unauthenticated project
test.use({ project: 'chrome-unauthenticated' });
// Debug environment variables  

test.describe('Azure AD B2C Login', () => {
    let loginPage;
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await page.goto(testData.urls.baseUrl);
    });

    // test('should display error for invalid login', async ({ page }) => {

    //     try {
    //         console.log('Starting invalid login test...');
    //         await loginPage.login(testData.roles.invalidUser.username, testData.roles.invalidUser.password);

    //         // Azure B2C shows error in either a div with role=alert or text element
    //         console.log('Checking for error message...');
    //         const errorLocators = [
    //             'div[role="alert"]',
    //             'text=incorrect password',
    //             'text=Your password is incorrect',
    //             `text=We can't seem to find your account`,
    //             '#error_message',
    //             '.error-text'
    //         ];

    //         // Try each possible error locator
    //         let errorFound = false;
    //         for (const locator of errorLocators) {
    //             try {
    //                 await expect(page.locator(locator)).toBeVisible({ timeout: 5000 });
    //                 console.log(`Found error message with locator: ${locator}`);
    //                 errorFound = true;
    //                 break;
    //             } catch (e) {
    //                 console.log(`No error found with locator: ${locator}`);
    //             }
    //         }

    //         if (!errorFound) {
    //             // Take screenshot for debugging if no error message found
    //             await page.screenshot({ path: 'tests/features/auth/login/screenshots/no-error-found.png', fullPage: true });
    //             throw new Error('Could not find error message with any known locator');
    //         }

    //         console.log('Invalid login test completed successfully');
    //     } catch (error) {
    //         console.error('Invalid login test failed:', error);
    //         await page.screenshot({ path: 'tests/features/auth/login/screenshots/invalid-login-error.png', fullPage: true });
    //         throw error;
    //     }
    // });

    test('should successfully login with single company super user', async ({ page }) => {


        try {
            console.log('Starting single company super user...');
            await loginPage.login(testData.roles.super_user.username, testData.roles.super_user.password);
            await page.waitForLoadState('networkidle', { timeout: 60000 });

            // Verify successful login
            await expect(page).toHaveURL(testData.urls.expectedSuper_userHomeUrl);
        
            console.log('Superuser login test completed successfully');

        } catch (error) {
            console.error('Superuser login test failed:', error);
            await page.screenshot({ path: 'tests/features/auth/login/screenshots/superuser-login-error.png', fullPage: true });
            throw error;
        }
    });
    test('should successfully login with admin user', async ({ page }) => {

        try {
            console.log('Starting admin user...');
            await loginPage.login(testData.roles.admin.username, testData.roles.admin.password);

            // Verify successful login
            await expect(page).toHaveURL(testData.urls.expectedAdminHomeUrl);
        
            console.log('Admin login test completed successfully');

        } catch (error) {
            console.error('Admin login test failed:', error);
            await page.screenshot({ path: 'tests/features/auth/login/screenshots/admin-login-error.png', fullPage: true });
            throw error;
        }
    });

});
