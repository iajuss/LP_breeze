import { expect, test } from "@playwright/test";

test("shows a coherent venue when the search filters match", async ({ page }) => {
  await page.goto("/buscar?activity=Festa&location=S%C3%A3o%20Paulo%2C%20Pinheiros&guests=80");

  await expect(page.getByRole("heading", { name: "1 espaço encontrado" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Casa Jardim Pinheiros" })).toBeVisible();
});

test("lets people refine discovery with a filter option", async ({ page }) => {
  await page.goto("/buscar");

  await page.getByRole("link", { name: "Casamento", exact: true }).click();

  await expect(page).toHaveURL(/activity=Casamento/);
  await expect(page.getByRole("heading", { name: "Casa Vila Mariana" })).toBeVisible();
});

test("accepts a manual guest count and a chosen date", async ({ page }) => {
  await page.goto("/buscar?activity=Festa");

  await page.getByLabel("Outra quantidade de pessoas").fill("100");
  await page.getByLabel("Data do evento").pressSequentially("20122026");
  await expect(page.getByLabel("Data do evento")).toHaveValue("20/12/2026");
  await page.getByLabel("Data do evento").press("Escape");
  await page.getByRole("button", { name: "Abrir calendário" }).click();
  await expect(page.getByRole("dialog", { name: "Calendário" })).toBeVisible();
  await page.getByLabel("Data do evento").press("Escape");
  await page.getByRole("button", { name: "Aplicar filtros" }).click();

  await expect(page).toHaveURL(/guests=100/);
  await expect(page).toHaveURL(/date=2026-12-20/);
  await expect(page.getByText("100", { exact: true })).toBeVisible();
  await expect(page.getByText("2026-12-20", { exact: true })).toBeVisible();
});
