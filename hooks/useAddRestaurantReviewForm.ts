"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, type FormEventHandler } from "react";
import { useForm, type Control, type UseFormRegister } from "react-hook-form";

import { addReviewFormSchema } from "@/components/AddBurgerReviewPage/components/AddBurgerReviewForm/add-review-form.schema";
import type { AddReviewFormValues } from "@/components/AddBurgerReviewPage/components/AddBurgerReviewForm/add-review-form.schema";
import type { AddRestaurantReviewFormErrors } from "@/components/AddRestaurantReviewPage/components/AddRestaurantReviewForm/types";
import { createMockReviewImage } from "@/mocks/data/images";
import { createRestaurantReview } from "@/lib/services/review.service";
import type { BurgerUserReviewRating } from "@/types/review";

const DEFAULT_RATING = 3 as BurgerUserReviewRating;

const DEFAULT_VALUES: AddReviewFormValues = {
  authorName: "",
  text: "",
  aspects: {
    taste: DEFAULT_RATING,
    texture: DEFAULT_RATING,
    visualPresentation: DEFAULT_RATING,
  },
};

function createReviewImageId(restaurantId: string): string {
  return `${restaurantId}-review-${Date.now()}`;
}

interface UseAddRestaurantReviewFormResult {
  register: UseFormRegister<AddReviewFormValues>;
  control: Control<AddReviewFormValues>;
  errors: AddRestaurantReviewFormErrors;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  setImageFile: (file: File | null) => void;
  handleCancel: () => void;
}

export function useAddRestaurantReviewForm(
  restaurantId: string,
): UseAddRestaurantReviewFormResult {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | undefined>();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddReviewFormValues>({
    resolver: zodResolver(addReviewFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(undefined);

    try {
      await createRestaurantReview(restaurantId, {
        authorName: values.authorName,
        text: values.text,
        aspects: values.aspects,
        ...(imageFile
          ? {
              image: createMockReviewImage(createReviewImageId(restaurantId)),
            }
          : {}),
      });

      router.push(`/restaurants/${restaurantId}`);
    } catch {
      setSubmitError(
        "Something went wrong while saving your review. Please try again.",
      );
    }
  });

  return {
    register,
    control,
    errors: {
      authorName: errors.authorName?.message,
      text: errors.text?.message,
      submit: submitError,
    },
    isSubmitting,
    onSubmit,
    setImageFile,
    handleCancel: () => {
      router.push(`/restaurants/${restaurantId}`);
    },
  };
}
