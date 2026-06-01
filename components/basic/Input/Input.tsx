import { useId } from "react";

import { cn } from "@/lib/cn";

import styles from "./Input.module.css";
import type { InputProps } from "./types";

export function Input({
  label,
  error,
  hint,
  id: idProp,
  className,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const hasError = Boolean(error);
  const describedBy = [
    hasError ? errorId : null,
    hint && !hasError ? hintId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        id={inputId}
        className={cn(styles.input, className)}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy || undefined}
        {...props}
      />
      {hint && !hasError ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {hasError ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
