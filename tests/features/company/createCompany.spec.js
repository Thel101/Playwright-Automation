const { test, expect } = require('@playwright/test');
const CreateCompanyPage = require('./pageObjects/CreateCompanyPage');
const LoginPage = require('../auth/login/pageObjects/LoginPage');
const CreateUserPage = require('../user/pageObjects/createUserPage');
const testData = require('./testData/companyData.json');

test.use({ project: 'chrome-authenticated' });

let loginPage;
let createUserPage;
let contactInfo = testData.account
const companyName = generateCompanyName();

test.describe('Company List Navigation', () => {
    let createCompanyPage;


    test('should create company with all required data', async ({ page }) => {
        createCompanyPage = new CreateCompanyPage(page);
        await page.goto(testData.urls.companyList);
        console.log('Navigated to company list page.');
        await createCompanyPage.clickCreateCompanyButton();

        await createCompanyPage.fillCompanyDetails(companyName);
        console.log('Company details filled successfully.');

        await page.waitForTimeout(60000); // Wait for 3 seconds before filling the next section
        await createCompanyPage.fillBusinessAddress('Testing Street', 'Aarons Pass', 'New South Wales', '2850', 'Test building');
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
    });

    test('check created company', async ({ page }) => {

        await page.goto(testData.urls.baseUrl)
        await page.waitForTimeout(3000); // Wait for 3 seconds before clicking the next button
        await page.getByText('Logout').click();
        await page.getByRole('button', { name: 'Log Out' }).click();
        console.log('Logged out successfully.');
        await page.waitForTimeout(3000);

        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });


        loginPage = new LoginPage(page);
        await loginPage.login(contactInfo.email, "Def@u1tPW")

        await page.waitForTimeout(3000);
        await page.goto('https://compliancerdev.auditmypayroll.com.au/home');

        // Validate company in top 
        const companyDropdown = page.getByRole('combobox', { name: 'Without label' })
        await companyDropdown.click();
        const createdCompany = await page.getByRole('option', { name: `${companyName}` });
        await expect(createdCompany).toBeVisible();
        await createdCompany.click();
        await page.waitForTimeout(3000);

        //validate assessment
        await page.getByRole('link', { name: 'image payroll compliancer' }).click();

        await page.getByRole('button', { name: 'Assessment' }).click();
        const assessment = await page.getByRole('heading', { name: `${companyName} - Mini` });
        await expect(assessment).toBeVisible();

        //validate user creation
        createUserPage = new CreateUserPage(page);
        await createUserPage.navigateToUserList();
        await createUserPage.createNewUser('22April2025 Company 3', 'Basic User', 'HR', 'QA', 'myintaung43@gmail.com');
        console.log('New user created successfully.');
    });

});

function generateCompanyName() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear();

    return "Testing Company 24";

}
