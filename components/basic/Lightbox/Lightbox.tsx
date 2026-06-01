"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

import type { LightboxProps } from "./types";

import styles from "./Lightbox.module.css";

export function Lightbox({ isOpen, onClose, image, alt }: LightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const frameStyle = {
    "--image-max-width": `${image.width}px`,
    "--image-max-height": `${image.height}px`,
    "--image-aspect-ratio": `${image.width / image.height}`,
  } as CSSProperties;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Close image preview"
      />
      <button
        ref={closeButtonRef}
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <div className={styles.imageWrap}>
        <div className={styles.imageFrame} style={frameStyle}>
          <Image
            src={image.fullUrl}
            alt={alt}
            width={image.width}
            height={image.height}
            className={styles.image}
            sizes={`(max-width: ${image.width}px) 100vw, ${image.width}px`}
            priority
          />
        </div>
      </div>
    </div>
  );
}
