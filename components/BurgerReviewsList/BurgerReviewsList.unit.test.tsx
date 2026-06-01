import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { BurgerUserReview } from "@/types/review";

import { BurgerReviewsList } from "./BurgerReviewsList";

const mockReview: BurgerUserReview = {
  id: "review-1",
  burgerId: "burger-1",
  authorName: "Alex Rivera",
  text: "Perfect smash crust with juicy beef.",
  score: 4.5,
  createdAt: "2025-12-01T12:00:00.000Z",
};

describe("BurgerReviewsList", () => {
  it("renders reviews", () => {
    render(<BurgerReviewsList reviews={[mockReview]} />);

    expect(screen.getByText("Alex Rivera")).toBeInTheDocument();
  });

  it("shows empty message when there are no reviews", () => {
    render(<BurgerReviewsList reviews={[]} />);

    expect(
      screen.getByText("No reviews match your search."),
    ).toBeInTheDocument();
  });

  it("shows skeleton on initial load", () => {
    const { container } = render(<BurgerReviewsList reviews={[]} isLoading />);

    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
    expect(
      screen.queryByText("No reviews match your search."),
    ).not.toBeInTheDocument();
  });
});
