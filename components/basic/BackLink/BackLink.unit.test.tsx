import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BackLink } from "./BackLink";

describe("BackLink", () => {
  it("renders a link with label and chevron icon", () => {
    render(<BackLink href="/burgers">Back to burgers</BackLink>);

    const link = screen.getByRole("link", { name: "Back to burgers" });
    expect(link).toHaveAttribute("href", "/burgers");
    expect(link.querySelector("svg")).toBeInTheDocument();
  });
});
