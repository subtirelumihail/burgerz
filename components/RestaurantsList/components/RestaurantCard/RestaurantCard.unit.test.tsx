import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockRestaurant } from "@/test/mock-restaurant";

import { RestaurantCard } from "./RestaurantCard";

const baseRestaurant = mockRestaurant;

describe("RestaurantCard", () => {
  it("renders restaurant details with linked title and image", () => {
    render(<RestaurantCard restaurant={baseRestaurant} />);

    expect(screen.getByRole("link", { name: "Smash Shack" })).toHaveAttribute(
      "href",
      "/restaurants/restaurant-1",
    );
    expect(screen.getByText("(42 reviews)")).toBeInTheDocument();
    expect(screen.getByText("Taste", { exact: true })).toBeInTheDocument();
    expect(
      screen.getByText("Strada Lipscani 25, Bucharest, Romania"),
    ).toBeInTheDocument();
    expect(screen.getByText("Mon – Fri")).toBeInTheDocument();
    expect(screen.getByText("11:00 – 22:00")).toBeInTheDocument();
  });

  it("hides distance when location access is not granted", () => {
    render(
      <RestaurantCard restaurant={{ ...baseRestaurant, distanceKm: 1.2 }} />,
    );

    expect(screen.queryByText("1.2 km away")).not.toBeInTheDocument();
  });

  it("formats distance in meters when location access is granted", () => {
    render(
      <RestaurantCard
        restaurant={{ ...baseRestaurant, distanceKm: 0.45 }}
        showDistance
      />,
    );

    expect(screen.getByText("450 m away")).toBeInTheDocument();
  });

  it("formats distance in kilometers when location access is granted", () => {
    render(
      <RestaurantCard
        restaurant={{ ...baseRestaurant, distanceKm: 1.2 }}
        showDistance
      />,
    );

    expect(screen.getByText("1.2 km away")).toBeInTheDocument();
  });

  it("in list mode, exposes separate thumbnail and content links", () => {
    render(
      <RestaurantCard
        restaurant={{ ...baseRestaurant, distanceKm: 1.2 }}
        listMode
        showDistance
      />,
    );

    expect(
      screen.getByRole("link", { name: "View photo of Smash Shack" }),
    ).toHaveAttribute("href", "/restaurants/restaurant-1");
    expect(
      screen.getByRole("link", {
        name: /smash shack\. strada lipscani 25, bucharest, romania\. 4\.5 out of 5 stars based on 42 reviews/i,
      }),
    ).toHaveAttribute("href", "/restaurants/restaurant-1");
    expect(
      screen.getByText("Smash Shack", { hidden: true }),
    ).toBeInTheDocument();
  });
});
