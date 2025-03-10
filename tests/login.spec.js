const { test, expect } = require('@playwright/test');
const LoginPage = require('./pageObjects/LoginPage');
const TestHelpers = require('./utils/testHelpers');

test.describe('Azure AD B2C Authentication', () => {
    let loginPage;
    let testData;

    test('should handle both valid and invalid login attempts', async ({ page, context }) => {
        // Enable console logging for debugging
        page.on('console', msg => console.log(msg.text()));
        
        loginPage = new LoginPage(page);
        testData = await TestHelpers.loadTestData('loginData.json');

        // Test invalid login first
        console.log('Starting invalid login test...');
        try {
            // Navigate to the page
            await page.goto(testData.urls.baseUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 60000
            });
            await page.waitForLoadState('networkidle');
            
            await loginPage.login(testData.invalidUser.username, testData.invalidUser.password);
            // Azure B2C typically shows an error message for invalid credentials
            await expect(page.locator('text=incorrect password')).toBeVisible();
            console.log('Invalid login test completed successfully');
        } catch (error) {
            console.error('Invalid login test failed:', error);
            await page.screenshot({ path: 'invalid-login-error.png' });
        }

        // Clear cookies and storage between tests
        await context.clearCookies();
        await page.evaluate(() => window.localStorage.clear());
        await page.evaluate(() => window.sessionStorage.clear());

        // Test valid login
        console.log('Starting valid login test...');
        try {
            // Navigate to the page again
            await page.goto(testData.urls.baseUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 60000
            });
            await page.waitForLoadState('networkidle');
            
            await loginPage.login(testData.validUser.username, testData.validUser.password);
            // After successful login, we should be redirected to the dashboard
            await expect(page).toHaveURL(testData.urls.expectedDashboardUrl);
            console.log('Valid login test completed successfully');
        } catch (error) {
            console.error('Valid login test failed:', error);
            await page.screenshot({ path: 'valid-login-error.png' });
            throw error;
        }
    });
});
