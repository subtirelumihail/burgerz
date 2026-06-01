import type { Locator, Page } from "@playwright/test";

export function getReviewsRegion(page: Page): Locator {
  return page.getByRole("region", { name: /customer reviews/i });
}

export function getReviewAuthor(reviewsRegion: Locator, name: string): Locator {
  return reviewsRegion.getByText(name, { exact: true });
}

export function getVisibleReviewText(
  reviewsRegion: Locator,
  text: string | RegExp,
): Locator {
  return reviewsRegion.locator('[class*="__text"]').getByText(text);
}
