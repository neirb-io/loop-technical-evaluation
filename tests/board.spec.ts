import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { BoardPage } from './pages/BoardPage';
import testData from './data/testData.json';

type TestCase = {
  project: string;
  task: string;
  column: string;
  tags: string[];
};

test.describe('Board task verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testData.url);
    const loginPage = new LoginPage(page);
    await loginPage.login(testData.credentials.username, testData.credentials.password);
  });

  for (const { project, task, column, tags } of testData.testCases as TestCase[]) {
    test(`[${project}] "${task}" is in "${column}" with tags: ${tags.join(', ')}`, async ({ page }) => {
      const boardPage = new BoardPage(page);
      await boardPage.navigateToProject(project);

      const taskCard = boardPage.getTaskCardInColumn(column, task);
      await expect(taskCard).toBeVisible();

      const taskTags = boardPage.getTaskTags(taskCard);
      await expect(taskTags).toContainText(tags);
    });
  }
});
