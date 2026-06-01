import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FiSearch } from "react-icons/fi";

import { Input } from "./Input";

describe("Input", () => {
  it("associates label with input", () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows error message and aria-invalid", () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("renders a left icon when iconLeft is provided", () => {
    render(<Input label="Search" iconLeft={FiSearch} />);
    const input = screen.getByLabelText("Search");
    expect(input.parentElement?.querySelector("svg")).toBeInTheDocument();
  });
});
