import { describe, expect, it } from "vitest";

import { mockImageAsset } from "@/test/mock-image";
import { mockBurgerUserReview } from "@/test/mock-review";
import type { Burger } from "@/types/burger";
import type { Restaurant } from "@/types/restaurant";

import {
  formatBurgerListItemLabel,
  formatBurgerSummaryLabel,
  formatBurgerThumbnailLabel,
  formatRestaurantListItemLabel,
  formatRestaurantThumbnailLabel,
  formatReviewListItemLabel,
} from "./list-item-labels";

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

describe("formatBurgerThumbnailLabel", () => {
  it("describes the burger photo link", () => {
    expect(formatBurgerThumbnailLabel(mockBurger)).toBe(
      "View photo of Smash Shack Classic",
    );
  });
});

describe("formatRestaurantThumbnailLabel", () => {
  it("describes the restaurant photo link", () => {
    expect(formatRestaurantThumbnailLabel(mockRestaurant)).toBe(
      "View photo of Smash Shack",
    );
  });
});

describe("formatBurgerSummaryLabel", () => {
  it("includes title, review summary, and aspect scores", () => {
    expect(formatBurgerSummaryLabel(mockBurger)).toBe(
      "Smash Shack Classic. 4.5 out of 5 stars based on 10 reviews. Aspect scores: Taste, 4.5 out of 5. Texture, 4.5 out of 5. Visual presentation, 4.5 out of 5.",
    );
  });
});

describe("formatBurgerListItemLabel", () => {
  it("includes title, restaurant, review summary, and aspect scores", () => {
    expect(formatBurgerListItemLabel(mockBurger)).toBe(
      "Smash Shack Classic, from Smash Shack. 4.5 out of 5 stars based on 10 reviews. Aspect scores: Taste, 4.5 out of 5. Texture, 4.5 out of 5. Visual presentation, 4.5 out of 5.",
    );
  });
});

describe("formatRestaurantListItemLabel", () => {
  it("includes name, distance, address, and opening hours", () => {
    expect(formatRestaurantListItemLabel(mockRestaurant)).toBe(
      "Smash Shack. 1.2 kilometers away. Strada Lipscani 25, Bucharest, Romania. Opening times: Mon – Fri, 11:00 – 22:00. Sat – Sun, 10:00 – 23:00.",
    );
  });

  it("omits distance when unavailable", () => {
    const { distanceKm: _distanceKm, ...restaurantWithoutDistance } =
      mockRestaurant;

    expect(formatRestaurantListItemLabel(restaurantWithoutDistance)).toBe(
      "Smash Shack. Strada Lipscani 25, Bucharest, Romania. Opening times: Mon – Fri, 11:00 – 22:00. Sat – Sun, 10:00 – 23:00.",
    );
  });
});

describe("formatReviewListItemLabel", () => {
  it("includes author, date, rating, text, and aspect details", () => {
    const label = formatReviewListItemLabel(mockBurgerUserReview);

    expect(label).toContain("Alex Rivera, Dec 1, 2025.");
    expect(label).toContain("Overall rating, 4 out of 5 stars.");
    expect(label).toContain("Perfect smash crust with juicy beef.");
    expect(label).toContain(
      "Taste, 4 out of 5: Beef flavor was rich and well seasoned without being heavy.",
    );
    expect(label).toContain(
      "Texture, 5 out of 5: Patty had a crisp edge and a juicy center.",
    );
    expect(label).toContain(
      "Visual presentation, 4 out of 5: Stack was tall and colorful with clean layers.",
    );
  });

  it("mentions review photo when present", () => {
    const label = formatReviewListItemLabel({
      ...mockBurgerUserReview,
      image: mockImageAsset,
    });

    expect(label).toContain("Includes a review photo.");
  });

  it("can omit review photo note for split list tab stops", () => {
    const label = formatReviewListItemLabel(
      {
        ...mockBurgerUserReview,
        image: mockImageAsset,
      },
      { includePhotoNote: false },
    );

    expect(label).not.toContain("Includes a review photo.");
  });
});
