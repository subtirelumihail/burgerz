"use client";

import { useId } from "react";

import type { BurgerUserReviewRating } from "@/types/review";

import type { RatingSliderProps } from "./types";

import styles from "./RatingSlider.module.css";

const MIN_RATING = 1;
const MAX_RATING = 5;

function clampRating(value: number): BurgerUserReviewRating {
  const rounded = Math.round(value);

  return Math.min(
    MAX_RATING,
    Math.max(MIN_RATING, rounded),
  ) as BurgerUserReviewRating;
}

export function RatingSlider({
  label,
  value,
  onChange,
  error,
  id: idProp,
  disabled,
}: RatingSliderProps) {
  const generatedId = useId();
  const fieldId = idProp ?? generatedId;
  const sliderId = `${fieldId}-slider`;
  const inputId = `${fieldId}-input`;
  const labelId = `${fieldId}-label`;
  const errorId = `${fieldId}-error`;
  const hasError = Boolean(error);

  function handleSliderChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(clampRating(Number(event.target.value)));
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const parsed = Number.parseInt(event.target.value, 10);

    if (Number.isNaN(parsed)) {
      return;
    }

    onChange(clampRating(parsed));
  }

  return (
    <div className={styles.field}>
      <label htmlFor={sliderId} id={labelId} className={styles.label}>
        {label}
      </label>
      <div className={styles.controls}>
        <input
          id={sliderId}
          type="range"
          min={MIN_RATING}
          max={MAX_RATING}
          step={1}
          value={value}
          onChange={handleSliderChange}
          disabled={disabled}
          aria-valuemin={MIN_RATING}
          aria-valuemax={MAX_RATING}
          aria-valuenow={value}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : labelId}
          className={styles.slider}
        />
        <input
          id={inputId}
          type="number"
          min={MIN_RATING}
          max={MAX_RATING}
          step={1}
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          inputMode="numeric"
          aria-label={`${label} rating value`}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          className={styles.input}
        />
      </div>
      {hasError ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
