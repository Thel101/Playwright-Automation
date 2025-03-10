class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigate(url) {
        await this.page.goto(url);
    }

    async waitForElement(selector) {
        await this.page.waitForSelector(selector);
    }

    async click(selector) {
        await this.page.click(selector);
    }

    async type(selector, text) {
        await this.page.fill(selector, text);
    }

    async getText(selector) {
        return await this.page.textContent(selector);
    }
}

module.exports = BasePage;
