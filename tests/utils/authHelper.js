const LoginPage = require('../features/auth/login/pageObjects/LoginPage');
const testData = require('../features/auth/login/testData/loginData.json');

class AuthHelper {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
    }

    async login(username , password ) {
        console.log('Performing login with AuthHelper...');
        await this.loginPage.login(username, password);
        await this.page.waitForLoadState('networkidle');
        console.log('Login completed');
    }

    async logout() {
        console.log('Performing logout...');
        await this.page.click(testData.elements.logoutButton);
        await this.page.waitForLoadState('networkidle');
        console.log('Logout completed');
    }

    async clearSession() {
        console.log('Clearing session...');
        await this.page.evaluate(() => {
            window.localStorage.clear();
            window.sessionStorage.clear();
        });
        await this.page.context().clearCookies();
        console.log('Session cleared');
    }
}

module.exports = AuthHelper;
