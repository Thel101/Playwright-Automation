const { test: setup } = require('@playwright/test');
const AuthHelper = require('./utils/authHelper');

setup('Setting up Authenticate', async ({ page, context }) => {
    await AuthHelper.loginAndSaveState(page, context);
});
