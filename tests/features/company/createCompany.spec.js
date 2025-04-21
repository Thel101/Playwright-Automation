const {test, expect} = require('@playwright/test');
const CreateCompanyPage = require('./pageObjects/CreateCompanyPage');
const testData = require('./testData/companyData.json');

test.use({project: 'chrome-authenticated'});

test.describe('Company List Navigation', () => {
    let createCompanyPage;
    test.beforeEach(async ({page}) => {
        createCompanyPage = new CreateCompanyPage(page);
        await page.goto(testData.urls.companyList);
        console.log('Navigated to company list page.');
        await createCompanyPage.clickCreateCompanyButton();
     
    });

    test('should create company with all required data', async ({page}) => {
        await createCompanyPage.fillCompanyDetails()
        console.log('Company details filled successfully.');

        await page.waitForTimeout(60000); // Wait for 3 seconds before filling the next section
        await createCompanyPage.fillBusinessAddress();
        console.log('Business address filled successfully.');

        await createCompanyPage.fillContactDetails();
        console.log('Contact details filled successfully.');

        await createCompanyPage.fillPayrollIndustryInformation();
        console.log('Payroll industry information filled successfully.');

        await createCompanyPage.fillBillingInformation();
        console.log('Billing information filled successfully.');

        await createCompanyPage.fillSubscriptionInformation();
        console.log('Subscription information filled successfully.');

        await page.screenshot({ path: 'tests/features/company/screenshots/create-company.png', fullPage: true });
    });
})
    
