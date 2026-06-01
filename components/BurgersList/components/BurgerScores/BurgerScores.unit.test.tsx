import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BurgerScores } from "./BurgerScores";

const scores = {
  taste: 4.8,
  texture: 4.5,
  visualPresentation: 4.4,
};

describe("BurgerScores", () => {
  it("announces each aspect score as readable text for screen readers", () => {
    render(<BurgerScores scores={scores} />);

    expect(
      screen.getByRole("list", { name: "Aspect scores" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Taste, 4.8 out of 5")).toBeInTheDocument();
    expect(screen.getByText("Texture, 4.5 out of 5")).toBeInTheDocument();
    expect(
      screen.getByText("Visual presentation, 4.4 out of 5"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Taste").closest("[aria-hidden='true']"),
    ).not.toBeNull();
  });

  it("rounds scores when decimals is 0", () => {
    render(<BurgerScores scores={scores} decimals={0} />);

    expect(screen.getByText("Taste, 5 out of 5")).toBeInTheDocument();
  });
});
