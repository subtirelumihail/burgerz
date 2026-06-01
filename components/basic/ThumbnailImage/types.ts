export interface ThumbnailImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  fitContainer?: boolean;
  onImageLoad?: () => void;
}
