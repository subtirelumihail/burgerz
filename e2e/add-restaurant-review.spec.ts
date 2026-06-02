import { expect, type Page, test } from "@playwright/test";

import {
  getReviewAuthor,
  getReviewsRegion,
  getVisibleReviewText,
} from "./helpers/reviews";

const RESTAURANT_DETAIL_PATH = "/restaurants/restaurant-1";
const ADD_RESTAURANT_REVIEW_PATH = "/restaurants/restaurant-1/add-review";

function getAddRestaurantReviewForm(page: Page) {
  return page.getByRole("form", { name: /add restaurant review/i });
}

test("add restaurant review page renders restaurant summary and form", async ({
  page,
}) => {
  await page.goto(ADD_RESTAURANT_REVIEW_PATH);

  await expect(
    page.getByRole("heading", { level: 1, name: /smash shack/i }),
  ).toBeVisible({ timeout: 10000 });

  await expect(
    page.getByText("Strada Lipscani 25, Bucharest, Romania"),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { level: 2, name: /add your review/i }),
  ).toBeVisible();

  const form = getAddRestaurantReviewForm(page);
  await expect(page.getByRole("textbox", { name: /your name/i })).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: /description/i }),
  ).toBeVisible();
  await expect(form.getByRole("group", { name: /ratings/i })).toBeVisible();
  await expect(
    form.getByRole("button", { name: /submit review/i }),
  ).toBeVisible();
  await expect(form.getByRole("button", { name: /cancel/i })).toBeVisible();
});

test("restaurant detail add review link opens add review page", async ({
  page,
}) => {
  await page.goto(RESTAURANT_DETAIL_PATH);

  await page.getByRole("link", { name: /add review/i }).click();

  await expect(page).toHaveURL(ADD_RESTAURANT_REVIEW_PATH);
  await expect(
    page.getByRole("heading", { level: 2, name: /add your review/i }),
  ).toBeVisible({ timeout: 10000 });
});

test("back link returns to restaurant detail", async ({ page }) => {
  await page.goto(ADD_RESTAURANT_REVIEW_PATH);

  await page.getByRole("link", { name: /back to restaurant/i }).click();

  await expect(page).toHaveURL(RESTAURANT_DETAIL_PATH);
  await expect(
    page.getByRole("heading", { level: 1, name: /smash shack/i }),
  ).toBeVisible({ timeout: 10000 });
});

test("cancel returns to restaurant detail", async ({ page }) => {
  await page.goto(ADD_RESTAURANT_REVIEW_PATH);

  await expect(getAddRestaurantReviewForm(page)).toBeVisible({
    timeout: 10000,
  });
  await getAddRestaurantReviewForm(page)
    .getByRole("button", { name: /cancel/i })
    .click();

  await expect(page).toHaveURL(RESTAURANT_DETAIL_PATH);
  await expect(
    page.getByRole("heading", { level: 1, name: /smash shack/i }),
  ).toBeVisible({ timeout: 10000 });
});

test("submit without required fields shows validation errors", async ({
  page,
}) => {
  await page.goto(ADD_RESTAURANT_REVIEW_PATH);

  const form = getAddRestaurantReviewForm(page);
  await expect(form).toBeVisible({ timeout: 10000 });

  await form.getByRole("button", { name: /submit review/i }).click();

  await expect(form.getByText("Your name is required.")).toBeVisible();
  await expect(form.getByText("Description is required.")).toBeVisible();
  await expect(page).toHaveURL(ADD_RESTAURANT_REVIEW_PATH);
});

test("submitting a valid review returns to restaurant detail and shows the review", async ({
  page,
}) => {
  await page.goto(ADD_RESTAURANT_REVIEW_PATH);

  const form = getAddRestaurantReviewForm(page);
  await expect(form).toBeVisible({ timeout: 10000 });

  const reviewAuthor = "Playwright Restaurant Tester";
  const reviewText =
    "Welcoming staff, quick service, and burgers worth the trip.";

  await page.getByRole("textbox", { name: /your name/i }).fill(reviewAuthor);
  await page.getByRole("textbox", { name: /description/i }).fill(reviewText);
  await page.getByRole("slider", { name: /taste/i }).fill("5");
  await form.getByRole("button", { name: /submit review/i }).click();

  await expect(page).toHaveURL(RESTAURANT_DETAIL_PATH, { timeout: 10000 });
  await expect(
    page.getByRole("heading", { level: 1, name: /smash shack/i }),
  ).toBeVisible({ timeout: 10000 });

  const reviewsRegion = getReviewsRegion(page);
  await expect(getReviewAuthor(reviewsRegion, reviewAuthor)).toBeVisible({
    timeout: 10000,
  });
  await expect(getVisibleReviewText(reviewsRegion, reviewText)).toBeVisible();
});

test("unknown restaurant shows not found message", async ({ page }) => {
  await page.goto("/restaurants/missing-restaurant/add-review");

  await expect(page.getByText("Restaurant not found")).toBeVisible({
    timeout: 10000,
  });
});
