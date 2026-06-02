"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { FiImage, FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/basic/Button/Button";
import { cn } from "@/lib/cn";
import {
  getUploadImageSizeHint,
  MAX_UPLOAD_IMAGE_SIZE_BYTES,
  validateUploadImageFile,
} from "@/lib/upload-image";

import styles from "./UploadImage.module.css";
import type { UploadImageProps } from "./types";

export function UploadImage({
  label,
  onImageChange,
  error,
  hint,
  maxSizeBytes = MAX_UPLOAD_IMAGE_SIZE_BYTES,
  id: idProp,
  accept = "image/*",
  initialPreviewUrl = null,
  disabled,
  className,
  ...props
}: UploadImageProps) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialPreviewUrl,
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const displayError = error ?? validationError ?? undefined;
  const hasError = Boolean(displayError);
  const sizeHint = getUploadImageSizeHint(maxSizeBytes);
  const displayHint = hint ? `${hint} ${sizeHint}` : sizeHint;

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function clearInputValue() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleFileChange(file: File | null) {
    if (!file) {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }

      setValidationError(null);
      setPreviewUrl(null);
      onImageChange?.(null, null);
      return;
    }

    const validation = validateUploadImageFile(file, { maxSizeBytes });

    if (!validation.valid) {
      setValidationError(validation.message);
      clearInputValue();
      return;
    }

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setValidationError(null);
    const nextPreview = URL.createObjectURL(file);
    setPreviewUrl(nextPreview);
    onImageChange?.(file, nextPreview);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    handleFileChange(file);
  }

  function handleClear() {
    clearInputValue();
    handleFileChange(null);
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  const describedBy = [hasError ? errorId : null, !hasError ? hintId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn(styles.field, className)}>
      <span id={`${inputId}-label`} className={styles.label}>
        {label}
      </span>
      <div className={styles.wrapper}>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          className={styles.input}
          onChange={handleInputChange}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy || undefined}
          aria-labelledby={`${inputId}-label`}
          {...props}
        />
        {previewUrl ? (
          <div className={styles.dropzone}>
            <Image
              src={previewUrl}
              alt="Selected image preview"
              width={256}
              height={192}
              className={styles.preview}
              unoptimized
            />
            <div className={styles.actions}>
              <Button
                type="button"
                variant="secondary"
                onClick={openFilePicker}
              >
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                iconLeft={FiTrash2}
                onClick={handleClear}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <label htmlFor={inputId} className={styles.dropzone}>
            <FiImage size={32} aria-hidden />
            <p className={styles.prompt}>
              <span className={styles.promptAccent}>Choose an image</span> or
              drag and drop
            </p>
            <p className={styles.limits}>{sizeHint}</p>
          </label>
        )}
      </div>
      {!hasError ? (
        <p id={hintId} className={styles.hint}>
          {displayHint}
        </p>
      ) : null}
      {hasError ? (
        <p id={errorId} className={styles.error} role="alert">
          {displayError}
        </p>
      ) : null}
    </div>
  );
}
