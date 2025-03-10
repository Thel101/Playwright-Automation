const BasePage = require('./BasePage');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        // Initial login button
        this.connectButton = 'button:has-text("Connect")';
        
        // Azure AD B2C selectors
        this.emailInput = '#email';
        this.passwordInput = '#password';
        this.signInButton = '[type="submit"]';
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
    }

    async login(username, password) {
        console.log('Starting login process...');
        
        // Wait for initial page load
        await this.waitForPageLoad();
        
        // Click the initial Connect button and wait for Azure AD B2C page
        console.log('Waiting for Connect button...');
        await this.page.waitForSelector(this.connectButton, { state: 'visible', timeout: 30000 });
        console.log('Clicking Connect button...');
        await this.click(this.connectButton);
        
        // Wait for Azure AD B2C page load
        await this.waitForPageLoad();
        
        // Handle email input
        console.log('Waiting for email field...');
        await this.page.waitForSelector(this.emailInput, { state: 'visible', timeout: 30000 });
        console.log('Entering email:', username);
        await this.type(this.emailInput, username);

        // Handle password input
        console.log('Waiting for password field...');
        await this.page.waitForSelector(this.passwordInput, { state: 'visible', timeout: 30000 });
        console.log('Entering password...');
        await this.page.fill(this.passwordInput, password);
        
        // Click sign in and wait for navigation
        console.log('Waiting for sign in button...');
        await this.page.waitForSelector(this.signInButton, { state: 'visible', timeout: 30000 });
        console.log('Clicking sign in...');
        await this.click(this.signInButton);
        
        // Wait for navigation after login attempt
        console.log('Waiting for navigation...');
        try {
            await this.page.waitForNavigation({ 
                timeout: 60000,
                waitUntil: ['domcontentloaded', 'networkidle']
            });
            console.log('Navigation completed');
        } catch (error) {
            console.log('Navigation timeout or error - might be expected for invalid login');
            // Don't throw error as this might be an invalid login attempt
        }
    }
}

module.exports = LoginPage;
