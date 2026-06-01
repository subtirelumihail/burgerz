import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { IconType } from "react-icons";

export type ButtonVariant = "primary" | "secondary" | "link" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  iconLeft?: IconType;
  iconRight?: IconType;
  children: ReactNode;
  isLoading?: boolean;
}
