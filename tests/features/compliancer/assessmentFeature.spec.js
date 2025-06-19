const { test, expect } = require('@playwright/test');
const CompleteAssessment = require('./pageObjects/CompleteAssessment');
const ManageAssessment = require('./pageObjects/ManageAssessment');
const ReviewAssessment = require('./pageObjects/ReviewAssessment');
test.use({ project: 'chrome-authenticated-assessment' });


test.describe('Assessment feature', () => {

    test('complete assessment', async ({ page }) => {
        const complete_assessment = new CompleteAssessment(page);
        await complete_assessment.navigateToAssessment();
        await complete_assessment.chooseAssessment();
        let q1, q2, q3, total = await complete_assessment.completePeoplePillarAssessment();
        await complete_assessment.completeProcessPillarAssessment();
        await complete_assessment.completeCompliancePillarAssessment();
        await complete_assessment.completeSystemPillarAssessment();
        await complete_assessment.completeCulturePillarAssessment();
        await complete_assessment.saveAssessment();
    });
    test('Review assessment', async ({ page }) => {
        const review_assessment = new ReviewAssessment(page);
        await review_assessment.navigateToAssessment();
        await review_assessment.chooseAssessment();
        await review_assessment.checkForComponents();

        await page.locator('div.view-link').filter({ hasText: /^People$/ }).click();
        await page.waitForTimeout(5000);

        await review_assessment.checkPillarDetail();
        console.log('People Pillar detail checked successfully.');

        await page.getByRole('button', { name: 'open combobox' }).click();
        await page.getByRole('option', { name: 'Process' }).click();

        await review_assessment.checkPillarDetail();
        console.log('Process Pillar detail checked successfully.');

        await page.getByRole('button', { name: 'open combobox' }).click();
        await page.getByRole('option', { name: 'Compliance' }).click();

        await review_assessment.checkPillarDetail();
        console.log('Compliance Pillar detail checked successfully.');

        await page.getByRole('button', { name: 'open combobox' }).click();
        await page.getByRole('option', { name: 'Systems' }).click();

        await review_assessment.checkPillarDetail();
        console.log('Systems Pillar detail checked successfully.');

        await page.getByRole('button', { name: 'open combobox' }).click();
        await page.getByRole('option', { name: 'Culture' }).click();

        await review_assessment.checkPillarDetail();
        console.log('Culture Pillar detail checked successfully.');
    })
    test('Manage assessment', async ({ page }) => {
        const manage_assessment = new ManageAssessment(page);
        await manage_assessment.navigateToManageAssessment()
    });
  

})
