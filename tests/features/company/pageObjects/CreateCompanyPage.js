const BasePage = require('../../../utils/BasePage');
const testData = require('../testData/companyData.json');

class CreateCompanyPage extends BasePage {
    constructor(page) {
        super(page);
        this.selectors = testData.elements;
        this.createElements = testData.elements.createCompany;
        this.urls = testData.urls;
    }

    async waitForCompanyCreatePageLoad() {
        console.log('Waiting for company list to load...');
        try {
            const title = await this.page.locator(this.createElements.title);
            await title.waitFor({ state: 'visible', timeout: 30000 });

            const sections = await this.page.locator(this.createElements.section);
            const sectionCount = await sections.count();
            const sectionHeader = await sections.allTextContents();


            return { title, sectionCount, sectionHeader };

        } catch (error) {
            console.error('Failed to load company list:', error);
            await this.page.screenshot({ path: 'tests/features/company/list/screenshots/company-list-load-error.png', fullPage: true });
            throw error;
        }
    }
    async enterDropdownValue(selector, value) {
        const dropdown = this.page.locator(selector);
        await dropdown.fill(value); // Fill the input to trigger the dropdown
        await this.page.waitForLoadState('networkidle', { timeout: 60000 });// Wait for the list to load
        await dropdown.press('ArrowDown'); // Highlight the first option
        await dropdown.press('Enter'); // Select the highlighted option
    }

    async clickCreateCompanyButton() {
        console.log('Clicking create company button...');
        const createCompanyButton = this.page.locator(this.selectors.companyList.createButton);
        await createCompanyButton.waitFor({ state: 'visible', timeout: 30000 });
        await createCompanyButton.click();
        await this.page.waitForLoadState('networkidle');
        console.log('Clicked create company button');
    }

    async fillCompanyDetails(companyName) {
        console.log('Filling company details...');
        await this.page.getByRole('textbox', { name: 'e.g. AMP Corporation', exact: true }).fill(companyName);
        await this.page.getByRole('checkbox', { name: 'Same as business name' }).check();

        const inputs = this.page.locator('xpath=//*[@id[starts-with(., "input-")]]');
        const inputCount = await inputs.count();

        for (let i = 0; i < inputCount; i++) {
            const input = inputs.nth(i);
            await input.fill('1');
        }

    }

    async fillBusinessAddress(streetName, suburbName, stateName, postalCode, additionalAddress) {
        console.log('Filling business address...');

        await this.page.getByRole('textbox', { name: 'Street Address' }).fill(streetName);

        await this.page.locator('div').filter({ hasText: /^Suburb$/ }).getByLabel('open combobox').click();
        await this.page.waitForSelector(this.createElements.suburbDropdown);
        const option = await this.page.locator(`div[role="option"] >> text="${suburbName}"`);
        await option.click();

        await this.enterDropdownValue(this.createElements.stateComboList, `${stateName}`);

        await this.enterDropdownValue(this.createElements.postcodeComboList, `${postalCode}`);

        await this.page.getByRole('textbox', { name: 'e.g. Suite 101, Building A,' }).fill(`${additionalAddress}`);


    }
    async fillContactDetails(name, email, position, phone) {
        await this.page.locator(this.createElements.contactName).fill(`${name}`);

        await this.page.locator(this.createElements.contactEmail).fill(`${email}`);

        await this.page.locator(this.createElements.contactPosition).fill(`${position}`);

        await this.page.locator(this.createElements.contactPhone).fill(`${phone}`);
    }
    async fillPayrollIndustryInformation() {

        await this.page.locator(this.createElements.industryDropDown).click();
        await this.page.getByRole('option', { name: 'Administrative & Support' }).click();
        await this.page.getByText('Administrative & Support ServicesAgriculture, Forestry & Fishing').click();

        await this.page.getByText('Award(s)').click();
        await this.page.locator(this.createElements.awardDropdown).click();
        await this.page.getByRole('option', { name: 'Aboriginal and Torres Strait' }).click();

        await this.page.getByText('EA/EBA(s)').click();
        await this.page.getByRole('textbox', { name: 'eg.' }).fill('12232');

        await this.page.locator(this.createElements.employmentStateDropdown).click();
        await this.page.getByRole('option', { name: 'Australian Capital Territory' }).click();

        await this.page.getByText('Number of Employee(s)').click();
        await this.page.locator('div').filter({ hasText: /^Number of Employee\(s\)$/ }).getByLabel('open combobox').click();
        await this.page.getByRole('option', { name: '-50 employees' }).click();

        await this.page.getByRole('checkbox', { name: 'Full Time' }).check();

        await this.page.locator(this.createElements.payrollFrequency).click();
        await this.page.getByRole('option', { name: 'Monthly', exact: true }).click();

        await this.page.getByText('Payroll Software Details').click();
        await this.page.getByRole('combobox', { name: 'Select one or more options' }).click();
        await this.page.getByRole('option', { name: 'Xero' }).click();

    }
    async fillBillingInformation() {
        await this.page.getByText('Billing Contact Name').click();
        await this.page.getByRole('checkbox', { name: 'Same as contact details' }).check();
    }
    async fillSubscriptionInformation() {
        try {
            await this.enterDropdownValue(this.createElements.subscriptionPackage, 'Essential'); // Fill the input to trigger the dropdown4

            await this.enterDropdownValue(this.createElements.subscriptionDuration, 'Monthly'); // Fill the input to trigger the dropdown

            await this.page.getByRole('textbox', { name: 'Start Date' }).click();
            await selectCurrentDateOption(this.page);
            await this.page.locator('input[type="checkbox"][name="CreateCustomerUserWithContactInfo"]').check();

            await this.page.getByRole('button', { name: 'Create' }).click();
            await this.page.getByRole('button', { name: 'OK' }).click();
        }
        catch (error) {
            console.error('Failed to fill subscription information:', error);
            await this.page.screenshot({ path: 'tests/features/company/list/screenshots/create-company-error.png', fullPage: true });
            throw error;
        }

    }
}
function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th'; // Handles 11th, 12th, 13th
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

async function selectCurrentDateOption(page) {
    const today = new Date();

    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });

    // Get full month name (e.g., 'April')
    const month = today.toLocaleString('en-US', { month: 'long' });

    // Get day of the month (e.g., 16)
    const dayOfMonth = today.getDate();

    // Get the ordinal suffix (e.g., 'th' for 16th)
    const ordinalSuffix = getOrdinalSuffix(dayOfMonth);

    // Construct the full string for the name attribute
    const dateString = `Choose ${dayOfWeek}, ${month} ${dayOfMonth}${ordinalSuffix},`;

    console.log(`Looking for option with name: "${dateString}"`);

    const dateOptionLocator = page.getByRole('option', { name: dateString });
    await dateOptionLocator.click();

}
module.exports = CreateCompanyPage;
