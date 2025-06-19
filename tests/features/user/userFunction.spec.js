const { test, expect } = require('@playwright/test');
const CreateUserPage = require('./pageObjects/createUserPage');
const testData = require('./testData/userData.json');

// Dashboard tests should only run in authenticated project
test.use({ project: 'chrome-authenticated-profile' });

test.describe('Admin Navigation', () => {
    let createuserPage;

    test('create user', async ({ page }) => {
        createuserPage = new CreateUserPage(page);
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

