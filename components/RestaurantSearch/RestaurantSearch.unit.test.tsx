import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RestaurantSearch } from "./RestaurantSearch";

describe("RestaurantSearch", () => {
  it("submits the search query", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(
      <RestaurantSearch
        query="smash"
        onQueryChange={vi.fn()}
        onSearch={onSearch}
        onClear={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("clears the search when clear is clicked", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(
      <RestaurantSearch
        query="smash"
        onQueryChange={vi.fn()}
        onSearch={vi.fn()}
        onClear={onClear}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Clear search" }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
