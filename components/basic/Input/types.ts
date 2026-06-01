import type { InputHTMLAttributes } from "react";
import type { IconType } from "react-icons";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  iconLeft?: IconType;
}
