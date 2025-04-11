const BasePage = require('../../../utils/BasePage');
const testData = require('../testData/companyData.json');

class CreateCompanyPage extends BasePage {
    constructor(page) {
        super(page);
        this.selectors = testData.elements;
        this.urls = testData.urls;
    }

    async waitForCompanyCreatePageLoad() {
        console.log('Waiting for company list to load...');
        try {
            const title = await this.page.locator(this.selectors.createCompany.title);
            await title.waitFor({ state: 'visible', timeout: 30000 });

            const sections = await this.page.locator(this.selectors.createCompany.section);
            const sectionCount = await sections.count();
            const sectionHeader = await sections.allTextContents();

            
            return {title, sectionCount, sectionHeader};
            
        } catch (error) {
            console.error('Failed to load company list:', error);
            await this.page.screenshot({ path: 'tests/features/company/list/screenshots/company-list-load-error.png', fullPage: true });
            throw error;
        }
    }
    
async clickCreateCompanyButton() {
    console.log('Clicking create company button...');
    const createCompanyButton = this.page.locator(this.selectors.createCompany.createButton);
    await createCompanyButton.waitFor({ state: 'visible', timeout: 30000 });
    await createCompanyButton.click();
    await this.page.waitForLoadState('networkidle');
    console.log('Clicked create company button');
}
}
module.exports = CreateCompanyPage;