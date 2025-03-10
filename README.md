# Playwright Automation Framework

A structured automation framework using Playwright for JavaScript.

## Project Structure

```
├── tests/
│   ├── pageObjects/        # Page Object Models
│   │   ├── BasePage.js     # Base page with common methods
│   │   └── LoginPage.js    # Sample login page object
│   ├── utils/             # Utility functions
│   │   └── testHelpers.js  # Common helper functions
│   ├── testData/          # Test data in JSON format
│   │   └── loginData.json  # Sample test data
│   └── login.spec.js      # Sample test suite
├── playwright.config.js   # Playwright configuration
└── package.json          # Project dependencies
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

Run all tests:
```bash
npx playwright test
```

Run specific test file:
```bash
npx playwright test tests/login.spec.js
```

Run tests in UI mode:
```bash
npx playwright test --ui
```

## Test Reports

View HTML report:
```bash
npx playwright show-report
```

## Best Practices

1. Use Page Object Model for better maintainability
2. Keep test data separate in JSON files
3. Utilize the BasePage class for common operations
4. Use utility functions for repeated operations
5. Follow proper naming conventions for test files and functions

## Azure DevOps Integration

1. Create azure-pipelines.yml in your repository
2. Configure build pipeline in Azure DevOps
3. Set up test reporting and artifacts
