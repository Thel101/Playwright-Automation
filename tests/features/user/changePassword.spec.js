const { test, expect } = require('@playwright/test');
const ChangePasswordPage = require('./pageObjects/changePasswordPage');
const testData = require('./testData/userData.json');

// Dashboard tests should only run in authenticated project
test.use({ project: 'edge-authenticated-profile' });

test.describe('Change Password Page', () => {
    let changePasswordPage;
    let currentPassword = testData.passwords.currentPassword;
    let newPassword = testData.passwords.newPassword;
    let confirmPassword = testData.passwords.confirmNewPassword;
    let wrongCurrentPassword = testData.passwords.wrongCurrentPassword;
    let invalidNewPassword = testData.passwords.invalidPassword;

    test.beforeEach(async ({ page }) => {
        changePasswordPage = new ChangePasswordPage(page);
        await changePasswordPage.waitForChangePasswordPageLoad();
    });

    test('Check Change Password heading', async () => {
        const heading = await changePasswordPage.getHeadings();
        await expect(heading).toBeVisible();
    });
    test('Check Change Password fields', async () => {
        const [currentPasswordField, newPasswordField, confirmPasswordField] = await changePasswordPage.getChangePasswordFields();
        const button = await changePasswordPage.getChangePasswordButton();
        await expect(currentPasswordField).toBeVisible();
        await expect(newPasswordField).toBeVisible();
        await expect(confirmPasswordField).toBeVisible();
        await expect(button).toBeDisabled();
    });
    test('Check password tooltip icon', async () => {
        const infoIcon = await changePasswordPage.checkPasswordTooltipIcon();
        await expect(infoIcon).toBeVisible();

        const tooltip = await changePasswordPage.checkTooltipVisibility();
        await expect(tooltip).toBeVisible();

        await expect(tooltip).toContainText('At least 8 characters long');
        await expect(tooltip).toContainText('At least one uppercase letter');
        await expect(tooltip).toContainText('At least one lowercase letter');
        await expect(tooltip).toContainText('At least one number');
        await expect(tooltip).toContainText('At least one special character'); // Note: The image shows ']' at the end, but usually it's ')'
        await expect(tooltip).toContainText('Password up to 64 characters long');

    });
    test('check same current and new password', async ({page}) => {

        await changePasswordPage.fillPasswordFields(currentPassword, currentPassword, currentPassword);

        const button = await changePasswordPage.getChangePasswordButton();
        await page.waitForTimeout(3000); // Wait for 1 second to simulate user input delay
        await button.click();

        const [errorTitle, errorDescription] = await changePasswordPage.checkErrorMessage();
        await expect(errorTitle).toBeVisible();
        await expect(errorDescription).toBeVisible();
        await expect(errorDescription).toContainText('new password should not be your current password.');

    
    });
    test('check new password and confirm password mismatch', async () => {
        await changePasswordPage.fillPasswordFields(currentPassword, newPassword, currentPassword);
        const inlineError = await changePasswordPage.checkInlineErrorMessage();
        await expect(inlineError).toBeVisible();
        await expect(inlineError).toContainText('Passwords must match');

    });
    test('check wrong current password', async ({page}) => {
        await changePasswordPage.fillPasswordFields(wrongCurrentPassword, newPassword, confirmPassword);

        const button = await changePasswordPage.getChangePasswordButton();
        await page.waitForTimeout(3000); // Wait for 1 second to simulate user input delay
        await button.click();

        const [errorTitle, errorDescription] = await changePasswordPage.checkErrorMessage();
        await expect(errorTitle).toBeVisible();
        await expect(errorDescription).toBeVisible();
        await expect(errorDescription).toContainText("user's current password is incorrect");
    });


});