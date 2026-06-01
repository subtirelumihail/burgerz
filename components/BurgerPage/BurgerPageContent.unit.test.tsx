import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getBurger } from "@/lib/services/burger.service";
import { getBurgerReviews } from "@/lib/services/review.service";
import { mockImageAsset } from "@/test/mock-image";
import type { Burger } from "@/types/burger";
import type { BurgerUserReview } from "@/types/review";
import { DEFAULT_REVIEWS_PAGE_SIZE } from "@/types/review";

import { BurgerPageContent } from "./BurgerPageContent";

vi.mock("@/lib/services/burger.service", () => ({
  getBurger: vi.fn(),
}));

vi.mock("@/lib/services/review.service", () => ({
  getBurgerReviews: vi.fn(),
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

const mockReview: BurgerUserReview = {
  id: "review-1",
  burgerId: "burger-1",
  authorName: "Alex Rivera",
  text: "Perfect smash crust with juicy beef.",
  score: 4.5,
  createdAt: "2025-12-01T12:00:00.000Z",
};

describe("BurgerPageContent", () => {
  beforeEach(() => {
    vi.mocked(getBurger).mockResolvedValue(mockBurger);
    vi.mocked(getBurgerReviews).mockResolvedValue({
      reviews: [mockReview],
      pagination: {
        page: 1,
        pageSize: DEFAULT_REVIEWS_PAGE_SIZE,
        total: 1,
        totalPages: 1,
      },
    });
  });

  it("renders burger details and reviews", async () => {
    render(<BurgerPageContent burgerId="burger-1" />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Smash Shack Classic",
      );
    });

    expect(screen.getByText("Alex Rivera")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Customer reviews" }),
    ).toBeInTheDocument();
  });

  it("shows not found when burger does not exist", async () => {
    vi.mocked(getBurger).mockResolvedValue(null);

    render(<BurgerPageContent burgerId="missing" />);

    await waitFor(() => {
      expect(screen.getByText("Burger not found")).toBeInTheDocument();
    });
  });
});
