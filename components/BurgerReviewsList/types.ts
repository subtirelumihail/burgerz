import type { BurgerUserReview } from "@/types/review";

export interface BurgerReviewsListProps {
  reviews: BurgerUserReview[];
  isLoading?: boolean;
}
