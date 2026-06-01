import type { BurgerUserReviewRating } from "@/types/review";

export interface RatingSliderProps {
  label: string;
  value: BurgerUserReviewRating;
  onChange: (value: BurgerUserReviewRating) => void;
  error?: string;
  id?: string;
  disabled?: boolean;
}
