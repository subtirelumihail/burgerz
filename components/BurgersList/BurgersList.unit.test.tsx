import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockImageAsset } from "@/test/mock-image";
import type { Burger } from "@/types/burger";

import { BurgersList } from "./BurgersList";

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

describe("BurgersList", () => {
  it("shows skeleton on initial load", () => {
    render(<BurgersList burgers={[]} isLoading />);

    expect(
      screen.getByRole("region", { name: "Burger results" }),
    ).toHaveAttribute("aria-busy", "true");
  });

  it("renders burgers when loaded", () => {
    render(<BurgersList burgers={[mockBurger]} />);

    expect(
      screen.getByRole("link", { name: "View photo of Smash Shack Classic" }),
    ).toHaveAttribute("href", "/burgers/burger-1");
    expect(
      screen.getByRole("link", {
        name: /smash shack classic, from smash shack\. 4\.5 out of 5 stars based on 10 reviews\. aspect scores:/i,
      }),
    ).toHaveAttribute("href", "/burgers/burger-1");
    expect(
      screen.getByText(/smash shack classic/i, { hidden: true }),
    ).toBeInTheDocument();
  });

  it("shows empty message when no results", () => {
    render(<BurgersList burgers={[]} />);

    expect(
      screen.getByText("No burgers match your search."),
    ).toBeInTheDocument();
  });
});
