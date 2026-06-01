import type { UserReviewContent } from "@/types/review";

export interface UserReviewCardProps {
  review: UserReviewContent;
  showReviewImage?: boolean;
  /** Enables split keyboard focus: photo button + review details region. */
  listMode?: boolean;
}
