import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockImageAsset } from "@/test/mock-image";
import type { Restaurant } from "@/types/restaurant";

import { RestaurantsList } from "./RestaurantsList";

const mockRestaurant: Restaurant = {
  id: "restaurant-1",
  name: "Smash Shack",
  image: mockImageAsset,
  location: {
    address: "Strada Lipscani 25, Bucharest, Romania",
    coordinates: { latitude: 44.4319, longitude: 26.1027 },
  },
  openingHours: [
    { days: "Mon – Fri", hours: "11:00 – 22:00" },
    { days: "Sat – Sun", hours: "10:00 – 23:00" },
  ],
  distanceKm: 1.2,
};

describe("RestaurantsList", () => {
  it("renders restaurant cards with location and opening times", () => {
    render(<RestaurantsList restaurants={[mockRestaurant]} />);

    expect(
      screen.getByRole("link", { name: "View photo of Smash Shack" }),
    ).toHaveAttribute("href", "/restaurants/restaurant-1");
    expect(
      screen.getByRole("link", {
        name: /smash shack\. 1\.2 kilometers away\. strada lipscani 25, bucharest, romania\. opening times:/i,
      }),
    ).toHaveAttribute("href", "/restaurants/restaurant-1");
    expect(
      screen.getByText("Smash Shack", { hidden: true }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Strada Lipscani 25, Bucharest, Romania", {
        hidden: true,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Mon – Fri", { hidden: true })).toBeInTheDocument();
    expect(
      screen.getByText("11:00 – 22:00", { hidden: true }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("1.2 km away", { hidden: true }),
    ).toBeInTheDocument();
  });

  it("shows empty state when there are no restaurants", () => {
    render(<RestaurantsList restaurants={[]} isLoading={false} />);

    expect(
      screen.getByText("No restaurants match your search."),
    ).toBeInTheDocument();
  });
});
