import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockImageAsset } from "@/test/mock-image";
import { mockRestaurant } from "@/test/mock-restaurant";

import { RestaurantHero } from "./RestaurantHero";

describe("RestaurantHero", () => {
  it("renders restaurant image, name, location, and opening times", () => {
    render(<RestaurantHero restaurant={mockRestaurant} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Smash Shack" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Strada Lipscani 25, Bucharest, Romania"),
    ).toBeInTheDocument();
    expect(screen.getByText("(42 reviews)")).toBeInTheDocument();
    expect(
      screen.getAllByText("Taste", { exact: true })[0],
    ).toBeInTheDocument();
    expect(screen.getByText("Mon – Fri")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /view full size: smash shack/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Smash Shack" })).toHaveAttribute(
      "src",
      mockImageAsset.thumbnailUrl,
    );
  });
});
