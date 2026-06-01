"use client";

import { Controller } from "react-hook-form";

import { Button } from "@/components/basic/Button/Button";
import { Input } from "@/components/basic/Input/Input";
import { Textarea } from "@/components/basic/Textarea/Textarea";
import { UploadImage } from "@/components/basic/UploadImage/UploadImage";
import { useAddReviewForm } from "@/hooks/useAddReviewForm";

import { RatingSlider } from "./components/RatingSlider/RatingSlider";
import type { AddReviewFormProps } from "./types";

import styles from "./AddReviewForm.module.css";

export function AddReviewForm({ burgerId }: AddReviewFormProps) {
  const {
    register,
    control,
    errors,
    isSubmitting,
    onSubmit,
    setImageFile,
    handleCancel,
  } = useAddReviewForm(burgerId);

  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
      noValidate
      aria-label="Add burger review"
    >
      <UploadImage
        label="Photo (optional)"
        hint="Add a photo of the burger you tried."
        onImageChange={setImageFile}
        disabled={isSubmitting}
      />

      <Input
        label="Your name"
        error={errors.authorName}
        required
        autoComplete="name"
        disabled={isSubmitting}
        {...register("authorName")}
      />

      <Textarea
        label="Description"
        error={errors.text}
        required
        rows={5}
        disabled={isSubmitting}
        {...register("text")}
      />

      <fieldset className={styles.ratings}>
        <legend className={styles.legend}>Ratings</legend>
        <Controller
          name="aspects.taste"
          control={control}
          render={({ field }) => (
            <RatingSlider
              id="taste-rating"
              label="Taste"
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
        <Controller
          name="aspects.texture"
          control={control}
          render={({ field }) => (
            <RatingSlider
              id="texture-rating"
              label="Texture"
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
        <Controller
          name="aspects.visualPresentation"
          control={control}
          render={({ field }) => (
            <RatingSlider
              id="visual-presentation-rating"
              label="Visual presentation"
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
      </fieldset>

      {errors.submit ? (
        <p className={styles.status} role="alert">
          {errors.submit}
        </p>
      ) : null}

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Submit review
        </Button>
      </div>
    </form>
  );
}
