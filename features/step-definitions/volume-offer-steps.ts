import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';

/**
 * Step definitions for Product Volume Offer Features
 */

// Store product URLs centrally for easy maintenance
const productUrls: Record<string, string> = {
  '14k Dangling Pendant Earrings': 'https://bunny92.myshopify.com/products/14k-dangling-pendant-earrings-1'
};

// Background steps
Given('I am logged in to the Shopify store', async function() {
  // No need to perform login steps since authentication is handled in hooks.ts
  // The hooks.ts file already sets up an authenticated session that's reused across all tests
  
  // Just navigate to the store homepage to confirm session works
  await this.page.goto('https://bunny92.myshopify.com/', { waitUntil: 'networkidle' });
  
  
});

Given('I navigate to the {string} product page', async function(productName: string) {
  // Create product page instance
  const productPage = new ProductPage(this.page);
  
  // Store the product for later use
  if (!this.productInfo) {
    this.productInfo = {};
  }
  
  this.productInfo[productName] = {
    name: productName,
    url: productUrls[productName] || ''
  };
  
  this.currentProduct = productName;
  
  // Navigate to the product page
  await productPage.navigateToProduct(productUrls[productName]);
  
  // Initialize volume offer info
  this.volumeOfferInfo = {
    selectedTier: ''
  };
});

// Then steps for the first scenario
Then('I should see the volume offer table', async function() {
  const productPage = new ProductPage(this.page);
  
  // Use Playwright's built-in assertions
  const volumeOfferTable = await productPage.getVolumeOfferTable();
  await expect(volumeOfferTable).toBeVisible();
});

Then('the volume offer table should be positioned below the quantity selector', async function() {
  const productPage = new ProductPage(this.page);
  
  // Check positioning
  const isPositionedCorrectly = await productPage.isVolumeOfferTableBelowQuantitySelector();
  expect(isPositionedCorrectly).toBeTruthy();
});

Then('the volume offer table should display multiple tier options', async function() {
  const productPage = new ProductPage(this.page);
  
  // Get tier options and check count
  const tierOptions = await productPage.getTierOptions();
  const count = await tierOptions.count();
  
  // Expect at least 2 tiers in a volume offer
  expect(count).toBeGreaterThanOrEqual(2);
});

Then('each tier should show a quantity and discounted price', async function() {
  const productPage = new ProductPage(this.page);
  
  // Check tier information
  const hasTierInformation = await productPage.checkTierInformation();
  expect(hasTierInformation).toBeTruthy();
});

// When/Then steps for the second scenario
When('I click on tier last', async function() {
  const productPage = new ProductPage(this.page);
  
  // Click the tierawait page.locator('div').filter({ hasText: /^Buy 8 - 9 save \$578\.85Best saved\$5,154\.08\$5,732\.93$/ }).nth(1).click(); and store the selection
  await productPage.clickTier();
 // this.volumeOfferInfo.selectedTier = await productPage.getSelectedTier();
});

When('I click the {string} button', async function(buttonName: string) {
  const productPage = new ProductPage(this.page);
  
  // Click the specified button
  if (buttonName === 'Grab deal now') {
    await productPage.clickGrabDealButton();
  } else {
    // Handle other buttons if needed
    await this.page.getByRole('button', { name: buttonName }).click();
  }
});

Then('{int} items should be added to my cart', async function(expectedQuantity: number) {
  const productPage = new ProductPage(this.page);
  
  // Wait for cart to update
  await this.page.waitForTimeout(8000);
  
  // Get cart quantity and verify
  const cartQuantity = await productPage.getCartQuantity();
  expect(cartQuantity).toBe(expectedQuantity);
});

Then('the correct discounted name should appear', async function() {
  // The specific price check would depend on your product's pricing structure
  // Here's a generic implementation that can be adjusted
  const productPage = new ProductPage(this.page);
  
  // Get discouted name from the cart
  const discountedName = await productPage.getDiscountName();
  
  // We would need to know the expected discount amount based on the tier selected
  // For now, we'll just check that the discount name is displayed
  expect(discountedName).toBeTruthy();
});