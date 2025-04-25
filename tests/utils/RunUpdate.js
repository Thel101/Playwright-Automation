const { updateTestCaseStatusInTestPlan } = require('../utils/Common.js');

async function run() {
  try {
    await updateTestCaseStatusInTestPlan();
  } catch (error) {
    console.error('Error executing updateTestCaseStatusInTestPlan:', error);
  }
}

run();