require('dotenv').config();
const { test: setup, expect } = require('@playwright/test');
const LoginPage = require('./features/auth/login/pageObjects/LoginPage');
const testData = require('./features/auth/login/testData/loginData.json');



setup('Setting up Authenticate', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    try {
        console.log('Starting authentication setup...');
        await page.goto(testData.urls.baseUrl);
        console.log('Environment variables loaded:', {  
            username: process.env.AZURE_AD_B2C_USERNAME ? 'exists' : 'missing',  
            password: process.env.AZURE_AD_B2C_PASSWORD ? 'exists' : 'missing'  
        });
        // Wait for and click Connect button
        console.log('Clicking Connect button...');
        await page.waitForSelector('button:has-text("Connect")', { timeout: 30000 });
        await page.click('button:has-text("Connect")');
        
        // Handle Azure AD B2C login flow
        console.log('Starting Azure AD B2C login...');
        await loginPage.login(process.env.AZURE_AD_B2C_USERNAME, process.env.AZURE_AD_B2C_PASSWORD);
        
        // Verify successful login
        console.log('Verifying successful login...');
        await expect(page).toHaveURL(testData.urls.expectedHomeUrl, { timeout: 60000 });
        
        // Save authentication state
        console.log('Saving authentication state...');
        await page.context().storageState({ path: 'auth.json' });
        
        console.log('Authentication setup completed successfully');
    } catch (error) {
        console.error('Authentication setup failed:', error);
        await page.screenshot({ path: 'auth-setup-error.png', fullPage: true });
        throw error;
    }
});
