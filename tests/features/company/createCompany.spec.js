const { test, expect } = require('@playwright/test');
const CreateCompanyPage = require('./pageObjects/CreateCompanyPage');
const LoginPage = require('../auth/login/pageObjects/LoginPage');
const testData = require('./testData/companyData.json');

let contactInfo = testData.account
const companyName = generateCompanyName();
let createCompanyPage;

test.describe('Create Company Feature', () => {


    test.beforeEach(async ({ page }) => {
        await page.goto(testData.urls.baseUrl);
        const loginPage = new LoginPage(page);
        createCompanyPage = new CreateCompanyPage(page);
    });

    test('check create company section', async ({ page }) => {
        await createCompanyPage.checkCreateCompanySection();
        const [title, description, createButton] = await createCompanyPage.checkCreateCompanySection();
        expect(title).toHaveText(testData.contents.createCompanyTitle);

        expect(description).toHaveText(testData.contents.description);

        expect(createButton).toBeVisible();
    })
    test('can create a new company', async ({ page }) => {
        
        await page.getByText('Create Company', { exact: true }).click();
        console.log('Navigated to create company page.');

        await createCompanyPage.fillCompanyDetails(companyName);
        console.log('Company details filled successfully.');

        await createCompanyPage.fillBusinessAddress('123 Main St', 'Aarons Pass', 'New South Wales', '2850', 'Suite 1');
        console.log('Business address filled successfully.');

        await createCompanyPage.fillContactDetails(contactInfo.name, contactInfo.email, contactInfo.role, contactInfo.phone);
        console.log('Contact details filled successfully.');

        await createCompanyPage.fillPayrollIndustryInformation();
        console.log('Payroll industry information filled successfully.');

        await createCompanyPage.fillBillingInformation();
        console.log('Billing information filled successfully.');

        await createCompanyPage.fillSubscriptionInformation();
        console.log('Subscription information filled successfully.');

        await page.screenshot({ path: 'tests/features/company/screenshots/create-company.png', fullPage: true });
    })
  
   

});

function generateCompanyName() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear();
    const randomNumber = Math.floor(Math.random() * 10); // Random number to ensure uniqueness
    return `${month} ${day}, ${year} ${randomNumber} Company`;
}
