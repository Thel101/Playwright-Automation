const { test, expect } = require('@playwright/test');
const CreateCompanyPage = require('./pageObjects/CreateCompanyPage');
const CompanyListPage = require('./pageObjects/CompanyListPage');
const EditCompanyPage = require('./pageObjects/EditCompanyPage');
const LoginPage = require('../auth/login/pageObjects/LoginPage');
const testData = require('./testData/companyData.json');

test.use({ project: 'chrome-authenticated-company' });

let contactInfo = testData.account
const companyName = generateCompanyName();
let editCompanyPage;

test.describe('Edit Company Feature', () => {


    test.beforeEach(async ({ page }) => {
        await page.goto(testData.urls.baseUrl);
        const loginPage = new LoginPage(page);
        await loginPage.enterCompany('Snow Limited');
        await page.goto(testData.urls.businessSettings);
        await page.goto(testData.urls.companyDetail);
        editCompanyPage = new EditCompanyPage(page);
    });

    test('should navigate to company edit page', async ({ page }) => {

        const tabs = await editCompanyPage.getTabsInCompanyDetails();
        expect(tabs).toHaveCount(4, 'Expected 4 tabs in company details');
        console.log(await tabs.allTextContents());

        const editButton = await editCompanyPage.getEditButton();
        await expect(editButton).toBeVisible({ timeout: 30000 });

        const loadWrapper = await editCompanyPage.getLoadWrapper();
        try {
            await loadWrapper.waitFor({ state: 'hidden', timeout: 10000 }); // Wait for it to disappear
            console.log('Loading indicator disappeared.');
        } catch (error) {
            console.warn('Loading indicator did not disappear within timeout, proceeding anyway. This might indicate an issue.');
            // Take a screenshot if it times out for debugging
            await page.screenshot({ path: 'tests/features/company/screenshots/loading_indicator_stuck.png', fullPage: true });
        }

        await editButton.click();
        console.log('Edit button clicked successfully.');

        await page.waitForURL(testData.urls.manageCompany, { timeout: 30000 });
        await expect(page).toHaveURL(testData.urls.manageCompany);
        console.log('Navigated to company details page successfully.');
    });
    test('check for disabled fields', async ({ page }) => {
        await editCompanyPage.waitForCompanyEditPageLoad()
        const [businessName, legalName, abn] = await editCompanyPage.checkDisabledFields()
        await expect(businessName).toBeDisabled();
        await expect(legalName).toBeDisabled();
        await expect(abn).toBeDisabled();
    })
    test('cannot update without required fields', async ({ page }) => {
        await editCompanyPage.waitForCompanyEditPageLoad();

        const emptyStreetField = await editCompanyPage.checkRequiredFields(testData.elements.companyFields.street);
        await expect(emptyStreetField).toHaveClass(/.*invalid.*/);

        const emptyContactNameField = await editCompanyPage.checkRequiredFields(testData.elements.companyFields.contactName);
        await expect(emptyContactNameField).toHaveClass(/.*invalid.*/);

        const emptyContactEmailField = await editCompanyPage.checkRequiredFields(testData.elements.companyFields.contactEmail);
        await expect(emptyContactEmailField).toHaveClass(/.*invalid.*/);

        const emptyContactPositionField = await editCompanyPage.checkRequiredFields(testData.elements.companyFields.contactPosition);
        await expect(emptyContactPositionField).toHaveClass(/.*invalid.*/);

        const emptyContactPhoneField = await editCompanyPage.checkRequiredFields(testData.elements.companyFields.contactPhone);
        await expect(emptyContactPhoneField).toHaveClass(/.*invalid.*/);

    })
    test('update business address', async ({ page }) => {
        await editCompanyPage.waitForCompanyEditPageLoad();
        await editCompanyPage.fillBusinessAddress("Sukhumvit Road", "Porky Flat", "South Australia", "522", "Suite 2");
        await page.getByRole('button', { name: 'Update' }).click();
        await page.locator("xpath=//div[@id='main-page-layout']/div[contains(@class,'popup')]").waitFor({ state: 'visible', timeout: 10000 });
        console.log('Business address updated successfully.');
    })
    test('update contact details', async ({ page }) => {
        await editCompanyPage.waitForCompanyEditPageLoad();
        await editCompanyPage.fillContactDetails("Mao", "maomao@gmail.com", "Apothecary", "0987654321");
        await page.getByRole('button', { name: 'Update' }).click();
        await page.locator("xpath=//div[@id='main-page-layout']/div[contains(@class,'popup')]").waitFor({ state: 'visible', timeout: 10000 });
        console.log('Contact details updated successfully.');

    })
    test('update payroll industry information', async ({ page }) => {
        await editCompanyPage.waitForCompanyEditPageLoad();
        await editCompanyPage.fillPayrollIndustryInformation(
            "Arts & Recreation Services",
            "Airline Operations - Ground Staff Award [MA000048]",
            "34343",
            "Western Australia",
            "Fortnightly",
            "QuickBooks")
        await page.getByRole('button', { name: 'Update' }).click();
       
        await page.locator("xpath=//div[@id='main-page-layout']/div[contains(@class,'popup')]").waitFor({ state: 'visible', timeout: 10000 });
        console.log('Payroll Industry details updated successfully.');
    })
    
   
});

function generateCompanyName() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear();

    return `${month} ${day}, ${year} Company`;
}
