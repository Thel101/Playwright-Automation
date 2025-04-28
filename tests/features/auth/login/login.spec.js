require('dotenv').config();
const { test, expect } = require('@playwright/test');
const LoginPage = require('./pageObjects/LoginPage');
const testData = require('./testData/loginData.json');


// Login tests should only run in unauthenticated project
test.use({ project: 'unauthenticated' });
// Debug environment variables  
console.log('Environment variables:', {  
    username: process.env.AZURE_AD_B2C_USERNAME ? 'exists' : 'missing',  
    password: process.env.AZURE_AD_B2C_PASSWORD ? 'exists' : 'missing'  
});
test.describe('Azure AD B2C Login', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await page.goto(testData.urls.baseUrl);
    });

    test('should display error for invalid login', async ({ page }) => {
        test.info().annotations.push({
            type: 'testCaseId',
            description: '3162'
        });
        
        try {
            console.log('Starting invalid login test...');
            await loginPage.login(testData.invalidUser.username, testData.invalidUser.password);
            
            // Azure B2C shows error in either a div with role=alert or text element
            console.log('Checking for error message...');
            const errorLocators = [
                'div[role="alert"]',
                'text=incorrect password',
                'text=Your password is incorrect',
                `text=We can't seem to find your account`,
                '#error_message',
                '.error-text'
            ];
            
            // Try each possible error locator
            let errorFound = false;
            for (const locator of errorLocators) {
                try {
                    await expect(page.locator(locator)).toBeVisible({ timeout: 5000 });
                    console.log(`Found error message with locator: ${locator}`);
                    errorFound = true;
                    break;
                } catch (e) {
                    console.log(`No error found with locator: ${locator}`);
                }
            }
            
            if (!errorFound) {
                // Take screenshot for debugging if no error message found
                await page.screenshot({ path: 'tests/features/auth/login/screenshots/no-error-found.png', fullPage: true });
                throw new Error('Could not find error message with any known locator');
            }
            
            console.log('Invalid login test completed successfully');
        } catch (error) {
            console.error('Invalid login test failed:', error);
            await page.screenshot({ path: 'tests/features/auth/login/screenshots/invalid-login-error.png', fullPage: true });
            throw error;
        }
    });

    test('should successfully login with valid credentials', async ({ page }) => {
        test.info().annotations.push({
            type: 'testCaseId',
            description: '3163'
        });
        
        try {
            console.log('Starting valid login test...');
            await loginPage.login(process.env.AZURE_AD_B2C_USERNAME, process.env.AZURE_AD_B2C_PASSWORD);
            
            // Verify successful login
            await expect(page).toHaveURL(testData.urls.expectedHomeUrl);
            console.log('Valid login test completed successfully');
        } catch (error) {
            console.error('Valid login test failed:', error);
            await page.screenshot({ path: 'tests/features/auth/login/screenshots/valid-login-error.png', fullPage: true });
            throw error;
        }
    });
});
