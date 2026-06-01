import { describe, expect, it } from "vitest";

import { listRestaurants } from "./restaurant-store";

describe("restaurant-store", () => {
  it("sorts restaurants by name descending", () => {
    const response = listRestaurants({ sort: "name-desc", pageSize: 8 });

    expect(response.restaurants.map((restaurant) => restaurant.name)).toEqual([
      "Urban Grillhouse",
      "The Bun Stop",
      "Smash Shack",
      "Patty Palace",
      "Midnight Melt Bar",
      "Green Bite Co.",
      "Firehouse Burgers",
      "Coastal Burger Co.",
    ]);
  });
});
