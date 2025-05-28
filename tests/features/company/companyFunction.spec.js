const { test, expect } = require('@playwright/test');
const CreateCompanyPage = require('./pageObjects/CreateCompanyPage');
const CompanyListPage = require('./pageObjects/CompanyListPage');
const LoginPage = require('../auth/login/pageObjects/LoginPage');
const testData = require('./testData/companyData.json');

test.use({ project: 'chrome-authenticated-company' });

let contactInfo = testData.account
const companyName = generateCompanyName();

test.describe('Company Feature', () => {
    let createCompanyPage;
    let companyListPage;
    
    test.beforeEach(async ({ page }) => {
        await page.goto(testData.urls.baseUrl);
        const loginPage = new LoginPage(page);
        await loginPage.enterCompany('Snow Limited');
    });
    test('should navigate to company list when authenticated', async ({ page }) => {
        await page.locator('div').filter({ hasText: /^company$/ }).first().click();
        companyListPage = new CompanyListPage(page);
        await companyListPage.waitForCompanyListLoad();
        console.log('Company list loaded successfully.');
     
        
    });
    test('should navigate to create company page', async ({ page }) => {
        await page.goto(testData.urls.companyList);
        companyListPage = new CompanyListPage(page);
        await companyListPage.navigateToCreateCompany();
        console.log('Navigated to create company page successfully.');
        await page.screenshot({ path: 'tests/features/company/screenshots/create-company-page.png', fullPage: true });
    })
    test('can create a new company', async ({ page }) => {
        await page.goto(testData.urls.companyList);
        await page.locator(testData.elements.companyList.createButton).click();
    
        createCompanyPage = new CreateCompanyPage(page);
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

    return `${month} ${day}, ${year} Company`;
}
