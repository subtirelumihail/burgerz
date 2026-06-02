export type { AddReviewFormValues } from "./add-review-form.schema";

export interface AddBurgerReviewFormProps {
  burgerId: string;
}

export interface AddBurgerReviewFormErrors {
  authorName?: string;
  text?: string;
  submit?: string;
}
