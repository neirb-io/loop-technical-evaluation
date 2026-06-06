import { Page, Locator } from '@playwright/test';

export class BoardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToProject(projectName: string): Promise<void> {
    await this.page.locator('nav').getByRole('button', { name: projectName }).click();
  }

  getColumn(columnName: string): Locator {
    return this.page
      .locator('h2')
      .filter({ hasText: new RegExp(`^${columnName}`) })
      .locator('xpath=..');
  }

  getTaskCardInColumn(columnName: string, taskTitle: string): Locator {
    return this.getColumn(columnName)
      .getByRole('heading', {
        level: 3,
        name: taskTitle
      })
      .locator('xpath=..');
  }

  getTaskTags(taskCard: Locator): Locator {
    return taskCard.locator('div').filter({
      has: this.page.locator('span'),
      hasNot: this.page.locator('svg'),
    }).locator('span');
  }
}
