const fs = require('fs');
const xml2js = require('xml2js');
const axios = require('axios');

// Config
const AZURE_ORG = 'auditmypayroll';
const AZURE_PROJECT = 'Automation Playwright';
const TEST_PLAN_ID = 3489;
const TEST_SUITE_ID = 3490;
const AZURE_PAT = '8Q7TQQzfWeTBOiCdSHCQYYL0LDwbBDsYioNYt5Uvmtx6W1cL4MFuJQQJ99BDACAAAAAK4GPBAAASAZDO22WV'; 
const MAPPING_FILE = './mapping.json';
const TEST_RESULTS_FILE = 'test-results/junit-report.xml';

const AZURE_API_BASE = `https://dev.azure.com/${AZURE_ORG}/${AZURE_PROJECT}/_apis`;
const AUTH_HEADER = {
  Authorization: `Basic ${Buffer.from(`:${AZURE_PAT}`).toString('base64')}`
};

(async () => {
  const testNameToCaseId = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
  const xml = fs.readFileSync(TEST_RESULTS_FILE, 'utf8');

  const parsed = await xml2js.parseStringPromise(xml);
  const testCases = parsed.testsuite.testcase || [];

  // Step 1: Create test run
  const createRunResponse = await axios.post(
    `${AZURE_API_BASE}/test/runs?api-version=7.1-preview.3`,
    {
      name: `Playwright Test Run - ${new Date().toISOString()}`,
      plan: { id: TEST_PLAN_ID },
      automated: true
    },
    { headers: AUTH_HEADER }
  );

  const runId = createRunResponse.data.id;
  console.log(`Created Test Run ID: ${runId}`);

  // Step 2: Add results
  const resultsPayload = testCases
    .filter(tc => testNameToCaseId[tc.$.name])
    .map(tc => ({
      testCase: { id: testNameToCaseId[tc.$.name] },
      outcome: tc.failure ? 'Failed' : 'Passed',
      durationInMs: parseInt(tc.$.time || '0') * 1000,
      automatedTestName: tc.$.name,
      state: 'Completed'
    }));

  const resultsResponse = await axios.post(
    `${AZURE_API_BASE}/test/runs/${runId}/results?api-version=7.1-preview.3`,
    resultsPayload,
    { headers: AUTH_HEADER }
  );

  console.log(`Uploaded ${resultsResponse.data.length} test results to run ${runId}`);
})();
