const BasePage = require('../../../utils/BasePage');
const testData = require('../testData/companyData.json');

class CompanyListPage extends BasePage {
    constructor(page) {
        super(page);
        this.selectors = testData.elements;
        this.urls = testData.urls;
    }

    async waitForCompanyListLoad() {
        console.log('Waiting for company list to load...');
        try {
            const title = await this.page.locator(this.selectors.companyList.title);
            await title.waitFor({ state: 'visible', timeout: 30000 });


            const tableHeader = await this.page.locator(this.selectors.companyList.tableHeader);
            await tableHeader.waitFor({ state: 'visible', timeout: 30000 });

            const columns = await tableHeader.locator('tr th');
            const columnHeader = await columns.allTextContents();
            const columnCount = await columns.count();
            
            await this.page.waitForLoadState('networkidle');
            console.log('Company list loaded successfully');
            return {title, columnHeader, columnCount};
            
        } catch (error) {
            console.error('Failed to load company list:', error);
            await this.page.screenshot({ path: 'tests/features/company/list/screenshots/company-list-load-error.png', fullPage: true });
            throw error;
        }
    }
    async navigateToCreateCompany() {
        console.log('Navigating to create company page...');
        const createCompanyButton = this.page.locator(this.selectors.companyList.createButton);
        await createCompanyButton.waitFor({ state: 'visible', timeout: 30000 });
        await createCompanyButton.click();
        await this.page.waitForLoadState('networkidle');
        console.log('Navigated to create company page');
    }

}
module.exports = CompanyListPage;