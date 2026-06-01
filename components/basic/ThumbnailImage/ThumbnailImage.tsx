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
  fitContainer = false,
}: ThumbnailImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const isLoaded = loadedSrc === src;

  return (
    <span
      className={cn(
        styles.root,
        fitContainer ? styles.fitContainer : null,
        className,
      )}
      style={fitContainer ? undefined : { width, height }}
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
        loading={priority ? undefined : "lazy"}
        fetchPriority={priority ? "high" : "low"}
        sizes={sizes}
        onLoad={() => setLoadedSrc(src)}
      />
    </span>
  );
}
