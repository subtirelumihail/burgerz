import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RestaurantSort } from "./RestaurantSort";

describe("RestaurantSort", () => {
  it("changes sort option", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();

    render(
      <RestaurantSort
        sort="nearby"
        onSortChange={onSortChange}
        needsLocationAccess={false}
        onEnableLocation={vi.fn()}
      />,
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Sort by" }),
      "name-desc",
    );

    expect(onSortChange).toHaveBeenCalledWith("name-desc");
  });

  it("changes sort option to name ascending", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();

    render(
      <RestaurantSort
        sort="nearby"
        onSortChange={onSortChange}
        needsLocationAccess={false}
        onEnableLocation={vi.fn()}
      />,
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Sort by" }),
      "name",
    );

    expect(onSortChange).toHaveBeenCalledWith("name");
  });

  it("shows location notice and disables nearby when location is needed", () => {
    render(
      <RestaurantSort
        sort="nearby"
        onSortChange={vi.fn()}
        needsLocationAccess
        onEnableLocation={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("status", {
        name: undefined,
      }),
    ).toHaveTextContent(/location access is needed/i);
    expect(screen.getByRole("option", { name: "Near By" })).toBeDisabled();
    expect(screen.getByRole("combobox", { name: "Sort by" })).toHaveValue(
      "name",
    );
  });

  it("requests location from the notice", async () => {
    const user = userEvent.setup();
    const onEnableLocation = vi.fn();

    render(
      <RestaurantSort
        sort="nearby"
        onSortChange={vi.fn()}
        needsLocationAccess
        onEnableLocation={onEnableLocation}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Enable location" }));

    expect(onEnableLocation).toHaveBeenCalledTimes(1);
  });
});
