import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['list']
  ],
  use: {
    headless: false,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'MercadoLibre',
      testDir: './tests/mercado-libre',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://www.mercadolibre.com.ar/' },
    },
    {
      name: 'OrangeHRM',
      testDir: './tests/orange-hrm',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://opensource-demo.orangehrmlive.com/' },
    },
  ],
});
