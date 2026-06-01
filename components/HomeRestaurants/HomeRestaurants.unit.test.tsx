import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getRestaurants } from "@/lib/services/restaurant.service";
import { mockImageAsset } from "@/test/mock-image";
import type { Restaurant } from "@/types/restaurant";
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

const mockRestaurant: Restaurant = {
  id: "restaurant-1",
  name: "Smash Shack",
  image: mockImageAsset,
  location: {
    address: "Strada Lipscani 25, Bucharest, Romania",
    coordinates: { latitude: 44.4319, longitude: 26.1027 },
  },
  openingHours: [{ days: "Mon – Fri", hours: "11:00 – 22:00" }],
};

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
        screen.getByRole("heading", { level: 2, name: "Smash Shack" }),
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
