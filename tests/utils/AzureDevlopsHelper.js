const { request, expect } = require ('@playwright/test');
const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');

const credentials = Buffer.from(`${process.env.AZURE_DEVOPS_USER}:${process.env.AZURE_DEVOPS_PASS}`).to('base64');

/**
 * Testers Talk
 */
class AzureDevOps {
    constructor() { }

    /**
     * Testers Talk
     */
    async updateTestCaseStatus(testCaseId, testCaseStatus) {
        try {
            const testPlanId = process.env.TEST_PLAN_ID;
            const testSuiteId = process.env.TEST_SUITE_ID;

            const testPointId = await this.getTestPoint(testPlanId, testSuiteId, testCaseId);
            await this.updateTestPointStatus(testPlanId, testSuiteId, testPointId, testCaseStatus.charAt(0).toUpperCase() + testCaseStatus.slice(1));

            console.log(`Updated Test Case ID - ${testCaseId} as ${testCaseStatus} in test plan`);
        } catch (error) {
            console.error('Error in updating test case status:', error);
        }
    }

    /**
     * Testers Talk
     */
    async getTestPoint(testPlanId , testSuiteId, testCaseId){
        const values = [testPlanId, testSuiteId, testCaseId];
        const URL = (process.env.TEST_PLAN_GET_API || '').replace(/{(\d+)}/g, (match, number) => values[number] || match);
        const getTestPointResponse = await axios.get(URL, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Basic ${credentials}`
            },
        });

        const jsonResponse = await getTestPointResponse.data;
        expect(getTestPointResponse.status).toBe(200);
        return jsonResponse.value[0].id;
    }

    /**
     * Testers Talk
     */
    async updateTestPointStatus(testPlanId , testSuiteId , testPointId , testCaseStatus ) {
        const values = [testPlanId, testSuiteId, testPointId];
        if (!process.env.TEST_PLAN_PATCH_API) {
            throw new Error('TEST_PLAN_PATCH_API is not defined in the environment variables');
        }
        const URL = process.env.TEST_PLAN_PATCH_API.replace(/{(\d+)}/g, (match, number) => values[number] || match);

        const requestBody = {
            "outcome" : testCaseStatus // Passed, Failed, Blocked, etc.
        };

        try {
            const patchAPIResponse = await axios.patch(URL, requestBody, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Basic ${credentials}`
                }
            });
            expect(patchAPIResponse.status).toBe(200);
        } catch (error) {
            console.error('Error occurred during API request:', error.message);
            console.error('Stack trace:', error.stack);
        }
    }
}

module.exports = AzureDevOps;