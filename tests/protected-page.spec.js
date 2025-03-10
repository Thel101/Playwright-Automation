const { test, expect } = require('@playwright/test');
const testData = require('./testData/loginData.json');

// Protected page tests should only run in authenticated project
test.use({ project: 'authenticated' });

// This will use the authenticated context
test.describe('Protected Pages', () => {
    test('should access home page when authenticated', async ({ page }) => {
        // No need to login - we're using the authenticated state
        await page.goto(testData.urls.baseUrl);
        
        // Should be redirected to home page automatically
        await expect(page).toHaveURL(testData.urls.expectedHomeUrl);
        
        // Add your test assertions here
        await expect(page.locator('h1')).toBeVisible();
    });
});
