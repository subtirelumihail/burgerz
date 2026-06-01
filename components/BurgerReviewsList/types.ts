import type { BurgerUserReview } from "@/types/review";

export interface BurgerReviewsListProps {
  reviews: BurgerUserReview[];
  isLoading?: boolean;
  /** When false, omits review photos (avoids below-fold images winning LCP before hero loads) */
  showReviewImages?: boolean;
}
