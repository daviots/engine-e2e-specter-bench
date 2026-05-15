import { test as setup, expect } from '@playwright/test';
const authFile = '.auth/user.json';

setup('authenticate and save state', async ({ page }) => {
  const TARGET_URL = 'http://localhost:3000';
  
  await page.goto(TARGET_URL);

  await page.getByRole('button', { name: 'Close Welcome Banner' }).click({ timeout: 2000 }).catch(() => {});
  await page.getByRole('button', { name: 'dismiss cookie message' }).click({ timeout: 2000 }).catch(() => {});

    await page.getByRole('button', { name: 'Show/hide account menu' }).click();
  await page.getByRole('menuitem', { name: 'Go to login page' }).click();
  await page.locator('#newCustomerLink').click();
  await page.locator('.mat-mdc-text-field-wrapper.mdc-text-field.mdc-text-field--outlined > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix').first().click();
  await page.getByRole('textbox', { name: 'Email address field' }).fill('emailfake@gmail.com');
  await page.locator('.mat-mdc-form-field.mat-mdc-form-field-type-mat-input.mat-form-field-appearance-outline.mat-form-field-hide-placeholder > .mat-mdc-text-field-wrapper > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix').first().click();
  await page.getByRole('textbox', { name: 'Field for the password' }).fill('EmailFake123');
  await page.locator('.mat-mdc-form-field.mat-mdc-form-field-type-mat-input.mat-form-field-appearance-outline.mat-form-field-hide-placeholder > .mat-mdc-text-field-wrapper > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix').first().click();
  await page.getByRole('textbox', { name: 'Field to confirm the password' }).fill('EmailFake123');
  await page.locator('.mat-mdc-form-field.mat-mdc-form-field-type-mat-select > .mat-mdc-text-field-wrapper > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix').click();
  await page.getByRole('option', { name: 'Your eldest siblings middle' }).click();
  await page.locator('.mat-mdc-form-field.mat-mdc-form-field-type-mat-input.mat-form-field-appearance-outline.mat-form-field-hide-placeholder > .mat-mdc-text-field-wrapper > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix').click();
  await page.getByRole('textbox', { name: 'Field for the answer to the' }).fill('d');
  await page.getByRole('button', { name: 'Button to complete the' }).click();
  await page.waitForTimeout(2000)

  if(await page.getByText('Email must be unique').isVisible()){
    await page.getByRole('link', { name: 'Already a customer?' }).click();
    await page.locator('#email').fill('emailfake@gmail.com');
    await page.locator('#password').fill('EmailFake123');
    await page.locator('#loginButton').click();
  } else {
    await page.waitForTimeout(2000)
    await page.getByText('Registration completed').click();
    await page.locator('#email').fill('emailfake@gmail.com');
    await page.locator('#password').fill('EmailFake123');
    await page.locator('#loginButton').click();
  }

  await page.waitForURL('**/search');

  await page.locator('#navbarAccount').click();
  await expect(page.locator('button[aria-label="Go to user profile"]')).toBeVisible();

  await page.evaluate(() => {
    const bid = sessionStorage.getItem('bid');
    if (bid) localStorage.setItem('bid', bid);
  });

  await page.context().storageState({ path: authFile });
});
