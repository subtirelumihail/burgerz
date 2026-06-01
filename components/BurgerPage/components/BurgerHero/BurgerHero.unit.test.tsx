import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockImageAsset } from "@/test/mock-image";
import type { Burger } from "@/types/burger";

import { BurgerHero } from "./BurgerHero";

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

describe("BurgerHero", () => {
  it("renders burger image, title, restaurant link, and scores", () => {
    render(<BurgerHero burger={mockBurger} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Smash Shack Classic" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Smash Shack" })).toHaveAttribute(
      "href",
      "/restaurants/restaurant-1",
    );
    expect(
      screen.getByLabelText(
        "Smash Shack Classic. 4.5 out of 5 stars based on 10 reviews. Aspect scores: Taste, 4.5 out of 5. Texture, 4.5 out of 5. Visual presentation, 4.5 out of 5.",
      ),
    ).toHaveAttribute("tabindex", "0");
    expect(
      screen.getByRole("button", {
        name: /view full size: smash shack classic/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Smash Shack Classic" }),
    ).toHaveAttribute("src", mockImageAsset.thumbnailUrl);
  });
});
