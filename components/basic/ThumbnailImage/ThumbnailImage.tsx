"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/cn";

import type { ThumbnailImageProps } from "./types";

import styles from "./ThumbnailImage.module.css";

export function ThumbnailImage({
  src,
  alt,
  width,
  height,
  className,
  imageClassName,
  priority = false,
  sizes,
}: ThumbnailImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const isLoaded = loadedSrc === src;

  return (
    <span
      className={cn(styles.root, className)}
      style={{ width, height }}
      aria-busy={!isLoaded || undefined}
    >
      {!isLoaded ? (
        <>
          <span className={styles.loader} aria-hidden />
          <span className={styles.srOnly} role="status">
            Loading image
          </span>
        </>
      ) : null}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          styles.image,
          isLoaded ? styles.imageLoaded : styles.imageLoading,
          imageClassName,
        )}
        priority={priority}
        sizes={sizes}
        onLoad={() => setLoadedSrc(src)}
      />
    </span>
  );
}
