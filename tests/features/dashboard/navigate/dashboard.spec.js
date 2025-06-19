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
