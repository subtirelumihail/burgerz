import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createBurgerReview } from "@/lib/services/review.service";

import { AddBurgerReviewForm } from "./AddBurgerReviewForm";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("@/lib/services/review.service", () => ({
  createBurgerReview: vi.fn(),
}));

describe("AddBurgerReviewForm", () => {
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

  it("renders all form fields and actions", () => {
    render(<AddBurgerReviewForm burgerId="burger-1" />);

    expect(
      screen.getByRole("form", { name: "Add burger review" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Your name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Taste")).toBeInTheDocument();
    expect(screen.getByLabelText("Texture")).toBeInTheDocument();
    expect(screen.getByLabelText("Visual presentation")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Submit review" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("submits the form when required fields are filled", async () => {
    const user = userEvent.setup();

    render(<AddBurgerReviewForm burgerId="burger-1" />);

    await user.type(screen.getByLabelText("Your name"), "Alex");
    await user.type(screen.getByLabelText("Description"), "Great burger");
    await user.click(screen.getByRole("button", { name: "Submit review" }));

    expect(createBurgerReview).toHaveBeenCalledWith("burger-1", {
      authorName: "Alex",
      text: "Great burger",
      aspects: {
        taste: 3,
        texture: 3,
        visualPresentation: 3,
      },
    });
    expect(mockPush).toHaveBeenCalledWith("/burgers/burger-1");
  });

  it("navigates back to the burger page on cancel", async () => {
    const user = userEvent.setup();

    render(<AddBurgerReviewForm burgerId="burger-1" />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockPush).toHaveBeenCalledWith("/burgers/burger-1");
  });
});
