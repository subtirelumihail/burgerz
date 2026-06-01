import type { Locator, Page } from "@playwright/test";

export function getBurgerHero(page: Page, title: RegExp): Locator {
  return page.locator("header").filter({
    has: page.getByRole("heading", { level: 1, name: title }),
  });
}
