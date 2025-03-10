const { test: setup } = require('@playwright/test');
const LoginPage = require('./features/auth/login/pageObjects/LoginPage');
const testData = require('./features/auth/login/testData/loginData.json');

setup('authenticate', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    
    console.log('Starting authentication setup...');
    
    try {
        // Navigate to the base URL
        await page.goto(testData.urls.baseUrl);
        await page.waitForLoadState('networkidle');
        
        // Perform login with Azure AD B2C flow
        await loginPage.login(testData.validUser.username, testData.validUser.password);
        
        // Wait for successful login and navigation
        console.log('Waiting for successful login...');
        await page.waitForURL(testData.urls.expectedHomeUrl);
        await page.waitForLoadState('networkidle');
        
        console.log('Saving authentication state...');
        // Save signed-in state to 'auth.json'
        await context.storageState({ path: 'auth.json' });
        console.log('Authentication state saved successfully');
    } catch (error) {
        console.error('Authentication setup failed:', error);
        await page.screenshot({ path: 'tests/screenshots/auth-setup-error.png', fullPage: true });
        throw error;
    }
});
