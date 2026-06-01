import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockImageAsset } from "@/test/mock-image";
import type { Restaurant } from "@/types/restaurant";

import { RestaurantHero } from "./RestaurantHero";

const mockRestaurant: Restaurant = {
  id: "restaurant-1",
  name: "Smash Shack",
  image: mockImageAsset,
  location: {
    address: "Strada Lipscani 25, Bucharest, Romania",
    coordinates: { latitude: 44.4319, longitude: 26.1027 },
  },
  openingHours: [{ days: "Mon – Fri", hours: "11:00 – 22:00" }],
};

describe("RestaurantHero", () => {
  it("renders restaurant image, name, location, and opening times", () => {
    render(<RestaurantHero restaurant={mockRestaurant} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Smash Shack" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Strada Lipscani 25, Bucharest, Romania"),
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
