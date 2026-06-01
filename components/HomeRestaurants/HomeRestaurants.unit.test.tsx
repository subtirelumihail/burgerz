import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getRestaurants } from "@/lib/services/restaurant.service";
import { mockRestaurant } from "@/test/mock-restaurant";
import { DEFAULT_RESTAURANTS_PAGE_SIZE } from "@/types/restaurant";

import { HomeRestaurants } from "./HomeRestaurants";

vi.mock("@/hooks/useGeolocation", () => ({
  useGeolocation: vi.fn(() => ({
    coordinates: { latitude: 44.437, longitude: 26.097 },
    status: "granted",
    isLocationAvailable: true,
    needsLocationAccess: false,
    isLocationPending: false,
    requestLocation: vi.fn(),
  })),
}));

vi.mock("@/lib/services/restaurant.service", () => ({
  getRestaurants: vi.fn(),
}));

describe("HomeRestaurants", () => {
  beforeEach(() => {
    vi.mocked(getRestaurants).mockResolvedValue({
      restaurants: [mockRestaurant],
      pagination: {
        page: 1,
        pageSize: DEFAULT_RESTAURANTS_PAGE_SIZE,
        total: 1,
        totalPages: 1,
      },
    });
  });

  it("loads and displays restaurants", async () => {
    render(<HomeRestaurants />);

    await waitFor(() => {
      expect(
        screen.getByRole("link", {
          name: /smash shack\./i,
        }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("searchbox", { name: /search restaurants/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Sort by" }),
    ).toBeInTheDocument();
  });
});
