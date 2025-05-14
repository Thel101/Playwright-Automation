const { test, expect } = require('@playwright/test');
const CompleteAssessment = require('./pageObjects/CompleteAssessment');
const ManageAssessment = require('./pageObjects/ManageAssessment');
test.use({ project: 'chrome-authenticated-assessment' });


test.describe('Assessment feature', () => {

    // test('complete assessment', async ({ page }) => {
    //     const complete_assessment = new CompleteAssessment(page);
    //     await complete_assessment.navigateToAssessment();
    //     await complete_assessment.chooseAssessment();
    //     await complete_assessment.completePeoplePillarAssessment();
    //     await complete_assessment.completeProcessPillarAssessment();
    //     await complete_assessment.completeCompliancePillarAssessment();
    //     await complete_assessment.completeSystemPillarAssessment();
    //     await complete_assessment.completeCulturePillarAssessment();
    //     await complete_assessment.saveAssessment();
    // });
    test('Manage assessment', async ({ page }) => {
        const manage_assessment = new ManageAssessment(page);
        await manage_assessment.navigateToManageAssessment()
    });

})
