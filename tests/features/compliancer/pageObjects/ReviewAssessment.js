const { expect } = require('playwright/test');
const BasePage = require('../../../utils/BasePage');
const testData = require('../testData/assessmentData.json');
const elements = testData.elements;

class ReviewAssessment extends BasePage {
    constructor(page) {
        super(page);
    }

    async navigateToAssessment() {
        await this.page.goto(testData.urls.baseUrl);
        await this.page.locator('div').filter({ hasText: /^payrollcompliancer$/ }).first().click();
        await this.page.getByRole('button', { name: 'Assessment' }).click();
    }
    async chooseAssessment() {
        await this.page.locator('div').filter({ hasText: /^Assessment$/ }).getByLabel('open combobox').click();
        await this.page.getByRole('option', { name: 'Snow Assessment 2' }).click();
        await this.page.getByRole('button', { name: 'Review' }).click();
        await this.page.waitForLoadState('networkidle', { timeout: 60000 });
    }
    async checkForComponents() {
        //check for overall risk component
        const overall_risk = this.page.locator(elements.overall_risk);
        await expect(overall_risk).toBeVisible();


        //check for table column
        const pillar_column = this.page.getByRole('columnheader', { name: 'Pillar Name' });
        const risk_column = this.page.getByRole('columnheader', { name: 'Risk Level Result' });
        const policy_column = this.page.getByRole('columnheader', { name: 'Related Policy' });

        await expect(pillar_column).toBeVisible();
        await expect(risk_column).toBeVisible();
        await expect(policy_column).toBeVisible();

        const pillars = this.page.locator(elements.pillars);
        await expect(pillars).toHaveCount(5);
    }
    async checkPillarDetail() {
  
        const scoreDiv = this.page.locator(elements.score);
        const [score1, score2, score3] = await scoreDiv.allTextContents();
        
        const intScore1 = await this.mapSocreWithRiskLevel(score1);
        const intScore2 = await this.mapSocreWithRiskLevel(score2);
        const intScore3 = await this.mapSocreWithRiskLevel(score3);
        
        const pillarScoreDiv = this.page.locator(elements.pillarScore);
        const expectedPillarScore = await this.calculatePillarOverallScore(intScore1, intScore2, intScore3);
        await expect(pillarScoreDiv).toHaveText(expectedPillarScore);
        console.log(`Pillar Overall Score: ${expectedPillarScore}`);

    }
    async

    async mapSocreWithRiskLevel(score) {
        const ratingMap = {
            'Outstanding': 5,
            'Excellent': 5,
            'Strong': 4,
            'Moderate': 3,
            'Weak': 2,
            'Critical Risk': 1
        };
        return ratingMap[score.trim()] ?? 0;  // 5
    }


    async calculatePillarOverallScore(sc1, sc2, sc3) {
        const total = sc1 + sc2 + sc3;
        const maxTotal = 5 * 3;
        const pct = (total / maxTotal) * 100;

        // 3) map to category
        if (pct >= 81) return 'Outstanding';
        if (pct >= 61) return 'Strong';
        if (pct >= 41) return 'Moderate';
        if (pct >= 21) return 'Weak';
        else return 'Critical Risk';
    }
}
module.exports = ReviewAssessment;