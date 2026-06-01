import { expect, type Page, test } from "@playwright/test";

import { getBurgerHero } from "./helpers/burger-hero";
import {
  getReviewAuthor,
  getReviewsRegion,
  getVisibleReviewText,
} from "./helpers/reviews";

const BURGER_DETAIL_PATH = "/burgers/burger-1";
const BURGER_WITHOUT_REVIEWS_PATH = "/burgers/burger-19";

function getReviewSearchButton(page: Page) {
  return page
    .getByRole("region", { name: /search reviews/i })
    .getByRole("button", { name: "Search", exact: true });
}

test("burger detail page renders hero and reviews", async ({ page }) => {
  await page.goto(BURGER_DETAIL_PATH);

  await expect(
    page.getByRole("heading", { level: 1, name: /smash shack classic/i }),
  ).toBeVisible({ timeout: 10000 });

  await expect(
    page.getByRole("link", { name: /^smash shack$/i }),
  ).toHaveAttribute("href", "/restaurants/restaurant-1");

  const hero = getBurgerHero(page, /smash shack classic/i);
  await expect(hero.getByText("(128 reviews)")).toBeVisible();
  await expect(hero.getByText("Taste", { exact: true }).first()).toBeVisible();
  await expect(
    hero.getByText("Texture", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    hero.getByText("Visual presentation", { exact: true }).first(),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { level: 2, name: /customer reviews/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("searchbox", { name: /search reviews/i }),
  ).toBeVisible();
  await expect(getReviewSearchButton(page)).toBeVisible();

  const reviewsRegion = getReviewsRegion(page);
  await expect(getReviewAuthor(reviewsRegion, "Alex Rivera")).toBeVisible({
    timeout: 10000,
  });
  await expect(
    getVisibleReviewText(reviewsRegion, /perfect smash crust with juicy beef/i),
  ).toBeVisible();
});

test("back link returns to home search", async ({ page }) => {
  await page.goto(BURGER_DETAIL_PATH);

  await page.getByRole("link", { name: /back to search/i }).click();

  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("heading", { level: 1, name: /find your next burger/i }),
  ).toBeVisible();
});

test("restaurant link opens restaurant page", async ({ page }) => {
  await page.goto(BURGER_DETAIL_PATH);

  await page.getByRole("link", { name: /^smash shack$/i }).click();

  await expect(page).toHaveURL("/restaurants/restaurant-1");
  await expect(
    page.getByRole("heading", { level: 1, name: /smash shack/i }),
  ).toBeVisible();
});

test("search filters reviews by reviewer name", async ({ page }) => {
  await page.goto(BURGER_DETAIL_PATH);

  const reviewsRegion = getReviewsRegion(page);
  await expect(getReviewAuthor(reviewsRegion, "Alex Rivera")).toBeVisible({
    timeout: 10000,
  });
  await expect(getReviewAuthor(reviewsRegion, "Jordan Kim")).toBeVisible();

  await page.getByRole("searchbox", { name: /search reviews/i }).fill("Alex");
  await getReviewSearchButton(page).click();

  await expect(getReviewAuthor(reviewsRegion, "Alex Rivera")).toBeVisible({
    timeout: 10000,
  });
  await expect(getReviewAuthor(reviewsRegion, "Jordan Kim")).not.toBeVisible();
});

test("search with no matches shows empty state", async ({ page }) => {
  await page.goto(BURGER_DETAIL_PATH);

  await expect(
    getReviewAuthor(getReviewsRegion(page), "Alex Rivera"),
  ).toBeVisible({ timeout: 10000 });

  await page
    .getByRole("searchbox", { name: /search reviews/i })
    .fill("zzznomatch");
  await getReviewSearchButton(page).click();

  await expect(page.getByText("No reviews match your search.")).toBeVisible({
    timeout: 10000,
  });
});

test("clear search restores all reviews", async ({ page }) => {
  await page.goto(BURGER_DETAIL_PATH);

  const reviewsRegion = getReviewsRegion(page);
  await expect(getReviewAuthor(reviewsRegion, "Jordan Kim")).toBeVisible({
    timeout: 10000,
  });

  await page.getByRole("searchbox", { name: /search reviews/i }).fill("Alex");
  await getReviewSearchButton(page).click();

  await expect(getReviewAuthor(reviewsRegion, "Jordan Kim")).not.toBeVisible({
    timeout: 10000,
  });

  await page.getByRole("button", { name: /clear search/i }).click();

  await expect(
    page.getByRole("searchbox", { name: /search reviews/i }),
  ).toHaveValue("");
  await expect(getReviewAuthor(reviewsRegion, "Jordan Kim")).toBeVisible({
    timeout: 10000,
  });
});

test("review pagination loads the next page", async ({ page }) => {
  await page.goto(BURGER_DETAIL_PATH);

  const reviewsRegion = getReviewsRegion(page);
  await expect(getReviewAuthor(reviewsRegion, "Alex Rivera")).toBeVisible({
    timeout: 10000,
  });
  await expect(getReviewAuthor(reviewsRegion, "Morgan Lee")).not.toBeVisible();

  await page.getByRole("button", { name: /go to page 2/i }).click();

  await expect(getReviewAuthor(reviewsRegion, "Morgan Lee")).toBeVisible({
    timeout: 10000,
  });
  await expect(getReviewAuthor(reviewsRegion, "Alex Rivera")).not.toBeVisible();
});

test("burger with no reviews shows empty reviews state", async ({ page }) => {
  await page.goto(BURGER_WITHOUT_REVIEWS_PATH);

  await expect(
    page.getByRole("heading", { level: 1, name: /first day special/i }),
  ).toBeVisible({ timeout: 10000 });

  const hero = getBurgerHero(page, /first day special/i);
  await expect(hero.getByText("(0 reviews)")).toBeVisible();
  await expect(hero.getByText("0", { exact: true }).first()).toBeVisible();

  await expect(page.getByRole("link", { name: /add review/i })).toHaveAttribute(
    "href",
    "/burgers/burger-19/add-review",
  );
  await expect(
    getReviewsRegion(page).getByText("No reviews match your search."),
  ).toBeVisible();
});

test("unknown burger shows not found message", async ({ page }) => {
  await page.goto("/burgers/missing-burger");

  await expect(page.getByText("Burger not found")).toBeVisible({
    timeout: 10000,
  });
});
