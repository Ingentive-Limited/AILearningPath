import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string = '/') {
    await this.page.goto(url);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  protected async waitForElement(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ timeout });
  }

  protected async clickElement(locator: Locator) {
    await this.waitForElement(locator);
    await locator.click();
  }

  protected async fillInput(locator: Locator, value: string) {
    await this.waitForElement(locator);
    await locator.fill(value);
  }

  protected async selectOption(locator: Locator, value: string) {
    await this.waitForElement(locator);
    await locator.selectOption(value);
  }

  protected async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return await locator.textContent() || '';
  }

  protected async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  protected async isEnabled(locator: Locator): Promise<boolean> {
    await this.waitForElement(locator);
    return await locator.isEnabled();
  }

  protected async getElementCount(locator: Locator): Promise<number> {
    return await locator.count();
  }
}