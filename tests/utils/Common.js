import { Page } from '@playwright/test';
import AzureDevOps from '../../src/utils/AzureDevOpsHelper';
import * as fs from 'fs';

import dotenv from 'dotenv';
dotenv.config();

async function readJsonReport() {
    const azureDevOps = new AzureDevOps();
    const filePath = 'json-test-report.json';

    if (process.env.UPDATE_TEST_PLAN === 'Yes' && process.env.PIPELINE === 'Yes') {

        await waitForFile(filePath);

        try {
            const TestReport = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            data.suites.forEach(suite => {
                suite.specs.forEach(spec => {
                    const testCaseTitle = `${spec.title}`;
                    spec.tests.forEach(test => {
                        test.results.forEach(async result => {
                            const testCaseStatus = `${result.status}`;

                            const matches = testCaseTitle.match(/\[(.*?)\]/);
                            const numbersPart = matches?.[1];
                            const numbersArray = numbersPart?.split(',').map(num => parseInt(num.trim(), 10)) ?? [];

                            for (const testCaseId of numbersArray) {
                                console.log(`Test Case & Status : ${testCaseId} : ${testCaseStatus}`);
                                await azureDevOps.updateTestCaseStatus(String(testCaseId), testCaseStatus);
                            }
                        });
                    });
                });
            });
        } catch (error) {
            console.error('Error while readinf JSON report' + error)
        }
    } else {
        console.log('Update test plan or pipeline conditions not met.');
    }
}
export async function updateTestCaseStatusInTestPlan() {
    await readJsonReport();
}