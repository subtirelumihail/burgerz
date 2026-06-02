import { describe, expect, it } from "vitest";

import {
  formatUploadImageMaxSize,
  getUploadImageSizeErrorMessage,
  getUploadImageSizeHint,
  isUploadImageWithinSizeLimit,
  MAX_UPLOAD_IMAGE_SIZE_BYTES,
  validateUploadImageFile,
} from "./upload-image";

describe("upload-image", () => {
  it("formats megabyte limits for display", () => {
    expect(formatUploadImageMaxSize(MAX_UPLOAD_IMAGE_SIZE_BYTES)).toBe("5 MB");
    expect(formatUploadImageMaxSize(2 * 1024 * 1024)).toBe("2 MB");
  });

  it("builds size hint and error copy", () => {
    expect(getUploadImageSizeHint()).toBe("Max file size: 5 MB.");
    expect(getUploadImageSizeErrorMessage()).toBe(
      "Image must be 5 MB or smaller.",
    );
  });

  it("checks whether a file is within the size limit", () => {
    const smallFile = new File(["a"], "small.png", { type: "image/png" });
    const largeFile = new File(
      [new ArrayBuffer(MAX_UPLOAD_IMAGE_SIZE_BYTES + 1)],
      "large.png",
      { type: "image/png" },
    );

    expect(isUploadImageWithinSizeLimit(smallFile)).toBe(true);
    expect(isUploadImageWithinSizeLimit(largeFile)).toBe(false);
  });

  it("rejects non-image files and oversized images", () => {
    const imageFile = new File(["a"], "burger.png", { type: "image/png" });
    const textFile = new File(["a"], "notes.txt", { type: "text/plain" });
    const largeFile = new File(
      [new ArrayBuffer(MAX_UPLOAD_IMAGE_SIZE_BYTES + 1)],
      "large.png",
      { type: "image/png" },
    );

    expect(validateUploadImageFile(imageFile)).toEqual({ valid: true });
    expect(validateUploadImageFile(textFile)).toEqual({
      valid: false,
      message: "Please choose an image file.",
    });
    expect(validateUploadImageFile(largeFile)).toEqual({
      valid: false,
      message: "Image must be 5 MB or smaller.",
    });
  });
});
