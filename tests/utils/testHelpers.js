const fs = require('fs');
const path = require('path');

class TestHelpers {
    static async loadTestData(filename) {
        const filePath = path.join(__dirname, '../testData', filename);
        const rawData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(rawData);
    }

    static generateRandomString(length = 8) {
        return Math.random().toString(36).substring(2, length + 2);
    }

    static async takeScreenshot(page, name) {
        const screenshotPath = path.join(__dirname, '../screenshots', `${name}_${Date.now()}.png`);
        await page.screenshot({ path: screenshotPath });
    }
}

module.exports = TestHelpers;
