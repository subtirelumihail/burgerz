import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { mockBurgerUserReview } from "@/test/mock-review";

import { UserReviewCard } from "./UserReviewCard";

const baseReview = mockBurgerUserReview;

describe("UserReviewCard", () => {
  it("renders review details", () => {
    render(<UserReviewCard review={baseReview} />);

    expect(screen.getByText("Alex Rivera")).toBeInTheDocument();
    expect(
      screen.getByText("Perfect smash crust with juicy beef."),
    ).toBeInTheDocument();
    expect(screen.getByText("Taste")).toBeInTheDocument();
    expect(screen.getByText("Texture")).toBeInTheDocument();
    expect(screen.getByText("Visual presentation")).toBeInTheDocument();
    expect(screen.getAllByText("4")).toHaveLength(3);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders review image when provided", () => {
    render(
      <UserReviewCard
        review={{
          ...baseReview,
          image: {
            thumbnailUrl: "https://example.com/review-thumb.jpg",
            fullUrl: "https://example.com/review-full.jpg",
            width: 960,
            height: 640,
          },
        }}
      />,
    );

    expect(
      screen.getByRole("img", { name: "Photo from Alex Rivera's review" }),
    ).toBeInTheDocument();
  });

  it("does not render review photo when not provided", () => {
    render(<UserReviewCard review={baseReview} />);

    expect(
      screen.queryByRole("img", { name: "Photo from Alex Rivera's review" }),
    ).not.toBeInTheDocument();
  });

  it("opens lightbox when review photo is clicked", async () => {
    const user = userEvent.setup();

    render(
      <UserReviewCard
        review={{
          ...baseReview,
          image: {
            thumbnailUrl: "https://example.com/review-thumb.jpg",
            fullUrl: "https://example.com/review-full.jpg",
            width: 960,
            height: 640,
          },
        }}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "View full size: Photo from Alex Rivera's review",
      }),
    );

    expect(
      screen.getByRole("dialog", {
        name: "Photo from Alex Rivera's review",
      }),
    ).toBeInTheDocument();
  });
});
