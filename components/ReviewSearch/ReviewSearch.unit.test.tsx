import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ReviewSearch } from "./ReviewSearch";

describe("ReviewSearch", () => {
  it("submits search without navigation", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(
      <ReviewSearch
        query="juicy"
        onQueryChange={vi.fn()}
        onSearch={onSearch}
        onClear={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("shows loading state on the search button", () => {
    render(
      <ReviewSearch
        query=""
        onQueryChange={vi.fn()}
        onSearch={vi.fn()}
        onClear={vi.fn()}
        isLoading
      />,
    );

    expect(screen.getByRole("button", { name: "Search" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("shows clear search when the query has text", () => {
    render(
      <ReviewSearch
        query="alex"
        onQueryChange={vi.fn()}
        onSearch={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Clear search" }),
    ).toBeInTheDocument();
  });

  it("calls onClear when clear search is clicked", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(
      <ReviewSearch
        query="alex"
        onQueryChange={vi.fn()}
        onSearch={vi.fn()}
        onClear={onClear}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Clear search" }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
