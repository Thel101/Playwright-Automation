const { test, expect } = require('@playwright/test');
const PeopleAssessment = require('./pageObjects/CompleteAssessment');


test.use({ project: 'chrome-authenticated' });

let complete_assessment;

test.describe('Complete assessment', () => {

    test('complete assessment for people pillar', async ({ page }) => {
        complete_assessment = new PeopleAssessment(page);
        await complete_assessment.navigateToAssessment();
        await complete_assessment.completePeoplePillarAssessment();
        await complete_assessment.completeProcessPillarAssessment();
        await complete_assessment.completeCompliancePillarAssessment();
        await complete_assessment.completeSystemPillarAssessment();
        await complete_assessment.completeCulturePillarAssessment();
        await complete_assessment.saveAssessment();
    });

})
