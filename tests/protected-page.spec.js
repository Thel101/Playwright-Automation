const { test, expect } = require('@playwright/test');
const testData = require('./testData/loginData.json');

// Protected page tests should only run in authenticated project
test.use({ project: 'authenticated' });

test.describe('Protected Pages', () => {
    test.beforeEach(async ({ page }) => {
        // Wait for page load with authentication
        await page.goto(testData.urls.baseUrl, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await page.waitForLoadState('networkidle');
        
        // Log current URL for debugging
        console.log('Current URL:', page.url());
    });

    test('should access dashboard when authenticated', async ({ page }) => {
        // Enable console logging
        page.on('console', msg => console.log(msg.text()));
        
        try {
            // Verify we're on the dashboard page
            console.log('Checking if redirected to dashboard page...');
            await expect(page).toHaveURL(testData.urls.expectedDashboardUrl, { timeout: 30000 });
            
            // Verify we have authenticated content by checking for common dashboard elements
            console.log('Checking for authenticated content...');
            
            // Check for user button
            await expect(page.locator('#user-button')).toBeVisible({ timeout: 30000 });            

            // Take a screenshot for verification
            await page.screenshot({ path: 'authenticated-dashboard.png' });
            console.log('Test completed successfully');
        } catch (error) {
            console.error('Test failed:', error);
            await page.screenshot({ path: 'auth-error.png' });
            throw error;
        }
    });
});
