export interface SkeletonProps {
  className?: string;
}

export type SkeletonLineWidth =
  | "third"
  | "half"
  | "twoThirds"
  | "threeQuarters"
  | "full";

export type SkeletonLineHeight = "sm" | "lg";

export interface SkeletonLineProps extends SkeletonProps {
  width?: SkeletonLineWidth;
  height?: SkeletonLineHeight;
}

export type SkeletonBlockHeight = "sm" | "md";

export interface SkeletonBlockProps extends SkeletonProps {
  height?: SkeletonBlockHeight;
}

export type SkeletonImageSize = "sm" | "md" | "fluid";

export interface SkeletonImageProps extends SkeletonProps {
  size?: SkeletonImageSize;
}
