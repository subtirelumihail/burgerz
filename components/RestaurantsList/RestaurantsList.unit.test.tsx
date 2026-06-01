import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockRestaurant } from "@/test/mock-restaurant";

import { RestaurantsList } from "./RestaurantsList";

describe("RestaurantsList", () => {
  it("renders restaurant cards with location and opening times", () => {
    render(<RestaurantsList restaurants={[mockRestaurant]} />);

    expect(
      screen.getByRole("link", { name: "View photo of Smash Shack" }),
    ).toHaveAttribute("href", "/restaurants/restaurant-1");
    expect(
      screen.getByRole("link", {
        name: /smash shack\. strada lipscani 25, bucharest, romania\. 4\.5 out of 5 stars based on 42 reviews/i,
      }),
    ).toHaveAttribute("href", "/restaurants/restaurant-1");
    expect(
      screen.getByText("Strada Lipscani 25, Bucharest, Romania"),
    ).toBeInTheDocument();
    expect(screen.getByText("(42 reviews)")).toBeInTheDocument();
  });

  it("renders empty state when there are no restaurants", () => {
    render(<RestaurantsList restaurants={[]} isLoading={false} />);

    expect(
      screen.getByText("No restaurants match your search."),
    ).toBeInTheDocument();
  });
});
