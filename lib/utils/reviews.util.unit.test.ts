import { describe, expect, it } from "vitest";

import type { BurgerUserReviewAspects } from "@/types/review";

import { formatReviewDate, toCategoryScores } from "./reviews.util";

const aspects: BurgerUserReviewAspects = {
  taste: { text: "Rich beef flavor.", score: 4 },
  texture: { text: "Crisp patty edge.", score: 5 },
  visualPresentation: { text: "Clean stack.", score: 3 },
};

describe("toCategoryScores", () => {
  it("maps aspect scores to burger scores shape", () => {
    expect(toCategoryScores(aspects)).toEqual({
      taste: 4,
      texture: 5,
      visualPresentation: 3,
    });
  });
});

describe("formatReviewDate", () => {
  it("formats an ISO date for en-US display", () => {
    expect(formatReviewDate("2025-12-01T12:00:00.000Z")).toBe("Dec 1, 2025");
  });
});
