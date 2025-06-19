const BasePage = require('../../../utils/BasePage');
const testData = require('../testData/userData.json');


class ProfileSettingsPage extends BasePage {
    constructor(page) {
        super(page);
        this.selectors = testData.elements;
        this.urls = testData.urls;// Selectors for Profile Settings section
    }

    async waitForProfileSettingsPageLoad() {
        console.log('Waiting for profile settings page to load...');
        await this.page.goto(this.urls.profileUrl);
    }
    async getHeadings() {
        const heading1 = this.page.getByRole('heading', { name: 'Profile Settings' });
        const heading2 = this.page.getByRole('heading', { name: 'Password' });
        return [heading1, heading2];
    }

    async getProfileInformationFields() {

        const nameField = this.page.locator('input[name="Name"]');
        const positionField = this.page.locator('input[name="Position"]');
        const emailField = this.page.locator('input[name="Email"]');
        return [nameField, positionField, emailField];
    }
    async getChangePasswordButton() {
        const pwd_button = this.page.getByRole('button', { name: 'Change Password' });
        return pwd_button;
    }


}
module.exports = ProfileSettingsPage;