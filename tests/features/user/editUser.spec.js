const { test, expect } = require('@playwright/test');
const EditUserPage = require('./pageObjects/editUserPage');
const testData = require('./testData/userData.json');

// Dashboard tests should only run in authenticated project
test.use({ project: 'chrome-authenticated' });

test.describe('Edit User', () => {
    let edituserPage;

    test.beforeEach(async ({ page }) => {
        edituserPage = new EditUserPage(page);
        await page.goto(testData.urls.userListUrl);
        await page.waitForLoadState('networkidle');
    });

    test('fetch user to edit', async ({ page }) => {
       
        try {
            // Verify we're on the dashboard page
            await edituserPage.fetchUserToEdit();
        } catch (error) {
            console.error('Test failed:', error);
            await page.screenshot({ path: 'tests/features/dashboard/navigate/screenshots/auth-error.png', fullPage: true });
            throw error;
        }
    });

});
