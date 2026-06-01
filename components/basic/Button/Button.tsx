import { cn } from "@/lib/cn";

import styles from "./Button.module.css";
import type { ButtonProps } from "./types";

export function Button({
  variant = "primary",
  iconLeft: IconLeft,
  iconRight: IconRight,
  children,
  className,
  isLoading = false,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      className={cn(styles.root, styles[variant], className)}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {IconLeft ? <IconLeft className={styles.icon} aria-hidden /> : null}
      <span>{children}</span>
      {IconRight ? <IconRight className={styles.icon} aria-hidden /> : null}
    </button>
  );
}
