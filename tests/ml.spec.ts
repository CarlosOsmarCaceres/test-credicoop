import { test , expect } from '@playwright/test';

test('TC01: Prueba Mercado Ñib Lider ', async ({page}) => {
    await page.goto('https://www.mercadolibre.com.ar/');
    await page.locator('input[id="cb1-edit"]').fill('Samsung S24 Fe');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
    await expect(page.locator('//ol[contains(@class, \'ui-search-layout\')]')).toBeVisible();
    await page.waitForTimeout(3000);
    await page.pause();
    await page.waitForTimeout(3000);

});