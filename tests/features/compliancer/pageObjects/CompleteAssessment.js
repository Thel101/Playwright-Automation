const BasePage = require('../../../utils/BasePage');
const testData = require('../testData/assessmentData.json');

const response = testData.assessment;
const people_question_1 = response.people_question_1;
const people_question_2 = response.people_question_2;
const people_question_3 = response.people_question_3;

const process_question_1 = response.process_question_1;
const process_question_2 = response.process_question_2;
const process_question_3 = response.process_question_3;

class CompleteAssessment extends BasePage {
    constructor(page) {
        super(page);
    }
    async navigateToAssessment() {
        await this.page.goto(testData.urls.baseUrl);
        await this.page.locator('div').filter({ hasText: /^payrollcompliancer$/ }).first().click();
        await this.page.getByRole('button', { name: 'Assessment' }).click();
    }
    async chooseAssessment() {
        await this.page.locator('div').filter({ hasText: /^Assessment$/ }).getByLabel('open combobox').click();
        await this.page.getByRole('option', { name: 'Snow Assessment 7' }).click();
    }
    async chooseAnswer(element, option) {
        const input_box = this.page.locator(element);
        await input_box.locator('xpath=following-sibling::*[1]').click();
        await this.page.getByRole('option', { name: option }).click();
    }
    async completePeoplePillarAssessment() {

        await this.page.locator('div').filter({ hasText: /^1\. People$/ }).nth(1).click();

        await this.chooseAnswer('input#questions-comboboxlist-424-1_input', people_question_1[0].response);

        await this.chooseAnswer('input#questions-comboboxlist-425-2_input', people_question_2[0].response);

        await this.chooseAnswer('input#questions-comboboxlist-426-3_input', people_question_3[0].response);

    }

    async completeProcessPillarAssessment() {

        await this.page.locator('div').filter({ hasText: /^2\. Process$/ }).nth(1).click();

        await this.chooseAnswer('input#questions-comboboxlist-421-4_input', process_question_1[0].response);

        await this.page.locator('#question-multiselect-422_taglist').click();
        // await this.page.getByRole('option', { name: process_question_2[0].response }).click();
        for (let i = 0; i < 5; i++) {
            await this.page.getByRole('option', { name: `${process_question_2[i].response}` }).click();
        }

        await this.page.locator('#question-multiselect-423_taglist').click();
        for (let i = 0; i < 4; i++) {
            await this.page.getByRole('option', { name: `${process_question_3[i].response}` }).click();
        }

    }

    async completeCompliancePillarAssessment() {
        await this.page.getByText('3. Compliance').click();

        await this.chooseAnswer('input#questions-comboboxlist-427-7_input', response.compliance_question_1[0].response);
        
        await this.chooseAnswer('input#questions-comboboxlist-428-8_input', response.compliance_question_2[0].response);
        

        await this.chooseAnswer('input#questions-comboboxlist-429-9_input', response.compliance_question_3[0].response);

    }
    async completeSystemPillarAssessment() {
        await this.page.locator('div').filter({ hasText: /^4\. Systems$/ }).nth(1).click();

        await this.chooseAnswer('input#questions-comboboxlist-433-10_input', response.system_question_1[0].response);
        await this.chooseAnswer('input#questions-comboboxlist-434-11_input', response.system_question_2[0].response);
        await this.chooseAnswer('input#questions-comboboxlist-435-12_input', response.system_question_3[0].response);
        
    }
    async completeCulturePillarAssessment() {
        await this.page.locator('div').filter({ hasText: /^5\. Culture$/ }).nth(1).click();

        await this.page.locator('#question-multiselect-430_taglist').click();
        for (let i = 0; i < 5; i++) {
            await this.page.getByRole('option', { name: `${response.culture_question_1[i].response}` }).click();
        }
        await this.chooseAnswer('input#questions-comboboxlist-431-14_input', response.culture_question_2[0].response);
        await this.chooseAnswer('input#questions-comboboxlist-432-15_input', response.culture_question_3[0].response);
    }
    async saveAssessment() {

        await this.page.getByRole('button', { name: 'Save' }).click();
        await this.page.getByRole('button', { name: 'OK' }).click();
    }


}
module.exports = CompleteAssessment;
