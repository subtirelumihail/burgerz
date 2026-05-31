import { expect, test } from "@playwright/test";

test("home page renders main content", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /to get started, edit the page\.tsx file\./i,
    }),
  ).toBeVisible();

  await expect(page.getByRole("link", { name: /deploy now/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /documentation/i }),
  ).toBeVisible();
});

test("documentation link opens Next.js docs", async ({ page }) => {
  await page.goto("/");

  const documentationLink = page.getByRole("link", { name: /documentation/i });
  await expect(documentationLink).toHaveAttribute("href", /nextjs\.org\/docs/);
});
