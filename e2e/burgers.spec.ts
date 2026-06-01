import { expect, type Page, test } from "@playwright/test";

const BURGERS_PATH = "/burgers";

function getBurgerResultsRegion(page: Page) {
  return page.getByRole("region", { name: /burger results/i });
}

function getBurgerListLink(page: Page, name: RegExp) {
  return getBurgerResultsRegion(page).getByRole("link", { name });
}

function getBurgerSearchButton(page: Page) {
  return page
    .getByRole("region", { name: /search burgers/i })
    .getByRole("button", { name: "Search", exact: true });
}

test("burgers page renders burger search and list", async ({ page }) => {
  await page.goto(BURGERS_PATH);

  await expect(
    page.getByRole("heading", { level: 1, name: /find your next burger/i }),
  ).toBeVisible();

  await expect(
    page.getByRole("searchbox", { name: /search burgers/i }),
  ).toBeVisible();
  await expect(getBurgerSearchButton(page)).toBeVisible();
  await expect(getBurgerResultsRegion(page)).toBeVisible();
  await expect(
    getBurgerListLink(page, /smash shack classic, from smash shack\./i),
  ).toBeVisible({ timeout: 10000 });
  await expect(
    page.getByRole("link", { name: "Burgers", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});

test("list item navigates to burger detail on click", async ({ page }) => {
  await page.goto(BURGERS_PATH);

  const burgerLink = getBurgerListLink(
    page,
    /smash shack classic, from smash shack\./i,
  ).first();
  await expect(burgerLink).toBeVisible({ timeout: 10000 });
  await burgerLink.click();

  await expect(page).toHaveURL("/burgers/burger-1");
  await expect(
    page.getByRole("heading", { level: 1, name: /smash shack classic/i }),
  ).toBeVisible();
});

test("list item navigates to burger detail on enter", async ({ page }) => {
  await page.goto(BURGERS_PATH);

  const burgerLink = getBurgerListLink(page, /garden stack, from/i).first();
  await expect(burgerLink).toBeVisible({ timeout: 10000 });
  await burgerLink.focus();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL("/burgers/burger-3");
});

test("search filters burgers by query without reloading", async ({ page }) => {
  await page.goto(BURGERS_PATH);

  await expect(
    getBurgerListLink(page, /smash shack classic, from smash shack\./i),
  ).toBeVisible({ timeout: 10000 });

  await page.getByRole("searchbox", { name: /search burgers/i }).fill("garden");
  await getBurgerSearchButton(page).click();

  await expect(page).toHaveURL(BURGERS_PATH);
  await expect(getBurgerListLink(page, /garden stack, from/i)).toBeVisible({
    timeout: 10000,
  });
  await expect(
    getBurgerListLink(page, /smash shack classic, from smash shack\./i),
  ).not.toBeVisible();
});

test("clear search resets filtered results", async ({ page }) => {
  await page.goto(BURGERS_PATH);

  await expect(
    getBurgerListLink(page, /smash shack classic, from smash shack\./i),
  ).toBeVisible({ timeout: 10000 });

  await page.getByRole("searchbox", { name: /search burgers/i }).fill("garden");
  await getBurgerSearchButton(page).click();

  await expect(getBurgerListLink(page, /garden stack, from/i)).toBeVisible({
    timeout: 10000,
  });
  await expect(
    getBurgerListLink(page, /smash shack classic, from smash shack\./i),
  ).not.toBeVisible();

  await page.getByRole("button", { name: /clear search/i }).click();

  await expect(
    page.getByRole("searchbox", { name: /search burgers/i }),
  ).toHaveValue("");
  await expect(getBurgerResultsRegion(page)).not.toHaveAttribute(
    "aria-busy",
    "true",
    { timeout: 10000 },
  );
  await expect(
    getBurgerListLink(page, /smash shack classic, from smash shack\./i),
  ).toBeVisible({ timeout: 10000 });
  await expect(getBurgerListLink(page, /garden stack, from/i)).toBeVisible({
    timeout: 10000,
  });
});

test("pagination loads the next page of burgers", async ({ page }) => {
  await page.goto(BURGERS_PATH);

  await expect(
    getBurgerListLink(page, /smash shack classic, from smash shack\./i),
  ).toBeVisible({ timeout: 10000 });
  await expect(
    getBurgerListLink(page, /patty palace original, from/i),
  ).not.toBeVisible();

  await page.getByRole("button", { name: /go to page 2/i }).click();

  await expect(
    getBurgerListLink(page, /patty palace original, from/i),
  ).toBeVisible({ timeout: 10000 });
  await expect(
    getBurgerListLink(page, /smash shack classic, from smash shack\./i),
  ).not.toBeVisible();
});
