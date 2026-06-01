import type { ImageAsset } from "@/types/image";

export interface ImageThumbnailProps {
  image: ImageAsset;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  onImageLoad?: () => void;
}
