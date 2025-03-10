const LoginPage = require('../pageObjects/LoginPage');

class AuthHelper {
    static async loginAndSaveState(page, context) {
        const loginPage = new LoginPage(page);
        const testData = require('../testData/loginData.json');
        
        console.log('Starting authentication setup...');
        
        // Navigate and login
        await page.goto(testData.urls.baseUrl);
        await loginPage.login(testData.validUser.username, testData.validUser.password);
        
        // Wait for successful login and navigation
        console.log('Waiting for successful login...');
        await page.waitForURL(testData.urls.expectedHomeUrl);
        
        // Wait for any additional session data to be set
        await page.waitForLoadState('networkidle');
        
        console.log('Saving authentication state...');
        // Save signed-in state to 'auth.json'
        await context.storageState({ path: 'auth.json' });
        console.log('Authentication state saved successfully');
    }
}

module.exports = AuthHelper;
