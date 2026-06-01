export type { AddReviewFormValues } from "./add-review-form.schema";

export interface AddReviewFormProps {
  burgerId: string;
}

export interface AddReviewFormErrors {
  authorName?: string;
  text?: string;
  submit?: string;
}
