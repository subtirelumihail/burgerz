import type { InputHTMLAttributes } from "react";

export interface UploadImageProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "value"
> {
  label: string;
  onImageChange?: (file: File | null, previewUrl: string | null) => void;
  error?: string;
  hint?: string;
  initialPreviewUrl?: string | null;
}
