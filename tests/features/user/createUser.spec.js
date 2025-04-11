const { test, expect } = require('@playwright/test');
const CreateUserPage = require('./pageObjects/createUserPage');
const testData = require('./testData/userData.json');

// Dashboard tests should only run in authenticated project
test.use({ project: 'chrome-authenticated' });

test.describe('Admin Navigation', () => {
    let createuserPage;

    test.beforeEach(async ({ page }) => {
        createuserPage = new CreateUserPage(page);
        await page.goto(testData.urls.baseUrl);
        await page.waitForLoadState('networkidle');
    });

    test('direct to create user page', async ({ page }) => {
       
        try {
            // Verify we're on the dashboard page
            console.log('Checking if redirected to dashboard page...');
            // Wait for dashboard elements using page object
            await createuserPage.directToAdminPage();
            await createuserPage.waitForAdminPageLoad();
            
 
            const { titleText, subTitleText } = await createuserPage.waitForAdminPageLoad();

            // You can now assert or log the text content
            console.log('Admin Page Title:', titleText);
            console.log('Admin Page Subtitle:', subTitleText);
            console.log('Test completed successfully');
        } catch (error) {
            console.error('Test failed:', error);
            await page.screenshot({ path: 'tests/features/dashboard/navigate/screenshots/auth-error.png', fullPage: true });
            throw error;
        }
    });
    test('create user', async ({ page }) => {
        try{
            const createuserPageTitle = await createuserPage.navigateToUserList();
            await expect(createuserPageTitle).toHaveText('Create User Information', { timeout: 30000 });

            await createuserPage.createNewUser()
            console.log('new user created successfully');
        }
        catch (error){
            console.error('Test failed:', error);
            await page.screenshot({ path: 'tests/features/user/screenshots/crete-user.png', fullPage: true });
            throw error;
        }
    })

});
