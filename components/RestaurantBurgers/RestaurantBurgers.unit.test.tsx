import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getBurgers } from "@/lib/services/burger.service";
import { mockImageAsset } from "@/test/mock-image";
import type { Burger } from "@/types/burger";
import { DEFAULT_BURGERS_PAGE_SIZE } from "@/types/burger";

import { RestaurantBurgers } from "./RestaurantBurgers";

vi.mock("@/lib/services/burger.service", () => ({
  getBurgers: vi.fn(),
}));

const mockBurger: Burger = {
  id: "burger-1",
  title: "Smash Shack Classic",
  restaurant: { id: "restaurant-1", name: "Smash Shack" },
  image: mockImageAsset,
  reviewCount: 10,
  reviewScore: 4.5,
  scores: {
    taste: 4.5,
    texture: 4.5,
    visualPresentation: 4.5,
  },
};

describe("RestaurantBurgers", () => {
  beforeEach(() => {
    vi.mocked(getBurgers).mockResolvedValue({
      burgers: [mockBurger],
      pagination: {
        page: 1,
        pageSize: DEFAULT_BURGERS_PAGE_SIZE,
        total: 1,
        totalPages: 1,
      },
    });
  });

  it("loads restaurant burgers with return navigation on detail links", async () => {
    render(<RestaurantBurgers restaurantId="restaurant-1" />);

    await waitFor(() => {
      expect(
        screen.getByRole("link", {
          name: /smash shack classic, from smash shack/i,
        }),
      ).toHaveAttribute(
        "href",
        "/burgers/burger-1?from=%2Frestaurants%2Frestaurant-1",
      );
    });

    expect(
      screen.getByRole("region", { name: /burgers menu/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Smash Shack" }),
    ).not.toBeInTheDocument();
  });
});
