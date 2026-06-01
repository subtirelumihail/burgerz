import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockImageAsset } from "@/test/mock-image";
import type { Burger } from "@/types/burger";

import { AddReviewBurgerSummary } from "./AddReviewBurgerSummary";

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

describe("AddReviewBurgerSummary", () => {
  it("renders burger image, title, and restaurant link", () => {
    render(<AddReviewBurgerSummary burger={mockBurger} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Smash Shack Classic" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Smash Shack" })).toHaveAttribute(
      "href",
      "/restaurants/restaurant-1",
    );
    expect(
      screen.getByRole("button", {
        name: /view full size: smash shack classic/i,
      }),
    ).toBeInTheDocument();
  });
});
