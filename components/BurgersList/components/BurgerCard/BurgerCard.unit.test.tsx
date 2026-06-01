import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockImageAsset } from "@/test/mock-image";
import type { Burger } from "@/types/burger";

import { BurgerCard } from "./BurgerCard";

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

describe("BurgerCard", () => {
  it("renders burger details with linked title, restaurant, and image", () => {
    render(<BurgerCard burger={mockBurger} />);

    expect(
      screen.getByRole("link", { name: "Smash Shack Classic" }),
    ).toHaveAttribute("href", "/burgers/burger-1");
    expect(screen.getByRole("link", { name: "Smash Shack" })).toHaveAttribute(
      "href",
      "/restaurants/restaurant-1",
    );
    expect(
      screen.getByRole("img", { name: "Smash Shack Classic" }),
    ).toHaveAttribute("src", mockImageAsset.thumbnailUrl);
    expect(
      screen.getByText("Taste, 4.5 out of 5", { exact: false }),
    ).toBeInTheDocument();
  });

  it("in list mode, exposes separate thumbnail and content links", () => {
    render(<BurgerCard burger={mockBurger} listMode />);

    expect(
      screen.getByRole("link", { name: "View photo of Smash Shack Classic" }),
    ).toHaveAttribute("href", "/burgers/burger-1");
    expect(
      screen.getByRole("link", {
        name: /smash shack classic, from smash shack\. 4\.5 out of 5 stars based on 10 reviews\. aspect scores:/i,
      }),
    ).toHaveAttribute("href", "/burgers/burger-1");
  });

  it("appends return path to burger detail links", () => {
    render(
      <BurgerCard
        burger={mockBurger}
        listMode
        returnTo="/restaurants/restaurant-1"
      />,
    );

    expect(
      screen.getByRole("link", { name: "View photo of Smash Shack Classic" }),
    ).toHaveAttribute(
      "href",
      "/burgers/burger-1?from=%2Frestaurants%2Frestaurant-1",
    );
  });

  it("hides restaurant link when showRestaurant is false", () => {
    render(<BurgerCard burger={mockBurger} listMode showRestaurant={false} />);

    expect(
      screen.queryByRole("link", { name: "Smash Shack" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/smash shack classic/i, { hidden: true }),
    ).toBeInTheDocument();
  });
});
