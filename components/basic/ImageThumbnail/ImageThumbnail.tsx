"use client";

import { useState } from "react";

import { Lightbox } from "@/components/basic/Lightbox/Lightbox";
import { ThumbnailImage } from "@/components/basic/ThumbnailImage/ThumbnailImage";
import { cn } from "@/lib/cn";

import type { ImageThumbnailProps } from "./types";

import styles from "./ImageThumbnail.module.css";

export function ImageThumbnail({
  image,
  alt,
  width,
  height,
  className,
  imageClassName,
  priority = false,
  sizes,
  onImageLoad,
}: ImageThumbnailProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={cn(styles.trigger, className)}
        onClick={() => setIsOpen(true)}
        aria-label={`View full size: ${alt}`}
      >
        <ThumbnailImage
          src={image.thumbnailUrl}
          alt={alt}
          width={width}
          height={height}
          imageClassName={imageClassName}
          priority={priority}
          sizes={sizes}
          fitContainer
          onImageLoad={onImageLoad}
        />
      </button>
      <Lightbox
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        image={image}
        alt={alt}
      />
    </>
  );
}
