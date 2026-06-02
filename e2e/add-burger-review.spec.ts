import { expect, type Page, test } from "@playwright/test";

import { getBurgerHero } from "./helpers/burger-hero";
import {
  getReviewAuthor,
  getReviewsRegion,
  getVisibleReviewText,
} from "./helpers/reviews";

const BURGER_DETAIL_PATH = "/burgers/burger-1";
const ADD_BURGER_REVIEW_PATH = "/burgers/burger-1/add-review";

function getAddBurgerReviewForm(page: Page) {
  return page.getByRole("form", { name: /add burger review/i });
}

test("add burger review page renders burger summary and form", async ({
  page,
}) => {
  await page.goto(ADD_BURGER_REVIEW_PATH);

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
    hero.getByText("Visual presentation", { exact: true }).first(),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { level: 2, name: /add your review/i }),
  ).toBeVisible();

  const form = getAddBurgerReviewForm(page);
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

test("burger detail add review link opens add burger review page", async ({
  page,
}) => {
  await page.goto(BURGER_DETAIL_PATH);

  await page.getByRole("link", { name: /add review/i }).click();

  await expect(page).toHaveURL(ADD_BURGER_REVIEW_PATH);
  await expect(
    page.getByRole("heading", { level: 2, name: /add your review/i }),
  ).toBeVisible({ timeout: 10000 });
});

test("back link returns to burger detail", async ({ page }) => {
  await page.goto(ADD_BURGER_REVIEW_PATH);

  await page.getByRole("link", { name: /back to burger/i }).click();

  await expect(page).toHaveURL(BURGER_DETAIL_PATH);
  await expect(
    page.getByRole("heading", { level: 1, name: /smash shack classic/i }),
  ).toBeVisible({ timeout: 10000 });
});

test("cancel returns to burger detail", async ({ page }) => {
  await page.goto(ADD_BURGER_REVIEW_PATH);

  await expect(getAddBurgerReviewForm(page)).toBeVisible({ timeout: 10000 });
  await getAddBurgerReviewForm(page)
    .getByRole("button", { name: /cancel/i })
    .click();

  await expect(page).toHaveURL(BURGER_DETAIL_PATH);
  await expect(
    page.getByRole("heading", { level: 1, name: /smash shack classic/i }),
  ).toBeVisible({ timeout: 10000 });
});

test("submit without required fields shows validation errors", async ({
  page,
}) => {
  await page.goto(ADD_BURGER_REVIEW_PATH);

  const form = getAddBurgerReviewForm(page);
  await expect(form).toBeVisible({ timeout: 10000 });

  await form.getByRole("button", { name: /submit review/i }).click();

  await expect(form.getByText("Your name is required.")).toBeVisible();
  await expect(form.getByText("Description is required.")).toBeVisible();
  await expect(page).toHaveURL(ADD_BURGER_REVIEW_PATH);
});

test("submitting a valid review returns to burger detail and shows the review", async ({
  page,
}) => {
  await page.goto(ADD_BURGER_REVIEW_PATH);

  const form = getAddBurgerReviewForm(page);
  await expect(form).toBeVisible({ timeout: 10000 });

  const reviewAuthor = "Playwright Tester";
  const reviewText = "Crispy edges, juicy center, and a bun that held up.";

  await page.getByRole("textbox", { name: /your name/i }).fill(reviewAuthor);
  await page.getByRole("textbox", { name: /description/i }).fill(reviewText);
  await page.getByRole("slider", { name: /taste/i }).fill("5");
  await form.getByRole("button", { name: /submit review/i }).click();

  await expect(page).toHaveURL(BURGER_DETAIL_PATH, { timeout: 10000 });
  await expect(
    page.getByRole("heading", { level: 1, name: /smash shack classic/i }),
  ).toBeVisible({ timeout: 10000 });

  const reviewsRegion = getReviewsRegion(page);
  await expect(getReviewAuthor(reviewsRegion, reviewAuthor)).toBeVisible({
    timeout: 10000,
  });
  await expect(getVisibleReviewText(reviewsRegion, reviewText)).toBeVisible();
});

test("unknown burger shows not found message", async ({ page }) => {
  await page.goto("/burgers/missing-burger/add-review");

  await expect(page.getByText("Burger not found")).toBeVisible({
    timeout: 10000,
  });
});
