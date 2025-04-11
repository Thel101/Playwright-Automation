const {test, expect} = require('@playwright/test');
const CompanyListPage = require('./pageObjects/CompanyListPage');
const testData = require('./testData/companyData.json');

test.use({project: 'chrome-authenticated'});

test.describe('Company List Navigation', () => {
    let companyListPage;

    test.beforeEach(async ({page}) => {
        companyListPage = new CompanyListPage(page);
        await page.goto(testData.urls.companyList);
        await page.waitForLoadState('networkidle');
    });

    test('should load company list when authenticated @TC3164', async ({page}) => {

        try {
            // Verify we're on the company list page
            console.log('Checking if redirected to company list page...');
          
            // Wait for company list elements using page object
            const {title, columnHeader, columnCount} =await companyListPage.waitForCompanyListLoad();
            await expect(title).toContainText('Company Management', {timeout: 30000});
            await expect(columnCount).toBe(5); // Assuming 5 columns in the company list
            console.log('Column headers:', columnHeader);


            // Take a screenshot for verification
            await page.screenshot({path: 'tests/features/company/list/screenshots/company-list-authenticated.png', fullPage: true});
            console.log('Test completed successfully');
        } catch (error) {
            console.error('Test failed:', error);
            await page.screenshot({path: 'tests/features/company/list/screenshots/company-list-auth-error.png', fullPage: true});
            throw error;
        }
    });
    test('should navigate to create company page @TC3165', async ({page}) => {  
        try{
            await companyListPage.navigateToCreateCompany();
        }
        catch (error) {
            console.error('Test failed:', error);
            await page.screenshot({path: 'tests/features/company/list/screenshots/company-list-auth-error.png', fullPage: true});
            throw error;
        }
    })
})
