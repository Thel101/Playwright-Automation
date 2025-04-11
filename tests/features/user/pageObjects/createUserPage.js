const BasePage = require('../../../utils/BasePage');
const testData = require('../testData/userData.json');

class createUserPage extends BasePage {
    constructor(page) {
        super(page);
        this.selectors = testData.elements
        this.urls = testData.urls;
    }
    async directToAdminPage() {
        console.log('Waiting for admin page to load...');
        try {
            await this.page.waitForSelector(this.selectors.adminMenu, {
                state: 'visible',
                timeout: 30000
            });
            await this.page.waitForLoadState('networkidle');
            await this.page.click(this.selectors.adminMenu);
            console.log('Admin page loaded successfully');
        } catch (error) {
            console.error('Failed to load admin page:', error);
            await this.page.screenshot({ path: 'tests/features/dashboard/navigate/screenshots/admin-load-error.png', fullPage: true });
            throw error;
        }
    }

    async waitForAdminPageLoad() {
        console.log('Navigating to Admin Page...');
        const pageTitle = this.page.locator(this.selectors.adminPageTitle);
        const subTitle = this.page.locator(this.selectors.adminPageSubTitle);
        await pageTitle.waitFor({ state: 'visible', timeout: 30000 });
        await subTitle.waitFor({ state: 'visible', timeout: 30000 });
        const titleText = await pageTitle.textContent();
        const subTitleText = await subTitle.textContent();
        return { titleText, subTitleText };
    }

    async navigateToUserList() {
        console.log('Navigating to user list...');
        await this.page.goto(this.urls.userListUrl, { waitUntil: 'networkidle' });

        const createUserButton = this.page.locator(this.selectors.createUserButton);
        await createUserButton.waitFor({ state: 'visible', timeout: 30000 });
        await createUserButton.click()
        const createUserPageTitle = this.page.locator(this.selectors.createUserPageTitle);
        return createUserPageTitle;
    }
  

    async createNewUser() {
        const companyName = this.page.locator(this.selectors.companyName);
        await companyName.getByRole('button', { name: 'open combobox' }).nth(0).click();
        await companyName.getByRole('option', { name: 'Pkyaw Company' }).click();
       
        const userRole = this.page.locator(this.selectors.userRole);
        await userRole.getByRole('button', { name: 'open combobox' }).nth(1).click();
        await userRole.getByRole('option', { name: 'Basic User' }).click();
       
    
        await this.page.getByRole('img', { name: 'Close' }).click();
    
        await this.page.getByPlaceholder('Select one or more options').click();
        await this.page.getByRole('option', { name: 'CTO', exact: true }).click();
    
        const username = "Phyu"
        await this.page.locator(this.selectors.name).fill(username)
    
        await this.page.locator(this.selectors.position).fill("QA");

        const email = "jopa5853@movfull.com"
        await this.page.locator(this.selectors.email).fill(email);
    
        // await this.page.getByRole('button', { name: 'Create' }).click()
    
        // await expect (page.locator('h1.popup-title')).toHaveText('Success')
        // await expect (page.locator('p.popup-message')).toHaveText(`The user - ${username} has been successfully created.`)
        // await this.page.getByRole('button', { name: 'OK' }).click()
    
    }

    
}

module.exports = createUserPage;
