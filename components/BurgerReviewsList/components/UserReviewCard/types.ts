import type { BurgerUserReview } from "@/types/review";

export interface UserReviewCardProps {
  review: BurgerUserReview;
  showReviewImage?: boolean;
  /** Enables split keyboard focus: photo button + review details region. */
  listMode?: boolean;
}
