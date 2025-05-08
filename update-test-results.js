
const fs = require('fs');
const xml2js = require('xml2js');
const axios = require('axios');

const organization = 'auditmypayroll';
const project = 'Automation Playwright';
const planId = '3489';
const pat = '8Q7TQQzfWeTBOiCdSHCQYYL0LDwbBDsYioNYt5Uvmtx6W1cL4MFuJQQJ99BDACAAAAAK4GPBAAASAZDO22WV';

const auth = Buffer.from(':' + pat).toString('base64');

async function createTestRun() {
  const response = await axios.post(
    `https://dev.azure.com/${organization}/${project}/_apis/test/runs?api-version=7.1-preview.3`,
    {
      name: 'Playwright Automated Run',
      plan: { id: planId },
      automated: true
    },
    { headers: { Authorization: `Basic ${auth}` } }
  );
  return response.data.id;
}

async function addTestResults(runId, results) {
  await axios.post(
    `https://dev.azure.com/${organization}/${project}/_apis/test/Runs/${runId}/results?api-version=7.1-preview.3`,
    results,
    { headers: { Authorization: `Basic ${auth}` } }
  );
}

async function completeTestRun(runId) {
  await axios.patch(
    `https://dev.azure.com/${organization}/${project}/_apis/test/runs/${runId}?api-version=7.1-preview.3`,
    { state: 'Completed' },
    { headers: { Authorization: `Basic ${auth}` } }
  );
}

function parseTestCaseId(testName) {
  // Expecting test names like "TC123 - Test login"
  const match = testName.match(/TC(\d+)/);
  return match ? match[1] : null;
}

async function main() {
  // Step 1: Parse the JUnit XML
  const xml = fs.readFileSync('test-results/junit-report.xml', 'utf-8');
  const result = await xml2js.parseStringPromise(xml);

  const testCases = result.testsuites.testsuite[0].testcase;

  const testResults = [];

  for (const test of testCases) {
    const testName = test.$.name;
    const caseId = parseTestCaseId(testName);

    if (!caseId) continue; // skip tests without TC id

    const outcome = test.failure ? 'Failed' : 'Passed';

    testResults.push({
      testCase: { id: caseId },
      outcome,
      state: 'Completed',
      automatedTestName: `TC${caseId}`,
      automatedTestType: 'Playwright Test'
    });
  }

  if (testResults.length === 0) {
    console.log('No test cases with TC IDs found!');
    return;
  }

  // Step 2: Create Test Run
  const runId = await createTestRun();
  console.log(`Created Test Run: ${runId}`);

  // Step 3: Add Test Results
  await addTestResults(runId, testResults);
  console.log(`Updated ${testResults.length} test results`);

  // Step 4: Complete Run
  await completeTestRun(runId);
  console.log(`Test Run ${runId} completed`);
}

main().catch(console.error);
