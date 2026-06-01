import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockBurgerUserReview } from "@/test/mock-review";

import { BurgerReviewsList } from "./BurgerReviewsList";

const mockReview = mockBurgerUserReview;

describe("BurgerReviewsList", () => {
  it("renders reviews", () => {
    render(<BurgerReviewsList reviews={[mockReview]} />);

    expect(
      screen.getByLabelText(
        /alex rivera, dec 1, 2025\. overall rating, 4 out of 5 stars\./i,
      ),
    ).toHaveAttribute("tabindex", "0");
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
