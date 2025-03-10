const { test: setup } = require('@playwright/test');
const AuthHelper = require('./utils/authHelper');
const testData = require('./features/auth/login/testData.json');

setup('Setting up Authenticate', async ({ page, context }) => {
    await AuthHelper.loginAndSaveState(page, context);
});
