import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("associates label with textarea", () => {
    render(<Textarea label="Notes" name="notes" />);
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
  });

  it("shows hint when there is no error", () => {
    render(<Textarea label="Notes" hint="Keep it short" />);
    expect(screen.getByText("Keep it short")).toBeInTheDocument();
  });
});
