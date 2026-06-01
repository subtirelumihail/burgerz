import { cn } from "@/lib/cn";

import styles from "./Container.module.css";
import type { ContainerProps } from "./types";

export function Container({
  children,
  className,
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component className={cn(styles.root, className)}>{children}</Component>
  );
}
