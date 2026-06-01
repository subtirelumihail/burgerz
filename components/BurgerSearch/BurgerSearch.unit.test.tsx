import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BurgerSearch } from "./BurgerSearch";

describe("BurgerSearch", () => {
  it("submits search without navigation", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    const onQueryChange = vi.fn();

    render(
      <BurgerSearch
        query="garden"
        onQueryChange={onQueryChange}
        onSearch={onSearch}
        onClear={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("shows loading state on the search button", () => {
    render(
      <BurgerSearch
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
      <BurgerSearch
        query="garden"
        onQueryChange={vi.fn()}
        onSearch={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Clear search" }),
    ).toBeInTheDocument();
  });

  it("hides clear search when the query is empty", () => {
    render(
      <BurgerSearch
        query=""
        onQueryChange={vi.fn()}
        onSearch={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Clear search" }),
    ).not.toBeInTheDocument();
  });

  it("calls onClear when clear search is clicked", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(
      <BurgerSearch
        query="garden"
        onQueryChange={vi.fn()}
        onSearch={vi.fn()}
        onClear={onClear}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Clear search" }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
