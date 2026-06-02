import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { RadioButton } from "./RadioButton";

describe("RadioButton", () => {
  it("associates label with radio input", () => {
    render(<RadioButton label="Small" name="size" value="sm" />);
    expect(screen.getByLabelText("Small")).toBeInTheDocument();
  });

  it("renders as a radio input with name and value", () => {
    render(<RadioButton label="Medium" name="size" value="md" />);
    const input = screen.getByRole("radio", { name: "Medium" });
    expect(input).toHaveAttribute("name", "size");
    expect(input).toHaveAttribute("value", "md");
  });

  it("supports checked state", () => {
    render(<RadioButton label="Large" name="size" value="lg" defaultChecked />);
    expect(screen.getByRole("radio", { name: "Large" })).toBeChecked();
  });

  it("can be selected by clicking the label", async () => {
    const user = userEvent.setup();
    render(<RadioButton label="Extra large" name="size" value="xl" />);
    const input = screen.getByRole("radio", { name: "Extra large" });
    expect(input).not.toBeChecked();
    await user.click(screen.getByText("Extra large"));
    expect(input).toBeChecked();
  });

  it("does not allow selection when disabled", async () => {
    const user = userEvent.setup();
    render(
      <RadioButton label="Disabled" name="size" value="disabled" disabled />,
    );
    const input = screen.getByRole("radio", { name: "Disabled" });
    expect(input).toBeDisabled();
    await user.click(screen.getByText("Disabled"));
    expect(input).not.toBeChecked();
  });
});
