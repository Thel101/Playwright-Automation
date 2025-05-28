const BasePage = require('../../../utils/BasePage');
const testData = require('../testData/userData.json');


class ProfileSettingsPage extends BasePage {
    constructor(page) {
        super(page);
        this.urls = testData.urls;// Selectors for Profile Settings section
    }

    async waitForChangePasswordPageLoad() {
        console.log('Waiting for profile settings page to load...');
        await this.page.goto(this.urls.changePasswordUrl);
    }
    async getHeadings() {
        return this.page.getByRole('heading', { name: 'Change Password' });
    }

    async getChangePasswordFields() {

        const currentPasswordField = this.page.locator('input[name="currentPassword"]');
        const newPasswordField = this.page.locator('input[name="newPassword"]');
        const confirmPasswordField = this.page.locator('input[name="confirmPassword"]');
        return [currentPasswordField, newPasswordField, confirmPasswordField];
    }

    async getChangePasswordButton() {
        return this.page.getByRole('button', { name: 'Change' });
    }

    async checkPasswordTooltipIcon() {
        const newPasswordLabel = this.page.locator('label', { hasText: 'New Password' });
        const infoIcon = newPasswordLabel.locator('img.tooltip-icon');
        return infoIcon;
    }
    async checkTooltipVisibility() {
        const infoIcon = await this.checkPasswordTooltipIcon();
        await infoIcon.hover();
        const tooltip = this.page.locator('div.custom-tooltip', { hasText: 'Your password must meet the following criteria' });
        return tooltip;
    }
    async fillPasswordFields(currentPassword, newPassword, confirmPassword) {
        const [currentPasswordField, newPasswordField, confirmPasswordField] = await this.getChangePasswordFields();

        await this.page.waitForTimeout(3000); // Wait for 1 second to simulate user input delay
        await currentPasswordField.fill(currentPassword);

        await this.page.waitForTimeout(3000);
        await newPasswordField.fill(newPassword);

        await this.page.waitForTimeout(3000);
        await confirmPasswordField.fill(confirmPassword);
    }
    async checkErrorMessage() {
        const errorMessage = this.page.locator('div.popup');
        const errorTitle = errorMessage.locator('h1.popup-title', { hasText: 'Something went wrong' });
        const errorDescription = errorMessage.locator('p.popup-message');
        return [errorTitle, errorDescription];
    }
    async checkInlineErrorMessage() {
        const inlineError = this.page.locator('span.error-messages');
        return inlineError;
    }


}
module.exports = ProfileSettingsPage;