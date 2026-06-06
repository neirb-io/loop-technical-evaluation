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

type TestData = {
  url: string;
  credentials: {
    username: string;
    password: string;
  };
  testCases: TestCase[];
};

test.describe('Board task verification', () => {
  const data: TestData = testData;
  test.beforeEach(async ({ page }) => {
    await page.goto(data.url);
    const loginPage = new LoginPage(page);
    await loginPage.login(data.credentials.username, data.credentials.password);
  });

  for (const { project, task, column, tags } of data.testCases as TestCase[]) {
    test(`[${project}] "${task}" is in "${column}" with tags: ${tags.join(', ')}`, async ({ page }) => {
      const boardPage = new BoardPage(page);

      await test.step(`Navigate to project: ${project}`, async () => {
        await boardPage.navigateToProject(project);
      });

      const taskCard = await test.step(`Verify "${task}" is in "${column}" column`, async () => {
        const card = boardPage.getTaskCardInColumn(column, task);
        await expect(card).toBeVisible();
        return card;
      });

      await test.step(`Verify tags: ${tags.join(', ')}`, async () => {
        const taskTags = boardPage.getTaskTags(taskCard);
        await expect(taskTags).toHaveCount(tags.length);
        await expect(taskTags).toHaveText(tags);
      });
    });
  }
});
