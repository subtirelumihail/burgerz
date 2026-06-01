import { expect, type Page, test } from "@playwright/test";

const RESTAURANTS_PATH = "/";
const BUCHAREST_GEO = { latitude: 44.437, longitude: 26.097 };

function getRestaurantSearchButton(page: Page) {
  return page
    .getByRole("region", { name: /search restaurants/i })
    .getByRole("button", { name: "Search", exact: true });
}

function getRestaurantResultsRegion(page: Page) {
  return page.getByRole("region", { name: /restaurant results/i });
}

function getRestaurantListLink(page: Page, name: RegExp) {
  return getRestaurantResultsRegion(page).getByRole("link", { name });
}

async function expectRestaurantListLoaded(page: Page) {
  await expect(getRestaurantResultsRegion(page)).toBeVisible();
  await expect(getRestaurantListLink(page, /^smash shack\./i)).toBeVisible({
    timeout: 10000,
  });
}

test.describe("home page (restaurants)", () => {
  test.beforeEach(async ({ context }) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation(BUCHAREST_GEO);
  });

  test("renders restaurant search, sort, and list", async ({ page }) => {
    await page.goto(RESTAURANTS_PATH);

    await expect(
      page.getByRole("heading", { level: 1, name: /find your next spot/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("searchbox", { name: /search restaurants/i }),
    ).toBeVisible();
    await expect(getRestaurantSearchButton(page)).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Sort by" })).toBeVisible();

    await expectRestaurantListLoaded(page);
    await expect(
      page.getByRole("link", { name: "Restaurants" }),
    ).toHaveAttribute("aria-current", "page");
  });

  test("list item navigates to restaurant detail on click", async ({
    page,
  }) => {
    await page.goto(RESTAURANTS_PATH);

    const restaurantLink = getRestaurantListLink(page, /^smash shack\./i);
    await expect(restaurantLink).toBeVisible({ timeout: 10000 });
    await restaurantLink.click();

    await expect(page).toHaveURL("/restaurants/restaurant-1");
    await expect(
      page.getByRole("heading", { level: 1, name: /smash shack/i }),
    ).toBeVisible();
  });
});
