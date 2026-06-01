import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FiArrowRight } from "react-icons/fi";

import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Order now</Button>);
    expect(
      screen.getByRole("button", { name: "Order now" }),
    ).toBeInTheDocument();
  });

  it("renders left and right icons", () => {
    render(
      <Button iconLeft={FiArrowRight} iconRight={FiArrowRight}>
        Go
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Go" });
    expect(button.querySelectorAll("svg")).toHaveLength(2);
  });

  it("applies variant class", () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button", { name: "Secondary" }).className).toMatch(
      /secondary/,
    );
  });
});
