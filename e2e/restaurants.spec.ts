import { expect, type Page, test } from "@playwright/test";

const RESTAURANTS_PATH = "/restaurants";
const BUCHAREST_GEO = { latitude: 44.437, longitude: 26.097 };

function getRestaurantSearchButton(page: Page) {
  return page
    .getByRole("region", { name: /search restaurants/i })
    .getByRole("button", { name: "Search", exact: true });
}

function getRestaurantResultsRegion(page: Page) {
  return page.getByRole("region", { name: /restaurant results/i });
}

async function expectRestaurantListLoaded(page: Page) {
  await expect(getRestaurantResultsRegion(page)).toBeVisible();
  await expect(
    getRestaurantResultsRegion(page).getByRole("heading", {
      level: 2,
      name: /smash shack/i,
    }),
  ).toBeVisible({ timeout: 10000 });
}

test.describe("restaurants page", () => {
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
    await expect(
      page.getByRole("region", { name: /sort restaurants/i }),
    ).toBeVisible();

    await expectRestaurantListLoaded(page);
    await expect(
      page.getByRole("link", { name: "Restaurants" }),
    ).toHaveAttribute("aria-current", "page");
  });

  test("shows distance when sorted by nearby with location access", async ({
    page,
  }) => {
    await page.goto(RESTAURANTS_PATH);

    await expectRestaurantListLoaded(page);
    await expect(
      getRestaurantResultsRegion(page)
        .getByText(/\d+ (m|km) away/)
        .first(),
    ).toBeVisible({
      timeout: 10000,
    });
  });

  test("list item navigates to restaurant detail on click", async ({
    page,
  }) => {
    await page.goto(RESTAURANTS_PATH);

    const restaurantLink = page
      .getByRole("link", { name: /^smash shack$/i })
      .first();
    await expect(restaurantLink).toBeVisible({ timeout: 10000 });
    await restaurantLink.click();

    await expect(page).toHaveURL("/restaurants/restaurant-1");
    await expect(
      page.getByRole("heading", { level: 1, name: /smash shack/i }),
    ).toBeVisible();
  });

  test("search filters restaurants by name", async ({ page }) => {
    await page.goto(RESTAURANTS_PATH);

    await expectRestaurantListLoaded(page);

    await page
      .getByRole("searchbox", { name: /search restaurants/i })
      .fill("coastal");
    await getRestaurantSearchButton(page).click();

    await expect(page).toHaveURL(RESTAURANTS_PATH);
    await expect(
      getRestaurantResultsRegion(page).getByRole("heading", {
        level: 2,
        name: /coastal burger co/i,
      }),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      getRestaurantResultsRegion(page).getByRole("heading", {
        level: 2,
        name: /smash shack/i,
      }),
    ).not.toBeVisible();
  });

  test("search filters restaurants by address", async ({ page }) => {
    await page.goto(RESTAURANTS_PATH);

    await expectRestaurantListLoaded(page);

    await page
      .getByRole("searchbox", { name: /search restaurants/i })
      .fill("lipscani");
    await getRestaurantSearchButton(page).click();

    await expect(
      getRestaurantResultsRegion(page).getByRole("heading", {
        level: 2,
        name: /smash shack/i,
      }),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      getRestaurantResultsRegion(page).getByRole("heading", {
        level: 2,
        name: /coastal burger co/i,
      }),
    ).not.toBeVisible();
  });

  test("clear search resets filtered results", async ({ page }) => {
    await page.goto(RESTAURANTS_PATH);

    await expectRestaurantListLoaded(page);

    await page
      .getByRole("searchbox", { name: /search restaurants/i })
      .fill("coastal");
    await getRestaurantSearchButton(page).click();

    await expect(
      getRestaurantResultsRegion(page).getByRole("heading", {
        level: 2,
        name: /coastal burger co/i,
      }),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      getRestaurantResultsRegion(page).getByRole("heading", {
        level: 2,
        name: /smash shack/i,
      }),
    ).not.toBeVisible();

    await page.getByRole("button", { name: /clear search/i }).click();

    await expect(
      page.getByRole("searchbox", { name: /search restaurants/i }),
    ).toHaveValue("");
    await expect(getRestaurantResultsRegion(page)).not.toHaveAttribute(
      "aria-busy",
      "true",
      { timeout: 10000 },
    );

    await page.getByRole("combobox", { name: "Sort by" }).selectOption("name");

    await expect(
      getRestaurantResultsRegion(page).getByRole("heading", {
        level: 2,
        name: /smash shack/i,
      }),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      getRestaurantResultsRegion(page).getByRole("heading", {
        level: 2,
        name: /coastal burger co/i,
      }),
    ).toBeVisible({ timeout: 10000 });
  });

  test("sorts restaurants by name A–Z", async ({ page }) => {
    await page.goto(RESTAURANTS_PATH);

    await expectRestaurantListLoaded(page);

    await page.getByRole("combobox", { name: "Sort by" }).selectOption("name");

    await expect(
      getRestaurantResultsRegion(page).getByRole("heading", {
        level: 2,
        name: /coastal burger co/i,
      }),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      getRestaurantResultsRegion(page).getByText(/\d+ (m|km) away/),
    ).not.toBeVisible();
  });

  test("sorts restaurants by name Z–A", async ({ page }) => {
    await page.goto(RESTAURANTS_PATH);

    await expectRestaurantListLoaded(page);

    await page
      .getByRole("combobox", { name: "Sort by" })
      .selectOption("name-desc");

    await expect(
      getRestaurantResultsRegion(page).getByRole("heading", {
        level: 2,
        name: /urban grillhouse/i,
      }),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      getRestaurantResultsRegion(page).getByRole("heading", {
        level: 2,
        name: /coastal burger co/i,
      }),
    ).not.toBeVisible();
  });

  test("pagination loads the next page of restaurants", async ({ page }) => {
    await page.goto(RESTAURANTS_PATH);

    await expectRestaurantListLoaded(page);

    await page.getByRole("combobox", { name: "Sort by" }).selectOption("name");

    await expect(
      getRestaurantResultsRegion(page).getByRole("heading", {
        level: 2,
        name: /coastal burger co/i,
      }),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      getRestaurantResultsRegion(page).getByRole("heading", {
        level: 2,
        name: /urban grillhouse/i,
      }),
    ).not.toBeVisible();

    await page.getByRole("button", { name: /go to page 2/i }).click();

    await expect(
      getRestaurantResultsRegion(page).getByRole("heading", {
        level: 2,
        name: /urban grillhouse/i,
      }),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      getRestaurantResultsRegion(page).getByRole("heading", {
        level: 2,
        name: /coastal burger co/i,
      }),
    ).not.toBeVisible();
  });

  test("header link navigates from burgers to restaurants", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Restaurants" }).click();

    await expect(page).toHaveURL(RESTAURANTS_PATH);
    await expect(
      page.getByRole("heading", { level: 1, name: /find your next spot/i }),
    ).toBeVisible();
  });
});

test.describe("restaurants page without location access", () => {
  test("shows enable location notice and falls back to name sort", async ({
    page,
    context,
  }) => {
    await context.clearPermissions();
    await page.goto(RESTAURANTS_PATH);

    await expect(
      page.getByRole("button", { name: "Enable location" }),
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("combobox", { name: "Sort by" })).toHaveValue(
      "name",
    );
    await expect(
      getRestaurantResultsRegion(page).getByRole("heading", {
        level: 2,
        name: /coastal burger co/i,
      }),
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("option", { name: "Near By" })).toBeDisabled();
  });
});
