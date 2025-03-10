const BasePage = require('../../../../utils/BasePage');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        // Selectors for login page elements based on Azure AD B2C configuration
        this.emailInput = '#email';
        this.passwordInput = '#password';
        this.connectButton = 'button:has-text("Connect")';
        this.submitButton = '[type="submit"]';
    }

    async login(username, password) {
        console.log('Starting login process...');
        
        // Click the Connect button to initiate Azure AD B2C login
        await this.page.locator(this.connectButton).click();
        
        // Wait for and fill in the email field
        await this.page.waitForSelector(this.emailInput, { state: 'visible', timeout: 30000 });
        await this.type(this.emailInput, username);
        
        // Wait for and fill in the password field
        await this.page.waitForSelector(this.passwordInput, { state: 'visible', timeout: 30000 });
        await this.type(this.passwordInput, password);
        
        // Click the submit button
        await this.page.locator(this.submitButton).click();
        
        // Wait for navigation to complete
        await this.page.waitForLoadState('networkidle');
        console.log('Login process completed');
    }

    async type(selector, text) {
        await this.page.locator(selector).fill(text);
    }
}

module.exports = LoginPage;
