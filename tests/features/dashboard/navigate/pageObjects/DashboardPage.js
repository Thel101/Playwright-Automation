const BasePage = require('../../../../utils/BasePage');
const testData = require('../testData.json');

class DashboardPage extends BasePage {
    constructor(page) {
        super(page);
        // Using selectors from testData for better maintainability
        this.selectors = testData.elements;
    }

    async waitForDashboardLoad() {
       // await this.page.waitForSelector(this.selectors.navigation.mainNav, { state: 'visible', timeout: 30000 });
        await this.page.waitForLoadState('networkidle');
    }

    async getUserProfileInfo() {
        return await this.page.locator(this.selectors.navigation.userProfile).textContent();
    }

    async navigateToSettings() {
        await this.page.click(this.selectors.navigation.settingsButton);
        await this.page.waitForLoadState('networkidle');
    }

    async logout() {
        await this.page.click(this.selectors.navigation.logoutButton);
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = DashboardPage;
