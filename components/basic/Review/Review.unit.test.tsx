import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Review } from "./Review";

describe("Review", () => {
  it("announces star rating without duplicating the numeric score", () => {
    render(<Review score={4.5} reviewCount={12} />);

    expect(
      screen.getByText("4.5 out of 5 stars based on 12 reviews"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("4.5").closest("[aria-hidden='true']"),
    ).not.toBeNull();
    expect(
      screen.getByText("(12 reviews)").closest("[aria-hidden='true']"),
    ).not.toBeNull();
  });

  it("groups labeled ratings for screen readers", () => {
    render(<Review score={4} label="Overall" size="sm" />);

    expect(
      screen.getByText("Overall rating, 4 out of 5 stars"),
    ).toBeInTheDocument();
  });
});
