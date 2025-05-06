const BasePage = require('../../../utils/BasePage');

class CompleteAssessment extends BasePage {
    constructor(page) {
        super(page);
    }
    async navigateToAssessment() {
        await this.page.goto('https://app-dev.auditmypayroll.com.au/home');

        await this.page.getByRole('link', { name: 'image payroll compliancer' }).click();
        await this.page.getByRole('button', { name: 'Assessment' }).click();
    }
    async completePeoplePillarAssessment() {
       
        await this.page.locator('div').filter({ hasText: /^1\. People$/ }).nth(1).click();
    
        await this.page.getByRole('button', { name: 'open combobox' }).nth(1).click();
        await this.page.getByRole('option', { name: 'We encourage our payroll team' }).click();

        await this.page.getByRole('button', { name: 'open combobox' }).nth(2).click();
        await this.page.getByRole('option', { name: 'Somewhat Confident' }).click();

        await this.page.getByRole('button', { name: 'open combobox' }).nth(3).click();
        await this.page.getByRole('option', { name: 'Yes, we use a tailored skill' }).click();
        
    }

    async completeProcessPillarAssessment() {
     
        await this.page.locator('div').filter({ hasText: /^2\. Process$/ }).nth(1).click();
    
        await this.page.getByRole('button', { name: 'open combobox' }).nth(4).click();
        await this.page.getByRole('option', { name: 'Very Satisfied' }).click();

        await this.page.locator('#question-multiselect-92_taglist').click();
        await this.page.getByRole('option', { name: 'We use a formal change' }).click();
        await this.page.getByText('Process controls including').click();

        await this.page.getByRole('combobox', { name: 'Select one or more options' }).click();
        await this.page.getByRole('option', { name: 'Applicable Modern Award:' }).click();
        await this.page.getByText('Every business owner').click();

    }
    
    async completeCompliancePillarAssessment() {
        await this.page.locator('div').filter({ hasText: /^3\. Compliance$/ }).nth(1).click();

        await this.page.getByRole('button', { name: 'open combobox' }).nth(5).click();
        await this.page.getByRole('option', { name: 'Yes - We have employees on an annualised salary arrangement and these are reviewed' }).click();

        await this.page.getByRole('button', { name: 'open combobox' }).nth(6).click();
        await this.page.getByRole('option', { name: 'Extremely effective' }).click();

        await this.page.getByRole('button', { name: 'open combobox' }).nth(7).click();
        await this.page.getByRole('option', { name: 'Yes: We have conducted internal AND external audits' }).click();

    }
    async completeSystemPillarAssessment() {
        await this.page.locator('div').filter({ hasText: /^4\. Systems$/ }).nth(1).click();

        await this.page.getByRole('button', { name: 'open combobox' }).nth(8).click();
        await this.page.getByRole('option', { name: 'Extremely effective' }).click();

        await this.page.getByRole('button', { name: 'open combobox' }).nth(9).click();
        await this.page.getByRole('option', { name: 'Yes: We use a HRIS and it is integrated with our payroll and finance systems' }).click();

        await this.page.getByRole('button', { name: 'open combobox' }).nth(10).click();
        await this.page.getByRole('option', { name: 'Very Confident' }).click();

    }
    async completeCulturePillarAssessment() {
        await this.page.locator('div').filter({ hasText: /^5\. Culture$/ }).nth(1).click();

        await this.page.locator('#question-multiselect-100_taglist').click();
        await this.page.getByRole('option', { name: 'Established more efficient' }).click();
        await this.page.getByText('Taking time to evaluate your').click();

        await this.page.getByRole('button', { name: 'open combobox' }).nth(11).click();
        await this.page.getByRole('option', { name: 'Yes, I see opportunities for cost reduction and compliance' }).click();

        await this.page.getByRole('button', { name: 'open combobox' }).nth(12).click();
        await this.page.getByRole('option', { name: 'Very Confident' }).click();
    }
    async saveAssessment() {
          
        await this.page.getByRole('button', { name: 'Save' }).click();
        await this.page.getByRole('button', { name: 'OK' }).click();
    }


}
module.exports = CompleteAssessment;
