const BasePage = require('../../../utils/BasePage');
const testData = require('../testData/userData.json');

class editUserPage extends BasePage {
    constructor(page) {
        super(page);
        this.selectors = testData.elements
        this.urls = testData.urls;
    }
    async checkInput(sectionSelector, inputSelector) {
        const section = this.page.locator(sectionSelector);
        const input = section.locator(inputSelector);
        const isDisabled = await input.isDisabled();
        return isDisabled;
    }
    async fetchUserToEdit() {
        const users = this.page.locator(this.selectors.userList, { timeout: 30000 });

        const lastUser = await users.locator('tr').nth(-1);
        await lastUser.waitFor({ state: 'visible', timeout: 30000 });
        await lastUser.locator(this.selectors.editButton).click();

        const companyNameIsDisabled = await this.checkInput(this.selectors.companyName, 'input#company-name-input-0-1');
        
        const userStatusIsDisabled = await this.checkInput(this.selectors.userStatus, 'input#status-input-0-1');
        const emailIsDisabled = await this.page.locator(this.selectors.email).isDisabled();
        console.log('Company Name disabled:', companyNameIsDisabled);
        console.log('User Status disabled:', userStatusIsDisabled);
        console.log('Email disabled:', emailIsDisabled);

    }


}

module.exports = editUserPage;
