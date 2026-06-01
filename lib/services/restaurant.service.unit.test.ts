import { describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/client";

import { getRestaurants } from "./restaurant.service";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe("restaurant.service", () => {
  it("getRestaurants calls the list endpoint without params", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      restaurants: [],
      pagination: { page: 1, pageSize: 6, total: 0, totalPages: 1 },
    });

    await getRestaurants();

    expect(apiClient.get).toHaveBeenCalledWith("/api/restaurants");
  });

  it("getRestaurants builds query params for search, sort, and location", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      restaurants: [],
      pagination: { page: 1, pageSize: 6, total: 0, totalPages: 1 },
    });

    await getRestaurants({
      q: "smash",
      page: 2,
      pageSize: 6,
      sort: "nearby",
      latitude: 44.437,
      longitude: 26.097,
    });

    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/restaurants?q=smash&page=2&pageSize=6&sort=nearby&latitude=44.437&longitude=26.097",
    );
  });
});
