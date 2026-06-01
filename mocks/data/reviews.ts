import { createMockReviewImage } from "@/mocks/data/images";
import type {
  BurgerUserReview,
  BurgerUserReviewAspects,
  BurgerUserReviewRating,
} from "@/types/review";

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

const MAIN_REVIEW_TEXTS = [
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

const TASTE_REVIEW_TEXTS = [
  "Beef flavor was rich and well seasoned without being heavy.",
  "Sauce and cheese worked together nicely on every bite.",
  "Seasoning was balanced; nothing tasted flat or overpowering.",
  "Smoky notes came through clearly in the patty.",
  "Pickles and sauce added a bright contrast to the beef.",
  "A touch salty for me, but the core flavor was still strong.",
  "Truffle accent was subtle and made the burger feel special.",
  "Heat built slowly and stayed enjoyable through the meal.",
  "Classic diner-style flavor that hit the comfort-food spot.",
  "Fresh toppings kept each bite tasting clean and bright.",
];

const TEXTURE_REVIEW_TEXTS = [
  "Patty had a crisp edge and a juicy center.",
  "Bun held up well until the last few bites.",
  "Cheese melt was smooth and not rubbery.",
  "Lettuce and onion added a satisfying crunch.",
  "Patty was tender but could have been a bit thicker.",
  "Bun got soggy near the end, but the patty stayed solid.",
  "Good bite contrast between soft bun and crisp patty.",
  "Everything held together without falling apart.",
  "A little greasy, but the texture still felt indulgent.",
  "Firm crust on the patty with a soft interior.",
];

const VISUAL_REVIEW_TEXTS = [
  "Stack was tall and colorful with clean layers.",
  "Cheese draped over the patty looked great in photos.",
  "Bun had a nice toast color and even grill marks.",
  "Plating was simple but appetizing when it arrived.",
  "A bit messy, but still looked like a proper burger.",
  "Greens and sauce made the burger pop visually.",
  "Melted cheese and glossy patty made it very photogenic.",
  "Portion looked generous and well built.",
  "Colors were muted but the structure was neat.",
  "Classic presentation that matched the comfort-food vibe.",
];

function aspectScore(base: number, offset: number): BurgerUserReviewRating {
  return Math.min(5, Math.max(1, base + offset)) as BurgerUserReviewRating;
}

function createAspects(index: number): BurgerUserReviewAspects {
  const base = 3 + (index % 3);

  return {
    taste: {
      text: TASTE_REVIEW_TEXTS[index % TASTE_REVIEW_TEXTS.length],
      score: aspectScore(base, index % 2),
    },
    texture: {
      text: TEXTURE_REVIEW_TEXTS[index % TEXTURE_REVIEW_TEXTS.length],
      score: aspectScore(base, (index + 1) % 2),
    },
    visualPresentation: {
      text: VISUAL_REVIEW_TEXTS[index % VISUAL_REVIEW_TEXTS.length],
      score: aspectScore(base, (index + 2) % 2),
    },
  };
}

function averageRating(
  aspects: BurgerUserReviewAspects,
): BurgerUserReviewRating {
  const mean =
    (aspects.taste.score +
      aspects.texture.score +
      aspects.visualPresentation.score) /
    3;

  return Math.round(mean) as BurgerUserReviewRating;
}

function createReview(
  burgerId: string,
  index: number,
  withImage: boolean,
): BurgerUserReview {
  const authorName = REVIEW_AUTHORS[index % REVIEW_AUTHORS.length];
  const text = MAIN_REVIEW_TEXTS[index % MAIN_REVIEW_TEXTS.length];
  const aspects = createAspects(index);
  const score = averageRating(aspects);
  const dayOffset = index * 3 + 1;

  return {
    id: `${burgerId}-review-${index + 1}`,
    burgerId,
    authorName,
    text,
    score,
    aspects,
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
