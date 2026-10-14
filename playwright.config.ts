import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 120_000,
  fullyParallel: false,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:3100', trace: 'off' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, grepInvert: /@mobile/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, grep: /@mobile/ },
  ],
  webServer: { command: 'npx next start -p 3100', url: 'http://localhost:3100', reuseExistingServer: true, timeout: 120_000 },
})
