const { test, expect } = require('@playwright/test');
const DashboardPage = require('./pageObjects/DashboardPage');
const testData = require('./testData.json');

// Dashboard tests should only run in authenticated project
test.use({ project: 'authenticated' });

test.describe('Dashboard Features', () => {
    let dashboardPage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        
        // Wait for page load with authentication
        await page.goto(testData.urls.baseUrl, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await page.waitForLoadState('networkidle');
        
        // Log current URL for debugging
        console.log('Current URL:', page.url());
    });

    test('should load dashboard when authenticated', async ({ page }) => {
        // Enable console logging
        page.on('console', msg => console.log(msg.text()));
        
        try {
            // Verify we're on the dashboard page
            console.log('Checking if redirected to dashboard page...');
            await expect(page).toHaveURL(testData.urls.expectedDashboardUrl, { timeout: 30000 });
            
            // Wait for dashboard elements using page object
            await dashboardPage.waitForDashboardLoad();
            
            // Verify navigation elements
            await expect(page.locator('#user-button')).toBeVisible();
            
            // Take a screenshot for verification
            await page.screenshot({ path: 'tests/features/dashboard/navigate/screenshots/authenticated-dashboard.png' });
            console.log('Test completed successfully');
        } catch (error) {
            console.error('Test failed:', error);
            await page.screenshot({ path: 'tests/features/dashboard/navigate/screenshots/auth-error.png' });
            throw error;
        }
    });
});
