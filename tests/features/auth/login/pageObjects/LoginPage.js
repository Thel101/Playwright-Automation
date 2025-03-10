const BasePage = require('../../../../utils/BasePage');
const testData = require('../testData/loginData.json');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        // Using selectors from testData for better maintainability
        this.selectors = testData.elements;
    }

    async login(username, password) {
        console.log('Starting Azure AD B2C login flow...');
        
        try {
            // Step 1: Click Connect button to initiate Azure AD B2C flow
            console.log('Clicking Connect button...');
            await this.page.waitForSelector(this.selectors.connectButton, { timeout: 60000 });
            await this.page.locator(this.selectors.connectButton).click();
            await this.page.waitForLoadState('networkidle', { timeout: 120000 });
            
            // Step 2: Wait for and fill in email
            console.log('Entering username...');
            await this.page.waitForSelector(this.selectors.emailInput, { state: 'visible', timeout: 60000 });
            await this.page.locator(this.selectors.emailInput).fill(username);
            await this.page.keyboard.press('Enter');
            await this.page.waitForLoadState('networkidle', { timeout: 60000 });
            
            // Step 3: Wait for and fill in password
            console.log('Entering password...');
            await this.page.waitForSelector(this.selectors.passwordInput, { state: 'visible', timeout: 60000 });
            await this.page.locator(this.selectors.passwordInput).fill(password);
            
            // Step 4: Click submit button
            console.log('Submitting login form...');
            await this.page.locator(this.selectors.submitButton).click();
            
            // Step 5: Wait for navigation to complete
            await this.page.waitForLoadState('networkidle', { timeout: 60000 });
            console.log('Login flow completed');
        } catch (error) {
            console.error('Login flow failed:', error);
            await this.page.screenshot({ path: 'tests/features/auth/login/screenshots/login-flow-error.png', fullPage: true });
            throw error;
        }
    }
}

module.exports = LoginPage;
