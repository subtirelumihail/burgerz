import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockImageAsset } from "@/test/mock-image";
import type { Restaurant } from "@/types/restaurant";

import { RestaurantCard } from "./RestaurantCard";

const baseRestaurant: Restaurant = {
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
};

describe("RestaurantCard", () => {
  it("renders restaurant details with linked title and image", () => {
    render(<RestaurantCard restaurant={baseRestaurant} />);

    expect(screen.getByRole("link", { name: "Smash Shack" })).toHaveAttribute(
      "href",
      "/restaurants/restaurant-1",
    );
    expect(screen.getByRole("img", { name: "Smash Shack" })).toHaveAttribute(
      "src",
      mockImageAsset.thumbnailUrl,
    );
    expect(
      screen.getByText("Strada Lipscani 25, Bucharest, Romania"),
    ).toBeInTheDocument();
    expect(screen.getByText("Mon – Fri")).toBeInTheDocument();
    expect(screen.getByText("11:00 – 22:00")).toBeInTheDocument();
  });

  it("formats distance in meters when under one kilometer", () => {
    render(
      <RestaurantCard restaurant={{ ...baseRestaurant, distanceKm: 0.45 }} />,
    );

    expect(screen.getByText("450 m away")).toBeInTheDocument();
  });

  it("formats distance in kilometers when one kilometer or more", () => {
    render(
      <RestaurantCard restaurant={{ ...baseRestaurant, distanceKm: 1.2 }} />,
    );

    expect(screen.getByText("1.2 km away")).toBeInTheDocument();
  });

  it("in list mode, exposes separate thumbnail and content links", () => {
    render(
      <RestaurantCard
        restaurant={{ ...baseRestaurant, distanceKm: 1.2 }}
        listMode
      />,
    );

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
  });
});
