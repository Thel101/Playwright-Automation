const {test, expect} = require('@playwright/test');
const CreateCompanyPage = require('./pageObjects/CreateCompanyPage');
const testData = require('./testData/companyData.json');

test.use({project: 'chrome-authenticated'});

test.describe('Company List Navigation', () => {
    let createCompanyPage;
    test.beforeEach(async ({page}) => {
        createCompanyPage = new CreateCompanyPage(page);
        await page.goto(testData.urls.companyList);

        const createButton = page.locator(testData.elements.companyList.createButton)
        await createButton.waitFor({state: 'visible', timeout: 30000});
        await createButton.click();

        await page.waitForLoadState('networkidle');
    });

    test('should load to company create page', async ({page}) => {

        try {
            // Verify we're on the company list page
            console.log('Checking if redirected to company list page...');
            const  {title, sectionCount, sectionHeader}=await createCompanyPage.waitForCompanyCreatePageLoad();
            await expect(title).toHaveText('Create Company', { timeout: 30000 });
            await expect(sectionCount).toBe(7);
            console.log('Section headers:', sectionHeader);
    
        } catch (error) {
            console.error('Test failed:', error);
            await page.screenshot({path: 'tests/features/company/list/screenshots/company-list-auth-error.png', fullPage: true});
            throw error;
        }
    });
    test('creation failed without data', async ({page}) => {
        const companyName = await page.locator(testData.elements.createCompany.businessName)
        await companyName.waitFor({state: 'visible', timeout: 30000});

        await createCompanyPage.clickCreateCompanyButton();

        const validationClass = await companyName.getAttribute('class');
        if(validationClass.includes('invalid')) {
            console.log('Validation error class found:', validationClass);
        }
        else {
            console.log('Validation error class not found:', validationClass);
        }
       

    })
    // test('creation failed without all required data', async ({page}) => {})
    // test('should create company with all required data', async ({page}) => {})

   
})
