import { describe, expect, it } from "vitest";

import { mockReviews } from "@/mocks/data/reviews";

import { computeRestaurantRatings } from "./restaurant-ratings";

describe("computeRestaurantRatings", () => {
  it("aggregates burger reviews for a restaurant", () => {
    const ratings = computeRestaurantRatings("restaurant-1", mockReviews);

    expect(ratings.reviewCount).toBe(25);
    expect(ratings.reviewScore).toBeGreaterThan(0);
    expect(ratings.scores.taste).toBeGreaterThan(0);
    expect(ratings.scores.texture).toBeGreaterThan(0);
    expect(ratings.scores.visualPresentation).toBeGreaterThan(0);
  });

  it("combines reviews from every burger at the restaurant", () => {
    const ratings = computeRestaurantRatings("restaurant-4", mockReviews);

    expect(ratings.reviewCount).toBe(31);
  });

  it("returns zeroed ratings when a restaurant has no burger reviews", () => {
    expect(computeRestaurantRatings("missing-restaurant", mockReviews)).toEqual(
      {
        reviewCount: 0,
        reviewScore: 0,
        scores: {
          taste: 0,
          texture: 0,
          visualPresentation: 0,
        },
      },
    );
  });
});
