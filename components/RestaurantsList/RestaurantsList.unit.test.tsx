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
      screen.getByRole("heading", { level: 2, name: "Smash Shack" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Strada Lipscani 25, Bucharest, Romania"),
    ).toBeInTheDocument();
    expect(screen.getByText("Mon – Fri")).toBeInTheDocument();
    expect(screen.getByText("11:00 – 22:00")).toBeInTheDocument();
    expect(screen.getByText("1.2 km away")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Smash Shack" })).toHaveAttribute(
      "src",
      mockImageAsset.thumbnailUrl,
    );
  });

  it("shows empty state when there are no restaurants", () => {
    render(<RestaurantsList restaurants={[]} isLoading={false} />);

    expect(
      screen.getByText("No restaurants match your search."),
    ).toBeInTheDocument();
  });
});
