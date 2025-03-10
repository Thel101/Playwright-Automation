const LoginPage = require('../pageObjects/LoginPage');

class AuthHelper {
    static async loginAndSaveState(page, context) {
        const loginPage = new LoginPage(page);
        const testData = require('../testData/loginData.json');
        
        // Navigate and login
        await page.goto(testData.urls.baseUrl);
        await loginPage.login(testData.validUser.username, testData.validUser.password);
        
        // Wait for successful login
        await page.waitForURL(testData.urls.expectedDashboardUrl);
        
        // Save signed-in state to 'auth.json'
        await context.storageState({ path: './auth.json' });
    }
}

module.exports = AuthHelper;
