import { test, expect } from '@playwright/test';

const TARGET_URL = "http://localhost:3000";

test.describe('Search and Catalog System (Funcional & AppSec)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(TARGET_URL);
    await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
    await page.getByRole('button', { name: 'dismiss cookie message' }).click();
  });

  test('Search for "Apple" and validate the real image loading', async ({ page }) => {

    await page.getByText('search').click();
    await page.locator('#mat-input-1').click();
    await page.locator('#mat-input-1').fill('apple');
    await page.locator('#mat-input-1').press('Enter');
    await page.getByRole('button', { name: 'Apple Juice (1000ml)' }).click();
    await page.getByRole('img', { name: 'Apple Juice (1000ml)' }).click();
    const imageLocator = page.getByRole('img', { name: 'Apple Juice (1000ml)' });
    await imageLocator.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
  });

  test('Should inspect the API response when searching for a product (Sensitive Data Exposure)', async ({ page }) => {
    
    await page.getByText('search').click();
    await page.locator('#mat-input-1').click();
    await page.locator('#mat-input-1').fill('apple');
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/rest/products/search') && response.status() === 200
    );
    await page.locator('#mat-input-1').press('Enter');

    const response = await responsePromise;
    const body = await response.json();
    const products = body.data

    const sensitiveFields = ['deletedAt', 'password', 'newPassword', 'hashedPassword', 'createdAt', 'updatedAt']

    for (const product of products) {
      for(const field of sensitiveFields) {
        expect(product, `Sensitive Data Leakage: Internal Structure Exposed in ${field}`).not.toHaveProperty(field)
      }
    }
  });

  test('should trigger the browser alert when injecting Reflected XSS Payload in search', async ({ page }) => {
    let isXssAlertTriggered = false;
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('xss');
      isXssAlertTriggered = true;
      await dialog.dismiss();
      
    });
    await page.getByText('search').click();
    await page.locator('#mat-input-1').click();
    await page.locator('#mat-input-1').fill(' <iframe src="javascript:alert(`xss`)">');
    await page.locator('#mat-input-1').press('Enter');
    await page.waitForTimeout(500);
    expect(isXssAlertTriggered, 'Security flaw: Reflected XSS was executed by the browser.').toBe(false);
  });

});
