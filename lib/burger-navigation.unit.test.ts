import { describe, expect, it } from "vitest";

import {
  buildBurgerDetailPath,
  resolveBurgerBackNavigation,
} from "./burger-navigation";

describe("burger-navigation", () => {
  it("buildBurgerDetailPath returns base path without return target", () => {
    expect(buildBurgerDetailPath("burger-1")).toBe("/burgers/burger-1");
  });

  it("buildBurgerDetailPath appends a safe from query param", () => {
    expect(buildBurgerDetailPath("burger-1", "/restaurants/restaurant-1")).toBe(
      "/burgers/burger-1?from=%2Frestaurants%2Frestaurant-1",
    );
  });

  it("buildBurgerDetailPath ignores unsafe return targets", () => {
    expect(buildBurgerDetailPath("burger-1", "https://evil.test")).toBe(
      "/burgers/burger-1",
    );
  });

  it("resolveBurgerBackNavigation defaults to burger search", () => {
    expect(resolveBurgerBackNavigation(undefined)).toEqual({
      href: "/burgers",
      label: "Back to search",
    });
  });

  it("resolveBurgerBackNavigation returns restaurant back link", () => {
    expect(resolveBurgerBackNavigation("/restaurants/restaurant-1")).toEqual({
      href: "/restaurants/restaurant-1",
      label: "Back to restaurant",
    });
  });
});
