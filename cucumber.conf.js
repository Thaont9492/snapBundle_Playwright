const { Before, After, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

// Set timeout for Cucumber steps
setDefaultTimeout(60000);

// Launch browser before all tests
BeforeAll(async function() {
  global.browser = await chromium.launch({
    headless: true,
    // Set slow motion value for debugging if needed
    // slowMo: 50
  });
});

// Close browser after all tests
AfterAll(async function() {
  await global.browser.close();
});

// Create a new browser context and page for each scenario
Before(async function() {
  this.context = await global.browser.newContext();
  this.page = await this.context.newPage();
});

// Close the page and context after each scenario
After(async function() {
  await this.page.close();
  await this.context.close();
});