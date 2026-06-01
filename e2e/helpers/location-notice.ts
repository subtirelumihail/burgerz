import type { Locator, Page } from "@playwright/test";

export function getLocationNoticeGroup(page: Page): Locator {
  return page.getByRole("group", {
    name: /location access is needed to sort restaurants by distance|location access is blocked for this site/i,
  });
}

export function getLocationNoticeAction(page: Page): Locator {
  return page.getByRole("button", { name: /enable location|try again/i });
}
