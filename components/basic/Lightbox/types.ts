import type { ImageAsset } from "@/types/image";

export interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  image: ImageAsset;
  alt: string;
}
