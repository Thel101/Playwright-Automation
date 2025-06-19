const BasePage = require('../../../utils/BasePage');
const testData = require('../testData/assessmentData.json');

class ManageAssessment extends BasePage {
    constructor(page) {
        super(page);
    }

    async navigateToManageAssessment() {
        await this.page.goto(testData.urls.baseUrl);
        await this.page.locator('div').filter({ hasText: /^Business Settings$/ }).first().click();
        await this.page.getByText('Manage Assessment').click();

        await this.page.getByRole('button', { name: 'open combobox' }).first().click();
        await this.page.getByRole('option', { name: 'Mini Review' }).click();

        await this.page.getByRole('button', { name: 'open combobox' }).nth(1).click();
        await this.page.getByRole('option', { name: 'People' }).click();

        const assignedPerson = this.page.getByRole('button', { name: 'open combobox' }).nth(2);
        if (await assignedPerson.isVisible()) {
            await assignedPerson.click();
            const peopleList = this.page.locator('div#assign-all-question-input-combobox_listbox');

            await peopleList.waitFor({ state: 'visible' });

            const firstOption = peopleList.getByRole('option').first();
            if (await firstOption.isVisible()) {
                await firstOption.click();
            } else {
                throw new Error('First option not found in the combobox');
            }
        } else {
            throw new Error('Assigned person combobox not found');
        }

        const reasonList = this.page.locator('div').filter({ hasText: /^Please specify the reason for reassigning$/ }).getByLabel('open combobox')
        await reasonList.click();


        await this.page.getByText('Incorrect Assignment').click();
      
        await this.page.getByRole('button', { name: 'Reassign' }).click();
        await this.page.getByRole('button', { name: 'Save' }).dblclick();
        await this.page.getByRole('button', { name: 'OK' }).click();
    }
    async chooseAnswer(element, option) {
        const input_box = this.page.locator(element);
        await input_box.locator('xpath=following-sibling::*[1]').click();
        await this.page.getByRole('option', { name: option }).click();
    }

}
module.exports = ManageAssessment;
