import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createBurgerReview } from "@/lib/services/review.service";

import { useAddReviewForm } from "./useAddReviewForm";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("@/lib/services/review.service", () => ({
  createBurgerReview: vi.fn(),
}));

function TestHarness({ burgerId }: { burgerId: string }) {
  const { register, onSubmit, errors, isSubmitting, handleCancel } =
    useAddReviewForm(burgerId);

  return (
    <div>
      <form aria-label="Add burger review" onSubmit={onSubmit}>
        <input aria-label="Your name" {...register("authorName")} />
        <textarea aria-label="Description" {...register("text")} />
        <button type="submit">Submit review</button>
      </form>
      {errors.authorName ? <p role="alert">{errors.authorName}</p> : null}
      {errors.text ? <p role="alert">{errors.text}</p> : null}
      {errors.submit ? <p role="alert">{errors.submit}</p> : null}
      {isSubmitting ? <p role="status">Submitting</p> : null}
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
}

describe("useAddReviewForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createBurgerReview).mockResolvedValue({
      id: "review-1",
      burgerId: "burger-1",
      authorName: "Alex",
      text: "Great burger",
      score: 4,
      aspects: {
        taste: { text: "Taste", score: 4 },
        texture: { text: "Texture", score: 4 },
        visualPresentation: {
          text: "Visual presentation",
          score: 4,
        },
      },
      createdAt: "2026-01-01T00:00:00.000Z",
    });
  });

  it("starts with empty fields and default ratings", () => {
    render(<TestHarness burgerId="burger-1" />);

    expect(screen.getByLabelText("Your name")).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");
  });

  it("sets validation errors when required fields are empty", async () => {
    const user = userEvent.setup();

    render(<TestHarness burgerId="burger-1" />);

    await user.click(screen.getByRole("button", { name: "Submit review" }));

    expect(
      await screen.findByText("Your name is required."),
    ).toBeInTheDocument();
    expect(screen.getByText("Description is required.")).toBeInTheDocument();
    expect(createBurgerReview).not.toHaveBeenCalled();
  });

  it("submits trimmed values and navigates on success", async () => {
    const user = userEvent.setup();

    render(<TestHarness burgerId="burger-1" />);

    await user.type(screen.getByLabelText("Your name"), "  Alex  ");
    await user.type(screen.getByLabelText("Description"), "  Great burger  ");
    await user.click(screen.getByRole("button", { name: "Submit review" }));

    await waitFor(() => {
      expect(createBurgerReview).toHaveBeenCalledWith("burger-1", {
        authorName: "Alex",
        text: "Great burger",
        aspects: {
          taste: 3,
          texture: 3,
          visualPresentation: 3,
        },
      });
    });

    expect(mockPush).toHaveBeenCalledWith("/burgers/burger-1");
  });

  it("surfaces submit errors when the API fails", async () => {
    vi.mocked(createBurgerReview).mockRejectedValue(new Error("Network error"));
    const user = userEvent.setup();

    render(<TestHarness burgerId="burger-1" />);

    await user.type(screen.getByLabelText("Your name"), "Alex");
    await user.type(screen.getByLabelText("Description"), "Great burger");
    await user.click(screen.getByRole("button", { name: "Submit review" }));

    expect(
      await screen.findByText(
        "Something went wrong while saving your review. Please try again.",
      ),
    ).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("navigates back on cancel", async () => {
    const user = userEvent.setup();

    render(<TestHarness burgerId="burger-1" />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockPush).toHaveBeenCalledWith("/burgers/burger-1");
  });
});
