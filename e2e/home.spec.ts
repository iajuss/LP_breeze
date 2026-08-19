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
