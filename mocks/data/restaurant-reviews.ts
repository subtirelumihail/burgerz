import { createMockReviewImage } from "@/mocks/data/images";
import type {
  BurgerUserReviewAspects,
  BurgerUserReviewRating,
  RestaurantUserReview,
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
  "Great atmosphere and friendly staff. Burgers came out fast and hot.",
  "Cozy spot with solid service. Would recommend for a casual burger night.",
  "Clean dining room and consistent quality across multiple visits.",
  "Loved the vibe here. Music was a touch loud but the food made up for it.",
  "Quick counter service and the seating area was comfortable.",
  "Nice neighborhood spot. Parking was easy and the team was welcoming.",
  "Perfect place to grab lunch. Lines move quickly during peak hours.",
  "Outdoor seating was a plus on a sunny day. Burgers were excellent.",
  "Staff remembered our order from last time. Small touch, big impact.",
  "Family-friendly without feeling chaotic. Kids menu was a hit too.",
  "Late-night stop that did not disappoint. Kitchen stayed on point.",
  "Good value for the neighborhood. Portions were generous.",
  "Modern interior and spotless restrooms. Details matter.",
  "Our go-to when friends visit town. Never had a bad meal here.",
  "Counter staff was patient with our large group order.",
  "Warm lighting and open kitchen made the experience feel special.",
  "Easy to find and worth the trip from across town.",
  "Reliable quality every time. This place has earned our loyalty.",
  "Weekend brunch crowd was busy but service stayed attentive.",
  "Hidden gem with a loyal local following. Now we get why.",
];

const TASTE_REVIEW_TEXTS = [
  "Seasoning was balanced across every burger we tried.",
  "Sauces and toppings tasted fresh, not pre-made.",
  "Patty flavor was rich without being overly salty.",
  "Side dishes complemented the mains nicely.",
  "Milkshakes paired perfectly with the savory burgers.",
  "Pickles and house sauces added bright contrast.",
  "Smoke and char came through clearly on every bite.",
  "Vegetarian options held their own against the beef burgers.",
  "Classic diner-style flavors done with care.",
  "Specials board items were standouts on our visit.",
];

const TEXTURE_REVIEW_TEXTS = [
  "Buns held up well even on to-go orders.",
  "Fries stayed crispy through the meal.",
  "Cheese melt was smooth on every burger.",
  "Lettuce and tomato added a satisfying crunch.",
  "Patties had a crisp edge and juicy center.",
  "Onion rings had a light, non-greasy batter.",
  "Everything arrived at the right temperature.",
  "Portions felt hearty without being sloppy.",
  "Sliders were bite-sized but still satisfying.",
  "Texture stayed consistent from first bite to last.",
];

const VISUAL_REVIEW_TEXTS = [
  "Open kitchen made the plating look intentional.",
  "Burgers photographed well for our group chat.",
  "Clean presentation on every plate that arrived.",
  "Colorful toppings made each burger pop.",
  "Melted cheese draped neatly over the patties.",
  "Simple plating that matched the casual vibe.",
  "Neon signage and decor gave the place character.",
  "Generous stacks looked as good as they tasted.",
  "Condiment bar was organized and well stocked.",
  "Table setup was tidy and inviting.",
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
  restaurantId: string,
  index: number,
  withImage: boolean,
): RestaurantUserReview {
  const authorName = REVIEW_AUTHORS[index % REVIEW_AUTHORS.length];
  const text = MAIN_REVIEW_TEXTS[index % MAIN_REVIEW_TEXTS.length];
  const aspects = createAspects(index);
  const score = averageRating(aspects);
  const dayOffset = index * 3 + 1;

  return {
    id: `${restaurantId}-review-${index + 1}`,
    restaurantId,
    authorName,
    text,
    score,
    aspects,
    ...(withImage
      ? {
          image: createMockReviewImage(`${restaurantId}-review-${index + 1}`),
        }
      : {}),
    createdAt: new Date(Date.now() - dayOffset * 86_400_000).toISOString(),
  };
}

function createReviewsForRestaurant(
  restaurantId: string,
  count: number,
): RestaurantUserReview[] {
  return Array.from({ length: count }, (_, index) =>
    createReview(restaurantId, index, index % 3 === 0),
  );
}

export const mockRestaurantReviews: RestaurantUserReview[] = [
  ...createReviewsForRestaurant("restaurant-1", 14),
  ...createReviewsForRestaurant("restaurant-2", 10),
  ...createReviewsForRestaurant("restaurant-3", 8),
  ...createReviewsForRestaurant("restaurant-4", 12),
  ...createReviewsForRestaurant("restaurant-5", 7),
  ...createReviewsForRestaurant("restaurant-6", 9),
  ...createReviewsForRestaurant("restaurant-7", 11),
  ...createReviewsForRestaurant("restaurant-8", 6),
];
