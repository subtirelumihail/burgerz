import { useId } from "react";

import { cn } from "@/lib/cn";

import styles from "./Textarea.module.css";
import type { TextareaProps } from "./types";

export function Textarea({
  label,
  error,
  hint,
  id: idProp,
  className,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = idProp ?? generatedId;
  const errorId = `${textareaId}-error`;
  const hintId = `${textareaId}-hint`;
  const hasError = Boolean(error);
  const describedBy = [
    hasError ? errorId : null,
    hint && !hasError ? hintId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.field}>
      <label htmlFor={textareaId} className={styles.label}>
        {label}
      </label>
      <textarea
        id={textareaId}
        className={cn(styles.textarea, className)}
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
