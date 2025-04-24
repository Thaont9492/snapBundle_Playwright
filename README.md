# Playwright-Cucumber-TypeScript Automation Framework

This project is an end-to-end testing framework built with Playwright, Cucumber, and TypeScript, following the Page Object Model pattern.

## 🚀 Features

- Page Object Model implementation
- TypeScript support with strict type checking
- Cucumber BDD scenarios
- Screenshot capture on failure
- Video recording capability
- HTML report generation
- Storage state management for authentication
- Cross-browser testing support (Chrome, Firefox, WebKit)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## 🛠️ Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## 📁 Project Structure

```
├── .auth/                  # Authentication state storage
├── features/              
│   ├── pages/             # Page Object Models
│   ├── step-definitions/  # Step implementation
│   └── support/          # Support files and hooks
├── playwright-report/     # Test reports and artifacts
└── cucumber-report.html   # HTML test report
```

## 🏃‍♂️ Running Tests

### Run all tests:
```bash
npm run test:cucumber
```

### Run with Playwright Test Runner:
```bash
npm run test:playwright
```

## 📊 Test Reports

- Screenshots of failed tests are saved in `playwright-report/screenshots`
- Videos (if enabled) are saved in `playwright-report/videos`
- Traces are saved in `playwright-report/trace`

## 🔧 Dependencies

Main dependencies and their versions:
- @cucumber/cucumber: ^10.1.0
- @playwright/test: ^1.51.1
- TypeScript: ^5.2.2
- ts-node: ^10.9.1

## 🌐 Environment Variables

Create a `.env` file in the root directory with these variables:
```
HEADLESS=false
BROWSER=chromium
SLOW_MO=0
RECORD_VIDEO=false
```

## 📝 Best Practices

- Write atomic, independent scenarios
- Use proper waiting strategies
- Implement proper error handling
- Follow TypeScript strict mode guidelines
- Use modern Playwright selectors
- Keep step definitions focused and reusable

## 📚 Documentation

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber.js Documentation](https://github.com/cucumber/cucumber-js)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 📄 License

This project is licensed under the ISC License
