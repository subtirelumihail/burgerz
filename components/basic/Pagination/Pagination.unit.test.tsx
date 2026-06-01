import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders nothing when there is only one page", () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onPageChange={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders page controls and highlights the current page", () => {
    render(<Pagination page={2} totalPages={3} onPageChange={vi.fn()} />);

    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to page 2" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("calls onPageChange when a page button is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "Go to page 3" }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("disables navigation while loading", () => {
    render(
      <Pagination page={2} totalPages={3} onPageChange={vi.fn()} isLoading />,
    );

    expect(
      screen.getByRole("button", { name: "Go to previous page" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Go to next page" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Go to page 1" })).toBeDisabled();
  });
});
