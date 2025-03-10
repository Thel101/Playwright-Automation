class BasePage {
    constructor(page) {
        this.page = page;
    }

    async waitForSelector(selector, options = {}) {
        return await this.page.waitForSelector(selector, options);
    }

    async click(selector) {
        await this.page.click(selector);
    }

    async type(selector, text) {
        await this.page.locator(selector).fill(text);
    }

    async getText(selector) {
        return await this.page.locator(selector).textContent();
    }

    async isVisible(selector) {
        return await this.page.locator(selector).isVisible();
    }
}

module.exports = BasePage;
