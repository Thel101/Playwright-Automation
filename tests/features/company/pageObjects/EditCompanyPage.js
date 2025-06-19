const BasePage = require('../../../utils/BasePage');
const testData = require('../testData/companyData.json');

class EditCompany extends BasePage {
    constructor(page) {
        super(page);
        this.selectors = testData.elements;
        this.companyElements = testData.elements.companyFields;
        this.urls = testData.urls;
    }
    async getTabsInCompanyDetails() {
        console.log('Getting tabs in company details...');
        const tabs = this.page.locator("xpath=//button[contains(@class, 'tab-list-item')]")
        return tabs;
    }
    async getEditButton() {
        console.log('Clicking edit company button...');
        const actionButtons = this.page.locator("xpath=//div[contains(@class, 'view-action-btn')]");
        const editBtn = actionButtons.locator('xpath=//a[contains(@class, "edit-btn")]')
        return editBtn;
    }
    async getLoadWrapper() {
        return this.page.locator('div#load-wrappter');
    }

    async waitForCompanyEditPageLoad() {
        console.log('Waiting for company edit to load...');
        await this.page.goto(this.urls.manageCompany)
        try {
            const title = await this.page.locator(this.companyElements.editTitle);
            await title.waitFor({ state: 'visible', timeout: 30000 });

            const sections = await this.page.locator(this.companyElements.section);
            const sectionCount = await sections.count();
            const sectionHeader = await sections.allTextContents();

            return { title, sectionCount, sectionHeader };

        } catch (error) {
            console.error('Failed to load company list:', error);
            await this.page.screenshot({ path: 'tests/features/company/list/screenshots/company-list-load-error.png', fullPage: true });
            throw error;
        }
    }
    async checkDisabledFields() {
        console.log('Checking disabled fields...');
        const businessName = this.page.locator(this.companyElements.businessName);
        const legalName = this.page.locator(this.companyElements.legalName);
        const abn = this.page.locator("xpath=//div[contains(@class,'abn-wpn-inputs')]//input").first();
        return [businessName, legalName, abn];
    }
    async checkRequiredFields(locator) {
        const emptyField = this.page.locator(locator);
        await emptyField.clear();
        await emptyField.blur();

        return emptyField;
        
    }
    async enterDropdownValue(selector, value) {
        const dropdown = this.page.locator(selector);
        await dropdown.fill(value); // Fill the input to trigger the dropdown
        await this.page.waitForLoadState('networkidle', { timeout: 60000 });// Wait for the list to load
        await dropdown.press('ArrowDown'); // Highlight the first option
        await dropdown.press('Enter'); // Select the highlighted option
    }

  

    async fillCompanyDetails(companyName) {
        console.log('Filling company details...');
        const updatedName = `${companyName} - 2`;
        await this.page.getByRole('textbox', { name: 'e.g. AMP Corporation', exact: true }).fill(updatedName);
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
        await this.page.waitForSelector(this.companyElements.suburbDropdown);
        const option = await this.page.locator(`div[role="option"] >> text="${suburbName}"`);
        await option.click();

        await this.enterDropdownValue(this.companyElements.stateComboList, `${stateName}`);

        await this.enterDropdownValue(this.companyElements.postcodeComboList, `${postalCode}`);

        await this.page.getByRole('textbox', { name: 'e.g. Suite 101, Building A,' }).fill(`${additionalAddress}`);


    }
    async fillContactDetails(name, email, position, phone) {
        await this.page.locator(this.companyElements.contactName).fill(`${name}`);

        await this.page.locator(this.companyElements.contactEmail).fill(`${email}`);

        await this.page.locator(this.companyElements.contactPosition).fill(`${position}`);

        await this.page.locator(this.companyElements.contactPhone).fill(`${phone}`);
    }
    async fillPayrollIndustryInformation(industry, awards, EBA , stateEmployment, frequency, payrollSoftware) {

        console.log('Filling payroll industry information...');
        await this.page.locator(this.companyElements.industryDropDown).click();
        await this.page.getByText(industry).click();
        await this.page.getByText('Award(s)').click();

        await this.page.locator(this.companyElements.awardDropdown).click();
        await this.page.getByRole('option', { name: awards}).click();
        await this.page.getByText('EA/EBA(s)').click();

        console.log(`Filling EBA with: ${EBA}`);
        await this.page.locator('input#EBA').fill(`${EBA}`);

        console.log(`Filling state employment with: ${stateEmployment}`);
        await this.page.locator(this.companyElements.employmentStateDropdown).click();
        await this.page.getByRole('option', { name: stateEmployment }).click();

        console.log(`Filling number of employees with: -10 employees`);
        await this.page.getByText('Number of Employee(s)').click();
        await this.page.locator('div').filter({ hasText: /^Number of Employee\(s\)$/ }).getByLabel('open combobox').click();
        await this.page.getByRole('option', { name: '-10 employees' }).click();

        console.log(`Filling employment types with: Full Time and Part Time`);
        await this.page.getByRole('checkbox', { name: 'Full Time' }).check();
        await this.page.getByRole('checkbox', { name: 'Part Time' }).check();

        console.log(`Filling payroll frequency with: ${frequency}`);
        await this.page.locator(this.companyElements.payrollFrequency).click();
        await this.page.getByRole('option', { name: frequency, exact: true }).click();
        await this.page.getByText('Payroll Software Details').click();

        console.log(`Filling payroll software with: ${payrollSoftware}`);
        await this.page.locator(this.companyElements.payrollSoftwareDropdown).click();
        await this.page.getByRole('option', { name: payrollSoftware }).click();

    }
    async fillBillingInformation() {
        await this.page.getByText('Billing Contact Name').click();
        await this.page.getByRole('checkbox', { name: 'Same as contact details' }).check();
    }
    async fillSubscriptionInformation() {
        try {
            await this.enterDropdownValue(this.companyElements.subscriptionPackage, 'Essential'); // Fill the input to trigger the dropdown4

            await this.enterDropdownValue(this.companyElements.subscriptionDuration, 'Monthly'); // Fill the input to trigger the dropdown

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
module.exports = EditCompany;
