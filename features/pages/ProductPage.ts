import { Page } from '@playwright/test';

/**
 * Page Object Model for Product pages with volume offers
 */
export class ProductPage {
  constructor(private page: Page) {}

  /**
   * Navigates to a specific product page
   * @param productUrl The URL of the product
   */
  async navigateToProduct(productUrl: string): Promise<void> {
    await this.page.goto(productUrl);
  }

  
  /**
   * Gets the volume offer table element
   */
  async getVolumeOfferTable() {
    return this.page.locator('#snapbundle-volume-offer-table');
  }

  /**
   * Checks if the volume offer table is visible
   */
  async isVolumeOfferTableVisible(): Promise<boolean> {
    const table = await this.getVolumeOfferTable();
    return await table.isVisible();
  }

  /**
   * Checks if the volume offer table is positioned below the quantity selector
   */
  async isVolumeOfferTableBelowQuantitySelector(): Promise<boolean> {
    const quantitySelector = await this.page.locator('.product-form__quantity');
    const volumeOfferTable = await this.getVolumeOfferTable();
    
    const quantitySelectorBox = await quantitySelector.boundingBox();
    const volumeOfferTableBox = await volumeOfferTable.boundingBox();
    
    if (!quantitySelectorBox || !volumeOfferTableBox) return false;
    
    return quantitySelectorBox.y < volumeOfferTableBox.y;
  }

  /**
   * Gets all tier options from the volume offer table
   */
  async getTierOptions() {
    return this.page.locator('.sb__vt-bg-tier');
  }

  /**
   * Checks if the tier shows quantity and price information
   */
  async checkTierInformation(): Promise<boolean> {
    const tiers = await this.getTierOptions();
    const count = await tiers.count();
    
    for (let i = 0; i < count; i++) {
      const tier = tiers.nth(i);
      const hasQuantity = await tier.locator('.sb__vt-title-tier').isVisible();
      const hasPrice = await tier.locator('.b__vt-block--price-discount-tier').isVisible();
      
      if (!hasQuantity || !hasPrice) return false;
    }
    
    return true;
  }

  /**
   * Clicks on a specific tier by number
   * @param tierNumber The tier number to click
   */
  async clickTier(tierNumber: number): Promise<void> {
    await this.page.locator('.sb__vt-bg-tier:nth-of-type(${tierNumber})').click();
  }

  /**
   * Clicks the "Grab deal now" button
   */
  async clickGrabDealButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Grab offer now' }).click();
  }

  /**
   * Gets the current cart quantity
   */
  async getCartQuantity(): Promise<number> {
    const cartCount = await this.page.locator('.quantity__input').textContent();
    return parseInt(cartCount || '0', 10);
  }

  /**
   * Gets the discount name for validation
   */
  async getDiscountName(){
    const discountName = await this.page.getByLabel('SnapBundle-Product based #2');
    return discountName;
  }
}