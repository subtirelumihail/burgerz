/** Maximum review photo upload size (5 MB). */
export const MAX_UPLOAD_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export function formatUploadImageMaxSize(
  bytes: number = MAX_UPLOAD_IMAGE_SIZE_BYTES,
): string {
  if (bytes >= 1024 * 1024) {
    const megabytes = bytes / (1024 * 1024);
    return Number.isInteger(megabytes)
      ? `${megabytes} MB`
      : `${megabytes.toFixed(1)} MB`;
  }

  const kilobytes = bytes / 1024;
  return `${Math.round(kilobytes)} KB`;
}

export function getUploadImageSizeErrorMessage(
  maxSizeBytes: number = MAX_UPLOAD_IMAGE_SIZE_BYTES,
): string {
  return `Image must be ${formatUploadImageMaxSize(maxSizeBytes)} or smaller.`;
}

export function isUploadImageWithinSizeLimit(
  file: File,
  maxSizeBytes: number = MAX_UPLOAD_IMAGE_SIZE_BYTES,
): boolean {
  return file.size <= maxSizeBytes;
}

export interface ValidateUploadImageFileOptions {
  maxSizeBytes?: number;
}

export type ValidateUploadImageFileResult =
  | { valid: true }
  | { valid: false; message: string };

export function validateUploadImageFile(
  file: File,
  options: ValidateUploadImageFileOptions = {},
): ValidateUploadImageFileResult {
  const maxSizeBytes = options.maxSizeBytes ?? MAX_UPLOAD_IMAGE_SIZE_BYTES;

  if (!file.type.startsWith("image/")) {
    return { valid: false, message: "Please choose an image file." };
  }

  if (!isUploadImageWithinSizeLimit(file, maxSizeBytes)) {
    return {
      valid: false,
      message: getUploadImageSizeErrorMessage(maxSizeBytes),
    };
  }

  return { valid: true };
}

export function getUploadImageSizeHint(
  maxSizeBytes: number = MAX_UPLOAD_IMAGE_SIZE_BYTES,
): string {
  return `Max file size: ${formatUploadImageMaxSize(maxSizeBytes)}.`;
}
