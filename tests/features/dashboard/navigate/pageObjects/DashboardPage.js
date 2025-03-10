const BasePage = require('../../../../utils/BasePage');
const testData = require('../testData/dashboardData.json');

class DashboardPage extends BasePage {
    constructor(page) {
        super(page);
        // Using selectors from testData for better maintainability
        this.selectors = testData.elements;
    }

    async waitForDashboardLoad() {
        console.log('Waiting for dashboard to load...');
        await this.page.waitForSelector(this.selectors.navigation.mainNav, { 
            state: 'visible', 
            timeout: 30000 
        });
        await this.page.waitForLoadState('networkidle');
        console.log('Dashboard loaded successfully');
    }

    async getUserProfileInfo() {
        console.log('Getting user profile information...');
        const profileElement = this.page.locator(this.selectors.navigation.userProfile);
        await profileElement.waitFor({ state: 'visible', timeout: 30000 });
        const profileText = await profileElement.textContent();
        console.log('User profile info retrieved:', profileText);
        return profileText;
    }

    async navigateToSettings() {
        console.log('Navigating to settings...');
        const settingsButton = this.page.locator(this.selectors.navigation.settingsButton);
        await settingsButton.waitFor({ state: 'visible', timeout: 30000 });
        await settingsButton.click();
        await this.page.waitForLoadState('networkidle');
        console.log('Navigated to settings page');
    }

    async logout() {
        console.log('Logging out...');
        const logoutButton = this.page.locator(this.selectors.navigation.logoutButton);
        await logoutButton.waitFor({ state: 'visible', timeout: 30000 });
        await logoutButton.click();
        await this.page.waitForLoadState('networkidle');
        console.log('Logged out successfully');
    }
}

module.exports = DashboardPage;
