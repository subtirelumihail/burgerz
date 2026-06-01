import type { BurgerUserReview } from "@/types/review";

export const mockBurgerUserReview: BurgerUserReview = {
  id: "review-1",
  burgerId: "burger-1",
  authorName: "Alex Rivera",
  text: "Perfect smash crust with juicy beef.",
  score: 4,
  aspects: {
    taste: {
      text: "Beef flavor was rich and well seasoned without being heavy.",
      score: 4,
    },
    texture: {
      text: "Patty had a crisp edge and a juicy center.",
      score: 5,
    },
    visualPresentation: {
      text: "Stack was tall and colorful with clean layers.",
      score: 4,
    },
  },
  createdAt: "2025-12-01T12:00:00.000Z",
};
