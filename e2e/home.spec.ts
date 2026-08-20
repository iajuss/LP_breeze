import { expect, test } from "@playwright/test";

test("renders Breeze’s primary destination", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /onde boas ideias ganham cenário/i,
    }),
  ).toBeVisible();
});

test("uses the viewport without horizontal overflow", async ({ page }) => {
  await page.goto("/");

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});

test("keeps desktop sections at least as tall as the viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "This is a desktop-only layout constraint.");
  await page.goto("/");

  const dimensions = await page.evaluate(() => ({
    viewportHeight: window.innerHeight,
    sections: Array.from(document.querySelectorAll("main > section")).map((section) => section.getBoundingClientRect().height),
  }));

  expect(dimensions.sections.every((height) => height >= dimensions.viewportHeight)).toBe(true);
});
