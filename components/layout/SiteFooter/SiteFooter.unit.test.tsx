import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("renders attribution", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      "Made with love by Mihail Subtirelu",
    );
  });
});
