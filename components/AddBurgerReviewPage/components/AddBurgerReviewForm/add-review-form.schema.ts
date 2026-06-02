import { z } from "zod";

import type { BurgerUserReviewRating } from "@/types/review";

const ratingSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]) satisfies z.ZodType<BurgerUserReviewRating>;

export const addReviewFormSchema = z.object({
  authorName: z.string().trim().min(1, "Your name is required."),
  text: z.string().trim().min(1, "Description is required."),
  aspects: z.object({
    taste: ratingSchema,
    texture: ratingSchema,
    visualPresentation: ratingSchema,
  }),
});

export type AddReviewFormValues = z.infer<typeof addReviewFormSchema>;
