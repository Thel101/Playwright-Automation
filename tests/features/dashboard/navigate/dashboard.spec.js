const { test, expect } = require('@playwright/test');
const DashboardPage = require('./pageObjects/DashboardPage');
const testData = require('./testData/dashboardData.json');

// Dashboard tests should only run in authenticated project
test.use({ project: 'chrome-authenticated' });

test.describe('Dashboard Navigation', () => {
    let dashboardPage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        page.on('console', msg => console.log(msg.text()));
        
        // Navigate to dashboard with authentication
        await page.goto(testData.urls.baseUrl, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await page.waitForLoadState('networkidle');
    });

    test('should load dashboard when authenticated @TC3164', async ({ page }) => {
        test.info().annotations.push({
            type: 'testCaseId',
            description: '3164'
        });
        
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

    // test('should display user profile information @TC3165', async ({ page }) => {
    //     test.info().annotations.push({
    //         type: 'testCaseId',
    //         description: '3165'
    //     });
        
    //     try {
    //         // Wait for dashboard to load
    //         await dashboardPage.waitForDashboardLoad();
            
    //         // Get and verify user profile info
    //         const userInfo = await dashboardPage.getUserProfileInfo();
    //         expect(userInfo).toBeTruthy();
            
    //         // Verify welcome message
    //         await expect(page.locator('#user-button')).toBeVisible();
            
    //         // Take a screenshot for verification
    //         await page.screenshot({ path: 'tests/features/dashboard/navigate/screenshots/user-profile.png' });
    //         console.log('User profile test completed successfully');
    //     } catch (error) {
    //         console.error('User profile test failed:', error);
    //         await page.screenshot({ path: 'tests/features/dashboard/navigate/screenshots/user-profile-error.png' });
    //         throw error;
    //     }
    // });

    // test('should navigate to settings page @TC3166', async ({ page }) => {
    //     test.info().annotations.push({
    //         type: 'testCaseId',
    //         description: '3166'
    //     });
        
    //     try {
    //         // Wait for dashboard to load
    //         await dashboardPage.waitForDashboardLoad();
            
    //         // Navigate to settings
    //         await dashboardPage.navigateToSettings();
            
    //         // Verify navigation
    //         await expect(page).toHaveURL(testData.urls.expectedSettingsUrl);
            
    //         // Take a screenshot for verification
    //         await page.screenshot({ path: 'tests/features/dashboard/navigate/screenshots/settings-page.png' });
    //         console.log('Settings navigation test completed successfully');
    //     } catch (error) {
    //         console.error('Settings navigation test failed:', error);
    //         await page.screenshot({ path: 'tests/features/dashboard/navigate/screenshots/settings-error.png' });
    //         throw error;
    //     }
    // });
});
