import type { UserReviewContent } from "@/types/review";

export interface BurgerReviewsListProps {
  reviews: UserReviewContent[];
  isLoading?: boolean;
  /** When false, omits review photos (avoids below-fold images winning LCP before hero loads) */
  showReviewImages?: boolean;
}
