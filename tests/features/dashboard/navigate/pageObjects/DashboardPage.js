const BasePage = require('../../../../utils/BasePage');
const testData = require('../testData/dashboardData.json');

class DashboardPage extends BasePage {
    constructor(page) {
        super(page);
        this.selectors = {
            userButton: '#user-button'
        };
    }

    async waitForDashboardLoad() {
        console.log('Waiting for dashboard to load...');
        try {
            await this.page.waitForSelector(this.selectors.userButton, {
                state: 'visible',
                timeout: 30000
            });
            await this.page.waitForLoadState('networkidle');
            console.log('Dashboard loaded successfully');
        } catch (error) {
            console.error('Failed to load dashboard:', error);
            await this.page.screenshot({ path: 'tests/features/dashboard/navigate/screenshots/dashboard-load-error.png', fullPage: true });
            throw error;
        }
    }
    async checkCompliancerSection() {
        return await this.page.locator('h2:has-text("Payroll Compliancer")')
    }
    async checkAutierSection() {
        return await this.page.locator('h3:has-text("Payroll Auditer")')
    }
    async checkNewsFeedSection() {
        return await this.page.locator('h2:has-text("News Feed")')
    }
    async checkPillarsComponent() {
        return await this.page.locator('li.react-multi-carousel-item--active');

    }
    async checkCarouselButtons() {
        const nextButton = this.page.locator('div.carousel-left');
        const prevButton = this.page.locator('div.carousel-right');

        await nextButton.waitFor({ state: 'visible', timeout: 3000 });
        await prevButton.waitFor({ state: 'visible', timeout: 3000 });

        return { nextButton, prevButton };
    }
    async checkAuditerButtons() {
        const requestText = this.page.locator('div.payroll-auditer-area-detail:has-text("Click below to request")'); // Updated to div and its class
        const contactUsButton = this.page.locator('button.amp-btn.upload-btn:has-text("Contact Us")'); // Added more specific classes
        return [requestText, contactUsButton ];
    }
    async checkNewsFeedComponents() {
        const newsFeedLinks = this.page.locator('div.new-feed-list-row');
        
        const footer = this.page.locator('div.pagination')
        await footer.waitFor({ state: 'visible', timeout: 30000 });

        return [newsFeedLinks, footer ];
    }



    async logout() {
        console.log('Logging out...');
        const logoutButton = this.page.locator(this.selectors.logoutButton);
        await logoutButton.waitFor({ state: 'visible', timeout: 30000 });
        await logoutButton.click();
        await this.page.waitForLoadState('networkidle');
        console.log('Logged out successfully');
    }
}

module.exports = DashboardPage;
