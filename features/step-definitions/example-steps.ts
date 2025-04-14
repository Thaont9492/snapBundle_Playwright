import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

/**
 * Interface to store product information for better type safety
 */
interface ProductInfo {
  name: string;
  expectedHeadingText: string;
}

/**
 * Step definitions for Shopify store navigation and product verification
 */
Given('I am on the Shopify store homepage', async function() {
  // Initialize product information storage
  this.productInfo = {} as Record<string, ProductInfo>;
  await this.page.goto('https://bunny92.myshopify.com/');
});

When('I navigate to the first product page', async function() {
  const productName = '12 Ti Xelium Skis';
  
  // Use modern Playwright selectors with proper auto-waiting
  await this.page.getByRole('link', { name: productName }).click();
  
  // Store product info with proper typing
  this.productInfo.first = {
    name: productName,
    expectedHeadingText: productName
  };
  
  // Track the current product for use in the Then step
  this.currentProduct = 'first';
});

When('I navigate to the second product page', async function() {
  const productName = '14k Bloom Earrings';
  
  // Use modern Playwright selectors with proper auto-waiting
  await this.page.getByRole('link', { name: productName }).click();
  
  // Store product info with proper typing
  this.productInfo.second = {
    name: productName,
    expectedHeadingText: productName
  };
  
  // Track the current product for use in the Then step
  this.currentProduct = 'second';
});

Then('I should see product details', async function() {
  // Get the current product's information
  const product = this.productInfo[this.currentProduct];
  
  // Verify product details are displayed using Playwright's built-in assertions
  await expect(this.page.getByRole('heading', { name: product.expectedHeadingText })).toBeVisible();
  
  // Additional assertions for common product elements
  await expect(this.page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
});