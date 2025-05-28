const { test, expect } = require('@playwright/test');
const ProfileSettingsPage = require('./pageObjects/profileSettingsPage');
const testData = require('./testData/userData.json');

// Dashboard tests should only run in authenticated project
test.use({ project: 'edge-authenticated-profile' });

test.describe('Profile Settings Page', () => {
  let profilePage;

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfileSettingsPage(page);
    await profilePage.waitForProfileSettingsPageLoad();
  });

  test('Check Profile Settings and Password sections', async () => {
        const [heading1, heading2] = await profilePage.getHeadings();
        await expect(heading1).toBeVisible();
        await expect(heading2).toBeVisible();
  });

  test('Verify profile settings fields', async () => {
    const [nameField, positionField, emailField] = await profilePage.getProfileInformationFields();
    await expect(nameField).toBeVisible();
    await expect(nameField).toHaveValue('Phyu');
    await expect(nameField).toBeDisabled();
    console.log('Name field checking completed');

    await expect(positionField).toBeVisible();
    await expect(positionField).toHaveValue('QA');
    await expect(positionField).toBeDisabled();
    console.log('Position field checking completed');

    await expect(emailField).toBeVisible();
    await expect(emailField).toHaveValue('pkyaw@dight.ai');
    await expect(emailField).toBeDisabled();
    console.log('Email field checking completed');
  });

  test('Verify change password button', async () => {
    const pwd_button = await profilePage.getChangePasswordButton();
    await expect(pwd_button).toBeVisible();
    await expect(pwd_button).toBeEnabled();
  });
});