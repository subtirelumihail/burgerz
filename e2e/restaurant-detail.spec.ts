import { expect, test } from "@playwright/test";

const RESTAURANT_DETAIL_PATH = "/restaurants/restaurant-1";

test("restaurant detail page renders hero content", async ({ page }) => {
  await page.goto(RESTAURANT_DETAIL_PATH);

  await expect(
    page.getByRole("heading", { level: 1, name: /smash shack/i }),
  ).toBeVisible({ timeout: 10000 });

  await expect(
    page.getByText("Strada Lipscani 25, Bucharest, Romania"),
  ).toBeVisible();

  const hero = page.locator("header").filter({
    has: page.getByRole("heading", { level: 1, name: /smash shack/i }),
  });
  await expect(
    hero.getByRole("heading", { level: 2, name: /opening times/i }),
  ).toBeVisible();
  await expect(hero.getByText("Mon – Fri")).toBeVisible();
  await expect(hero.getByText("11:00 – 22:00")).toBeVisible();
  await expect(
    hero.getByRole("button", { name: /view full size: smash shack/i }),
  ).toBeVisible();
  await expect(hero.getByRole("img", { name: "Smash Shack" })).toBeVisible();
});

test("restaurant detail page lists burgers for the restaurant", async ({
  page,
}) => {
  await page.goto(RESTAURANT_DETAIL_PATH);

  await expect(
    page.getByRole("heading", { level: 2, name: /burgers/i }),
  ).toBeVisible({ timeout: 10000 });

  const burgersRegion = page.getByRole("region", { name: /burger results/i });
  await expect(
    burgersRegion.getByRole("link", {
      name: /smash shack classic, from smash shack/i,
    }),
  ).toBeVisible();
  await expect(
    burgersRegion.getByRole("link", { name: /^smash shack$/i }),
  ).not.toBeVisible();
});

test("burger link opens detail with back to restaurant", async ({ page }) => {
  await page.goto(RESTAURANT_DETAIL_PATH);

  const burgersRegion = page.getByRole("region", { name: /burger results/i });
  await burgersRegion
    .getByRole("link", {
      name: /smash shack classic, from smash shack/i,
    })
    .click();

  await expect(page).toHaveURL(
    "/burgers/burger-1?from=%2Frestaurants%2Frestaurant-1",
  );
  await expect(
    page.getByRole("heading", { level: 1, name: /smash shack classic/i }),
  ).toBeVisible({ timeout: 10000 });

  await page.getByRole("link", { name: /back to restaurant/i }).click();

  await expect(page).toHaveURL(RESTAURANT_DETAIL_PATH);
  await expect(
    page.getByRole("heading", { level: 1, name: /smash shack/i }),
  ).toBeVisible();
});

test("back link returns to restaurants search", async ({ page }) => {
  await page.goto(RESTAURANT_DETAIL_PATH);

  await page.getByRole("link", { name: /back to restaurants/i }).click();

  await expect(page).toHaveURL("/restaurants");
  await expect(
    page.getByRole("heading", { level: 1, name: /find your next spot/i }),
  ).toBeVisible();
});

test("unknown restaurant shows not found message", async ({ page }) => {
  await page.goto("/restaurants/missing-restaurant");

  await expect(page.getByText("Restaurant not found")).toBeVisible({
    timeout: 10000,
  });
  await expect(
    page.getByRole("link", { name: /back to restaurants/i }),
  ).toHaveAttribute("href", "/restaurants");
});
