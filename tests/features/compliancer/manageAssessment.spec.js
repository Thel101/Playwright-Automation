const { test, expect } = require('@playwright/test');
const ManageAssessment = require('../compliancer/pageObjects/ManageAssessment');


test.use({ project: 'chrome-authenticated' });

let manage_assessment;

test.describe('Complete assessment for', () => {

    test('Manage assessment', async ({ page }) => {
        manage_assessment = new ManageAssessment(page);
        await manage_assessment.navigateToManageAssessment()
    });

})
