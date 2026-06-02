import { useId } from "react";

import { cn } from "@/lib/cn";

import styles from "./RadioButton.module.css";
import type { RadioButtonProps } from "./types";

export function RadioButton({
  label,
  id: idProp,
  className,
  disabled,
  ...props
}: RadioButtonProps) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;

  return (
    <label htmlFor={inputId} className={cn(styles.root, className)}>
      <input
        id={inputId}
        type="radio"
        className={styles.input}
        disabled={disabled}
        {...props}
      />
      <span className={styles.label}>{label}</span>
    </label>
  );
}
