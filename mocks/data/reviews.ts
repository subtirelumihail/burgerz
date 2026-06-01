import { createMockReviewImage } from "@/mocks/data/images";
import type { BurgerUserReview } from "@/types/review";

const REVIEW_AUTHORS = [
  "Alex Rivera",
  "Jordan Kim",
  "Sam Patel",
  "Taylor Brooks",
  "Casey Nguyen",
  "Morgan Lee",
  "Riley Chen",
  "Jamie Ortiz",
  "Drew Martinez",
  "Quinn Johnson",
  "Avery Williams",
  "Blake Anderson",
  "Cameron Davis",
  "Dakota Miller",
  "Emery Wilson",
  "Finley Moore",
  "Harper Taylor",
  "Indigo Clark",
  "Jesse Walker",
  "Kai Thompson",
];

const REVIEW_TEXTS = [
  "Perfect smash crust with juicy beef. Would order again without hesitation.",
  "Great flavor but the bun was a little soggy by the time it arrived.",
  "One of the best burgers in town. The cheese melt was flawless.",
  "Solid portion size and seasoning. Not life-changing, but very good.",
  "Loved the char and the sauce balance. Texture was spot on.",
  "A bit too salty for my taste, but the patty was cooked perfectly.",
  "Beautiful presentation and the first bite was incredible.",
  "Good value for the price. Fries were crispy too.",
  "The pickles added a nice crunch. Would skip the extra sauce next time.",
  "Took a while to arrive but still hot and delicious.",
  "My go-to order now. Consistent quality every visit.",
  "Nice smoky flavor. Patty could have been a touch thicker.",
  "Fresh ingredients and you can taste the quality.",
  "Decent burger, nothing special compared to others nearby.",
  "The truffle notes were subtle but elevated the whole bite.",
  "Huge fan of the spice level. Heat builds nicely without overpowering.",
  "Classic done right. Simple, messy, and satisfying.",
  "Vegetarian friend tried a bite and even they were impressed.",
  "A little greasy but in the best way possible.",
  "Will definitely come back on burger night.",
];

function createReview(
  burgerId: string,
  index: number,
  withImage: boolean,
): BurgerUserReview {
  const authorName = REVIEW_AUTHORS[index % REVIEW_AUTHORS.length];
  const text = REVIEW_TEXTS[index % REVIEW_TEXTS.length];
  const score = 3 + (index % 3) * 0.5;
  const dayOffset = index * 3 + 1;

  return {
    id: `${burgerId}-review-${index + 1}`,
    burgerId,
    authorName,
    text,
    score,
    ...(withImage
      ? {
          image: createMockReviewImage(`${burgerId}-review-${index + 1}`),
        }
      : {}),
    createdAt: new Date(Date.now() - dayOffset * 86_400_000).toISOString(),
  };
}

function createReviewsForBurger(
  burgerId: string,
  count: number,
): BurgerUserReview[] {
  return Array.from({ length: count }, (_, index) =>
    createReview(burgerId, index, index % 3 === 0),
  );
}

export const mockReviews: BurgerUserReview[] = [
  ...createReviewsForBurger("burger-1", 18),
  ...createReviewsForBurger("burger-2", 12),
  ...createReviewsForBurger("burger-3", 8),
  ...createReviewsForBurger("burger-4", 15),
  ...createReviewsForBurger("burger-5", 10),
  ...createReviewsForBurger("burger-6", 6),
  ...createReviewsForBurger("burger-7", 14),
  ...createReviewsForBurger("burger-8", 9),
  ...createReviewsForBurger("burger-9", 7),
  ...createReviewsForBurger("burger-10", 5),
  ...createReviewsForBurger("burger-11", 11),
  ...createReviewsForBurger("burger-12", 8),
  ...createReviewsForBurger("burger-13", 16),
  ...createReviewsForBurger("burger-14", 10),
  ...createReviewsForBurger("burger-15", 7),
  ...createReviewsForBurger("burger-16", 9),
  ...createReviewsForBurger("burger-17", 6),
  ...createReviewsForBurger("burger-18", 8),
];
