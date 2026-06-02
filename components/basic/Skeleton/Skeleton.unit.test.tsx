import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Skeleton,
  SkeletonBlock,
  SkeletonImage,
  SkeletonLine,
} from "./Skeleton";

describe("Skeleton", () => {
  it("renders a hidden placeholder element", () => {
    const { container } = render(<Skeleton className="custom" />);

    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    expect(container.firstChild).toHaveClass("custom");
  });
});

describe("SkeletonLine", () => {
  it("renders with width and height variants", () => {
    const { container } = render(
      <SkeletonLine width="twoThirds" height="lg" />,
    );

    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    expect(container.firstChild?.className).toMatch(/lineWidthTwoThirds/);
    expect(container.firstChild?.className).toMatch(/lineHeightLg/);
  });
});

describe("SkeletonBlock", () => {
  it("renders with height variants", () => {
    const { container } = render(<SkeletonBlock height="md" />);

    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    expect(container.firstChild?.className).toMatch(/blockHeightMd/);
  });
});

describe("SkeletonImage", () => {
  it("renders with size variants", () => {
    const { container } = render(<SkeletonImage size="fluid" />);

    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    expect(container.firstChild?.className).toMatch(/imageSizeFluid/);
  });
});
