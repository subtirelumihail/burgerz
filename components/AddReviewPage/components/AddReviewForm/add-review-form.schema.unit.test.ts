import { describe, expect, it } from "vitest";

import { addReviewFormSchema } from "./add-review-form.schema";

describe("addReviewFormSchema", () => {
  it("accepts valid values", () => {
    const result = addReviewFormSchema.safeParse({
      authorName: "Alex",
      text: "Great burger",
      aspects: {
        taste: 5,
        texture: 4,
        visualPresentation: 3,
      },
    });

    expect(result.success).toBe(true);
  });

  it("trims author name and description", () => {
    const result = addReviewFormSchema.parse({
      authorName: "  Alex  ",
      text: "  Great burger  ",
      aspects: {
        taste: 3,
        texture: 3,
        visualPresentation: 3,
      },
    });

    expect(result.authorName).toBe("Alex");
    expect(result.text).toBe("Great burger");
  });

  it("rejects empty required fields", () => {
    const result = addReviewFormSchema.safeParse({
      authorName: "   ",
      text: "",
      aspects: {
        taste: 3,
        texture: 3,
        visualPresentation: 3,
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual([
        "Your name is required.",
        "Description is required.",
      ]);
    }
  });
});
