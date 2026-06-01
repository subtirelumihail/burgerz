import { expect, type Page, test } from "@playwright/test";

function getBurgerSearchButton(page: Page) {
  return page
    .getByRole("region", { name: /search burgers/i })
    .getByRole("button", { name: "Search", exact: true });
}

test("home page renders burger search and list", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: /find your next burger/i }),
  ).toBeVisible();

  await expect(
    page.getByRole("searchbox", { name: /search burgers/i }),
  ).toBeVisible();
  await expect(getBurgerSearchButton(page)).toBeVisible();
  await expect(
    page.getByRole("region", { name: /burger results/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /smash shack classic/i }),
  ).toBeVisible({ timeout: 10000 });
  await expect(
    page.getByRole("link", { name: /^smash shack$/i }),
  ).toBeVisible();
});

test("list item navigates to burger detail on click", async ({ page }) => {
  await page.goto("/");

  const burgerLink = page
    .getByRole("link", { name: /smash shack classic/i })
    .first();
  await expect(burgerLink).toBeVisible({ timeout: 10000 });
  await burgerLink.click();

  await expect(page).toHaveURL("/burgers/burger-1");
  await expect(
    page.getByRole("heading", { level: 1, name: /smash shack classic/i }),
  ).toBeVisible();
});

test("list item navigates to burger detail on enter", async ({ page }) => {
  await page.goto("/");

  const burgerLink = page.getByRole("link", { name: /garden stack/i }).first();
  await expect(burgerLink).toBeVisible({ timeout: 10000 });
  await burgerLink.focus();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL("/burgers/burger-3");
});

test("restaurant link opens restaurant page", async ({ page }) => {
  await page.goto("/");

  const restaurantLink = page.getByRole("link", { name: /^smash shack$/i });
  await expect(restaurantLink).toBeVisible({ timeout: 10000 });
  await restaurantLink.click();

  await expect(page).toHaveURL("/restaurants/restaurant-1");
  await expect(
    page.getByRole("heading", { level: 1, name: /smash shack/i }),
  ).toBeVisible();
});

test("search filters burgers by query without reloading", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 2, name: /smash shack classic/i }),
  ).toBeVisible({ timeout: 10000 });

  await page.getByRole("searchbox", { name: /search burgers/i }).fill("garden");
  await getBurgerSearchButton(page).click();

  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("heading", { level: 2, name: /garden stack/i }),
  ).toBeVisible({
    timeout: 10000,
  });
  await expect(
    page.getByRole("heading", { level: 2, name: /smash shack classic/i }),
  ).not.toBeVisible();
});

test("clear search resets filtered results", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 2, name: /smash shack classic/i }),
  ).toBeVisible({ timeout: 10000 });

  await page.getByRole("searchbox", { name: /search burgers/i }).fill("garden");
  await getBurgerSearchButton(page).click();

  await expect(
    page.getByRole("heading", { level: 2, name: /garden stack/i }),
  ).toBeVisible({ timeout: 10000 });
  await expect(
    page.getByRole("heading", { level: 2, name: /smash shack classic/i }),
  ).not.toBeVisible();

  await page.getByRole("button", { name: /clear search/i }).click();

  await expect(
    page.getByRole("searchbox", { name: /search burgers/i }),
  ).toHaveValue("");
  await expect(
    page.getByRole("region", { name: /burger results/i }),
  ).not.toHaveAttribute("aria-busy", "true", { timeout: 10000 });
  await expect(
    page.getByRole("heading", { level: 2, name: /smash shack classic/i }),
  ).toBeVisible({ timeout: 10000 });
  await expect(
    page.getByRole("heading", { level: 2, name: /garden stack/i }),
  ).toBeVisible({ timeout: 10000 });
});

test("pagination loads the next page of burgers", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 2, name: /smash shack classic/i }),
  ).toBeVisible({ timeout: 10000 });
  await expect(
    page.getByRole("heading", { level: 2, name: /patty palace original/i }),
  ).not.toBeVisible();

  await page.getByRole("button", { name: /go to page 2/i }).click();

  await expect(
    page.getByRole("heading", { level: 2, name: /patty palace original/i }),
  ).toBeVisible({ timeout: 10000 });
  await expect(
    page.getByRole("heading", { level: 2, name: /smash shack classic/i }),
  ).not.toBeVisible();
});
