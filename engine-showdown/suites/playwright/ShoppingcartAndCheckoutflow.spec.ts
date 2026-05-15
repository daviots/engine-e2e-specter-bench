import { test, expect } from '@playwright/test';

const TARGET_URL = "http://localhost:3000";

test.describe('Shopping Cart and Checkout Flow (Funcional & AppSec)', () => {

  test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        const bid = window.localStorage.getItem('bid');
        if (bid) window.sessionStorage.setItem('bid', bid);
      });
      await page.goto(TARGET_URL);
  });

  test('Add 3 products, edit quantity, fake address and finish purchase', async ({ page }) => {
  await page.getByText('search', { exact: true }).first().click();
  await page.locator('#mat-input-1').fill('Apple Juice');
  await page.locator('#mat-input-1').press('Enter');
  await page.locator('mat-card').filter({ hasText: 'Apple Juice' }).locator('button.btn-basket').click();
  await page.locator('simple-snack-bar').waitFor({ state: 'visible' });
  await page.getByText('X', { exact: true }).click().catch(() => {});

  await page.locator('#mat-input-1').fill('Banana Juice');
  await page.locator('#mat-input-1').press('Enter');
  await page.locator('mat-card').filter({ hasText: 'Banana Juice' }).locator('button.btn-basket').click();
  await page.locator('simple-snack-bar').waitFor({ state: 'visible' });
  await page.getByText('X', { exact: true }).click().catch(() => {});

  await page.locator('#mat-input-1').fill('Orange Juice');
  await page.locator('#mat-input-1').press('Enter');
  await page.locator('mat-card').filter({ hasText: 'Orange Juice' }).locator('button.btn-basket').click();
  await page.locator('simple-snack-bar').waitFor({ state: 'visible' });
  await page.getByText('X', { exact: true }).click().catch(() => {});
  await page.getByRole('button', { name: 'Show the shopping cart' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(1).click();
  await page.getByRole('button', { name: 'Checkout' }).click();

    //go to cart and edit quantity
    await page.getByRole('button', { name: 'Show the shopping cart' }).click()
    await page.waitForURL('**/basket');
    
    //add one more of the first item
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(1).click();
    
    //checkout
    await page.getByRole('button', { name: 'Checkout' }).click();
    
    //register fake address
    await page.getByRole('button', { name: 'Add a New Address' }).click();
    await page.getByPlaceholder('Please provide a country.').fill('Brasil');
    await page.getByPlaceholder('Please provide a name.').fill('teste testudo');
    await page.getByPlaceholder('Please provide a mobile number.').fill('1199999999');
    await page.getByPlaceholder('Please provide a ZIP code.').fill('01000-00');
    await page.getByPlaceholder('Please provide an address.').fill('Rua dos testes, 1337');
    await page.getByPlaceholder('Please provide a city.').fill('São Paulo');
    await page.locator('#submitButton').click();
    
    //select address and continue
    await page.locator('mat-radio-button').first().click();
    await page.getByLabel('Proceed to payment selection').click();
    
    //delivery Method
    await page.locator('mat-radio-button').first().click();
    await page.getByLabel('Proceed to delivery method selection').click();
    
    //add fake card
    await page.getByRole('button', { name: 'Add new card Add a credit or' }).click();
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('dada');
    await page.getByRole('spinbutton', { name: 'Card Number' }).click();
    await page.getByRole('spinbutton', { name: 'Card Number' }).fill('3131322222222222');
    await page.getByLabel('Expiry Month').selectOption('5');
    await page.getByLabel('Expiry Year').selectOption('2098');
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(2000);
    await page.locator('mat-radio-button').first().click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Proceed to review' }).click();
    await page.getByRole('button', { name: 'Complete your purchase' }).click();
    await expect(page.getByRole('heading', { name: 'Thank you for your purchase!' })).toBeVisible();
  });

  //im testing IDOR/BOLA that means Insecure Direct Object Reference/Broken Object Level Authorization, respectively(:
  test('AppSec: IDOR/BOLA - Interceptar "Add to Cart" e injetar item no carrinho de outro usuário', async ({ page }) => {
    let isVulnerable = false;

    await page.route('**/api/BasketItems*', async route => {
      const request = route.request();
      if (request.method() === 'POST') {
        const postData = JSON.parse(request.postData() || '{}');
        
        console.log(`intercept BasketId original: ${postData.BasketId}`);
        postData.BasketId = '1'; //admin shopping cart
        console.log(`Mutating to Target BasketId: 1`);
        
        const response = await route.fetch({
          postData: JSON.stringify(postData)
        });
        
        if (response.status() === 200) {
          isVulnerable = true;
        }

        await route.fulfill({ response });
      } else {
        await route.continue();
      }
    });

    await page.locator('mat-card').filter({ hasText: 'Apple Juice' }).locator('button.btn-basket').click();
    await page.locator('simple-snack-bar').waitFor({ state: 'visible' });
    
    expect(isVulnerable, 'Vulnerability IDOR/BOLA detected: API didnt validate Cart Authorization.').toBe(false);
    
  });
});