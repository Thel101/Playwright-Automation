const BasePage = require('../../../../utils/BasePage');
const testData = require('../testData/loginData.json');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        // Using selectors from testData for better maintainability
        this.selectors = testData.elements;
        this.apiData = null;
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
            const [response] = await Promise.all([
                this.page.waitForResponse((resp) =>
                    resp.url().includes('https://dev-compliancer-app-service-1.azurewebsites.net/api/locations/suburbs') && resp.status() === 200),
            ]);
            await response.json();
            console.log('Login flow completed');
            // This is a no-op, but it can be useful for debugging
        } catch (error) {
            console.error('Login flow failed:', error);
            await this.page.screenshot({ path: 'tests/features/auth/login/screenshots/login-flow-error.png', fullPage: true });
            throw error;
        }
    }
    async logout() {
        console.log('Logging out...');
        try {
            await this.page.getByText('Logout').click();
            await this.page.getByRole('button', { name: 'Log Out' }).click();
            console.log('Logout successful');

        } catch (error) {
            console.error('Logout failed:', error);
            await this.page.screenshot({ path: 'tests/features/auth/login/screenshots/logout-error.png', fullPage: true });
            throw error;
        }
    }
    async enterCompany(companyName) {
        await this.page.getByRole('cell', { name: `${companyName}` }).click();
        await this.page.getByRole('button', { name: 'Confirm' }).click();
    }
    async getApiData() {
        if (!this.apiData) {
            throw new Error('API data is not available. Please call login() first.');
        }
        return this.apiData;
    }


    // Add this method to your LoginPage class
    async loginWithExtendedTimeouts(username, password) {
        console.log('Starting Azure AD B2C login flow with extended timeouts...');

        try {
            // Step 1: Click Connect button to initiate Azure AD B2C flow
            console.log('Clicking Connect button...');
            await this.page.waitForSelector(this.selectors.connectButton, { timeout: 120000 });
            await this.page.locator(this.selectors.connectButton).click();
            await this.page.waitForLoadState('networkidle', { timeout: 180000 });

            // Log current URL for debugging
            console.log(`URL after clicking Connect: ${this.page.url()}`);

            // Step 2: Wait for and fill in email with extra debugging
            console.log('Entering username:', username ? 'provided' : 'missing');
            await this.page.waitForSelector(this.selectors.emailInput, { state: 'visible', timeout: 120000 });

            // Take screenshot before entering email
            await this.page.screenshot({ path: 'before-email-entry.png' });

            await this.page.locator(this.selectors.emailInput).fill(username);
            await this.page.keyboard.press('Enter');
            await this.page.waitForLoadState('networkidle', { timeout: 120000 });

            // Log current URL for debugging
            console.log(`URL after entering username: ${this.page.url()}`);

            // Step 3: Wait for and fill in password
            console.log('Entering password:', password ? 'provided' : 'missing');
            await this.page.waitForSelector(this.selectors.passwordInput, { state: 'visible', timeout: 120000 });

            // Take screenshot before entering password
            await this.page.screenshot({ path: 'before-password-entry.png' });

            await this.page.locator(this.selectors.passwordInput).fill(password);

            // Step 4: Click submit button
            console.log('Submitting login form...');
            await this.page.locator(this.selectors.submitButton).click();

            // Step 5: Wait for navigation to complete with extra time
            await this.page.waitForLoadState('networkidle', { timeout: 180000 });
            console.log(`URL after login submission: ${this.page.url()}`);

            // Add extra wait time for any additional redirects
            await this.page.waitForTimeout(10000);
            console.log('Login flow completed with extended timeouts');
        } catch (error) {
            console.error('Login flow failed with extended timeouts:', error);
            console.error(`Current URL: ${this.page.url()}`);
            await this.page.screenshot({ path: 'login-flow-extended-error.png', fullPage: true });
            throw error;
        }
    }
}

module.exports = LoginPage;
