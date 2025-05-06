const BasePage = require('../../../utils/BasePage');

class ManageAssessment extends BasePage {
    constructor(page) {
        super(page);
    }

async navigateToManageAssessment() {
    await this.page.goto('https://app-dev.auditmypayroll.com.au/home')
    await this.page.getByRole('link', { name: 'image Business Settings' }).click();
    await this.page.getByText('Manage Assessment').click();
    await this.page.getByRole('button', { name: 'open combobox' }).first().click();
    await this.page.getByRole('option', { name: 'People' }).click();
    await this.page.getByRole('button', { name: 'open combobox' }).nth(1).click();
    await this.page.getByRole('option', { name: 'Snoe' }).click();
    await this.page.locator('div').filter({ hasText: /^Please specify the reason for reassigning$/ }).getByLabel('open combobox').click();
    await this.page.getByRole('option', { name: 'Workload Management - The' }).click();
    await this.page.getByRole('button', { name: 'Reassign' }).click();
    await this.page.getByRole('button', { name: 'Save' }).dblclick();
    await this.page.getByRole('button', { name: 'OK' }).click();
}

   
}
module.exports = ManageAssessment;
