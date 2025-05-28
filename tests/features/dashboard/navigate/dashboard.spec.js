const { test, expect } = require('@playwright/test');
const DashboardPage = require('./pageObjects/DashboardPage');
const testData = require('./testData/dashboardData.json');

// Dashboard tests should only run in authenticated project
test.use({ project: 'edge-authenticated-dashboard' });

test.describe('Dashboard Navigation', () => {
    let dashboardPage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        await page.goto(testData.urls.baseUrl);
        await page.waitForLoadState('networkidle');
    });

    // test('TC3492 - should load dashboard when authenticated ', async ({ page }) => {
    //     test.info().annotations.push({
    //         type: 'testCaseId',
    //         description: '3164'
    //     });

    //     try {
    //         // Verify we're on the dashboard page
    //         console.log('Checking if redirected to dashboard page...');
    //         await expect(page).toHaveURL(testData.urls.expectedDashboardUrl, { timeout: 30000 });

    //         // Wait for dashboard elements using page object
    //         await dashboardPage.waitForDashboardLoad();

    //         // Verify user button is visible
    //         await expect(page.locator('#user-button')).toBeVisible();

    //         // Take a screenshot for verification
    //         await page.screenshot({ path: 'tests/features/dashboard/navigate/screenshots/authenticated-dashboard.png', fullPage: true });
    //         console.log('Test completed successfully');
    //     } catch (error) {
    //         console.error('Test failed:', error);
    //         await page.screenshot({ path: 'tests/features/dashboard/navigate/screenshots/auth-error.png', fullPage: true });
    //         throw error;
    //     }
    // });
    test('Check Auditer components on dashboard', async ({ page }) => {

        const autierSection = await dashboardPage.checkAutierSection();
        await expect(autierSection).toBeVisible();
        console.log('Autier section is visible');

        const [requestText, contactUsButton] = await dashboardPage.checkAuditerButtons();
        await expect(requestText).toBeVisible();
        console.log('Request text is visible');

    });
    test('Check Compliancer component on dashboard', async ({ page }) => {
        const compliancerSection = await dashboardPage.checkCompliancerSection();
        await expect(compliancerSection).toBeVisible();
        console.log('Compliancer section is visible');

        const pillarsComponent = await dashboardPage.checkPillarsComponent();
        await expect(pillarsComponent).toHaveCount(3);
        console.log('Pillars component is visible with 3 items');

        const carouselButtons = await dashboardPage.checkCarouselButtons();
        await expect(carouselButtons.nextButton).toBeVisible();
        await expect(carouselButtons.prevButton).toBeVisible();
    });
    test('Check News Feed component on dashboard', async ({ page }) => {
        const newsFeedSection = await dashboardPage.checkNewsFeedSection();
        await expect(newsFeedSection).toBeVisible();
        console.log('News Feed section is visible');

        const [newsFeedLinks, footer] = await dashboardPage.checkNewsFeedComponents();
        await expect(newsFeedLinks).toHaveCount(4);
        await expect(footer).toBeVisible();
    });

});
