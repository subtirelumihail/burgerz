import { cn } from "@/lib/cn";

import type {
  SkeletonBlockProps,
  SkeletonImageProps,
  SkeletonLineProps,
  SkeletonProps,
} from "./types";

import styles from "./Skeleton.module.css";

const lineWidthClass = {
  third: styles.lineWidthThird,
  half: styles.lineWidthHalf,
  twoThirds: styles.lineWidthTwoThirds,
  threeQuarters: styles.lineWidthThreeQuarters,
  full: undefined,
} as const;

const lineHeightClass = {
  sm: styles.lineHeightSm,
  lg: styles.lineHeightLg,
} as const;

const blockHeightClass = {
  sm: styles.blockHeightSm,
  md: styles.blockHeightMd,
} as const;

const imageSizeClass = {
  sm: styles.imageSizeSm,
  md: styles.imageSizeMd,
  fluid: styles.imageSizeFluid,
} as const;

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn(styles.root, className)} aria-hidden />;
}

export function SkeletonLine({
  className,
  width = "full",
  height = "sm",
}: SkeletonLineProps) {
  return (
    <div
      className={cn(
        styles.root,
        styles.line,
        lineHeightClass[height],
        lineWidthClass[width],
        className,
      )}
      aria-hidden
    />
  );
}

export function SkeletonBlock({
  className,
  height = "sm",
}: SkeletonBlockProps) {
  return (
    <div
      className={cn(
        styles.root,
        styles.block,
        blockHeightClass[height],
        className,
      )}
      aria-hidden
    />
  );
}

export function SkeletonImage({ className, size = "sm" }: SkeletonImageProps) {
  return (
    <div
      className={cn(styles.root, imageSizeClass[size], className)}
      aria-hidden
    />
  );
}
