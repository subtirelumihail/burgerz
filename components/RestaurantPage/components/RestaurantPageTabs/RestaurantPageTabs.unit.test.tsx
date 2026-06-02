import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getBurgers } from "@/lib/services/burger.service";
import { getRestaurantReviews } from "@/lib/services/review.service";
import { DEFAULT_BURGERS_PAGE_SIZE } from "@/types/burger";
import { DEFAULT_REVIEWS_PAGE_SIZE } from "@/types/review";

import { RestaurantPageTabs } from "./RestaurantPageTabs";

vi.mock("@/lib/services/burger.service", () => ({
  getBurgers: vi.fn(),
}));

vi.mock("@/lib/services/review.service", () => ({
  getRestaurantReviews: vi.fn(),
}));

describe("RestaurantPageTabs", () => {
  it("renders reviews by default and burgers menu in the second tab", async () => {
    vi.mocked(getRestaurantReviews).mockResolvedValue({
      reviews: [],
      pagination: {
        page: 1,
        pageSize: DEFAULT_REVIEWS_PAGE_SIZE,
        total: 0,
        totalPages: 1,
      },
    });
    vi.mocked(getBurgers).mockResolvedValue({
      burgers: [],
      pagination: {
        page: 1,
        pageSize: DEFAULT_BURGERS_PAGE_SIZE,
        total: 0,
        totalPages: 1,
      },
    });

    render(<RestaurantPageTabs restaurantId="restaurant-1" />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 2, name: /customer reviews/i }),
      ).toBeInTheDocument();
    });

    expect(screen.getByRole("tab", { name: /reviews/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: /burgers menu/i })).toBeVisible();
  });
});
