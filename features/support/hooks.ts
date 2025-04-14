import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser, BrowserContext, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { CustomWorld } from './world';

// Configuration constants
const STORAGE_STATE_PATH = path.join(__dirname, '../../.auth/storage-state.json');
const SHOPIFY_URL = 'https://bunny92.myshopify.com/';
const SHOPIFY_PASSWORD = '1234';
const DEFAULT_TIMEOUT = 30000; // 30 seconds timeout
const SCREENSHOTS_DIR = path.join(__dirname, '../../playwright-report/screenshots');

// Set default timeout for all steps
setDefaultTimeout(DEFAULT_TIMEOUT);

// Browser instance to be shared across all scenarios
let browser: Browser;

// Create necessary directories if they don't exist
BeforeAll(async function() {
  try {
    // Create auth directory
    const authDir = path.dirname(STORAGE_STATE_PATH);
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
    
    // Create screenshots directory
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }
    
    // Launch the browser with improved configuration
    browser = await chromium.launch({
      headless: process.env.CI ? true : false, // Run headed locally, headless in CI
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0, // Optional slow down for debugging
      args: ['--disable-dev-shm-usage'], // Useful when running in containers
      timeout: 30000, // Browser launch timeout
    });
    console.log('Browser launched successfully');
  } catch (error) {
    console.error('Failed to launch browser:', error);
    throw error; // Re-throw to fail the test
  }
});

// Close the browser after all tests
AfterAll(async function() {
  try {
    if (browser) {
      await browser.close();
      console.log('Browser closed successfully');
    }
  } catch (error) {
    console.error('Error closing browser:', error);
  }
});

Before(async function(this: CustomWorld) {
  try {
    if (!browser) {
      throw new Error('Browser was not launched in BeforeAll hook');
    }

    // Create a context with viewport and device settings
    const contextOptions = {
      ...devices['Desktop Chrome'], // Default to desktop Chrome settings
      viewport: { width: 1280, height: 720 },
      recordVideo: process.env.RECORD_VIDEO ? { dir: 'playwright-report/videos/' } : undefined,
      acceptDownloads: true, // Auto-accept downloads
    };

    // Check if we have a saved auth state
    let context: BrowserContext;
    if (fs.existsSync(STORAGE_STATE_PATH)) {
      // Create a new context with the saved storage state
      context = await browser.newContext({
        ...contextOptions,
        storageState: STORAGE_STATE_PATH
      });
      console.log('Created browser context using saved authentication');
    } else {
      // Create a new context and authenticate
      context = await browser.newContext(contextOptions);
      const page = await context.newPage();
      
      console.log('Navigating to Shopify site for authentication');
      // Go to the Shopify site with better waiting strategy
      await page.goto(SHOPIFY_URL, { waitUntil: 'networkidle' });
      
      // Check if we're at the password page
      if (page.url().includes('/password')) {
        console.log('Password page detected. Entering store password...');
        // Use modern Playwright selectors
        await page.locator('id=password').fill(SHOPIFY_PASSWORD);
        await page.locator('button').press('Enter');
        
        // Wait for navigation after password submission
        await page.waitForURL(url => !url.toString().includes('/password'), { waitUntil: 'networkidle' });
        
        // Save the authenticated state
        await context.storageState({ path: STORAGE_STATE_PATH });
        console.log('Authentication completed and state saved');
      }
      
      // Close this page as we'll create a new one for each scenario
      await page.close();
    }
    
    // Enable automatic tracing for better debugging
    await context.tracing.start({ screenshots: true, snapshots: true });
    
    // Assign the authenticated context to the world
    this.context = context;
    // Create a new page for this scenario
    this.page = await context.newPage();
    
    // Add page error handling
    this.page.on('pageerror', exception => {
      console.error(`Page error: ${exception.message}`);
    });
    
    // Store scenario info
    this.scenarioInfo = {
      startTime: new Date(),
      name: this.testName || 'Unknown Scenario'
    };
  } catch (error) {
    console.error('Error in Before hook:', error);
    throw error; // Re-throw to fail the test
  }
});

// After each scenario, capture details, close the page but keep the context
After(async function(this: CustomWorld, scenario) {
  try {
    // Stop tracing and save if needed
    if (this.context) {
      await this.context.tracing.stop({ 
        path: `playwright-report/trace/${this.scenarioInfo?.name.replace(/\s+/g, '-').toLowerCase()}.zip` 
      });
    }
    
    // Capture screenshot on failure
    if (scenario.result?.status === Status.FAILED && this.page) {
      // Create timestamp for unique screenshot name
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = path.join(
        SCREENSHOTS_DIR,
        `${scenario.pickle.name.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.png`
      );
      
      // Take a screenshot
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Screenshot saved to ${screenshotPath}`);
    }
    
    // Close the page
    if (this.page) {
      await this.page.close();
      console.log('Page closed after scenario');
    }
  } catch (error) {
    console.error('Error in After hook:', error);
  }
});