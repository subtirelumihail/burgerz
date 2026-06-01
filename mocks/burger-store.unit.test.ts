import { describe, expect, it } from "vitest";

import { listBurgers } from "./burger-store";

describe("burger-store", () => {
  it("listBurgers filters burgers by restaurant id", () => {
    const response = listBurgers({ restaurantId: "restaurant-1" });

    expect(response.burgers.length).toBeGreaterThan(0);
    expect(
      response.burgers.every(
        (burger) => burger.restaurant.id === "restaurant-1",
      ),
    ).toBe(true);
    expect(response.pagination.total).toBe(3);
  });

  it("listBurgers returns empty results for unknown restaurant", () => {
    const response = listBurgers({ restaurantId: "missing-restaurant" });

    expect(response.burgers).toEqual([]);
    expect(response.pagination.total).toBe(0);
  });
});
