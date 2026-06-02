import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import type { BurgerUserReviewRating } from "@/types/review";

import { RatingSlider } from "./RatingSlider";

function ControlledRatingSlider({
  initialValue = 3 as BurgerUserReviewRating,
}) {
  const [value, setValue] = useState<BurgerUserReviewRating>(initialValue);

  return (
    <RatingSlider label="Taste" value={value} onChange={setValue} id="taste" />
  );
}

describe("RatingSlider", () => {
  it("associates label with slider", () => {
    render(<ControlledRatingSlider />);
    expect(screen.getByLabelText("Taste")).toBeInTheDocument();
  });

  it("updates value from number input with integers only", async () => {
    const user = userEvent.setup();
    render(<ControlledRatingSlider />);

    const numberInput = screen.getByLabelText("Taste rating value");
    await user.clear(numberInput);
    await user.type(numberInput, "5");

    expect(numberInput).toHaveValue(5);
  });

  it("shows error message and aria-invalid", () => {
    render(
      <RatingSlider
        label="Texture"
        value={3}
        onChange={() => {}}
        error="Required"
        id="texture"
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Required");
    expect(screen.getByLabelText("Texture")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
