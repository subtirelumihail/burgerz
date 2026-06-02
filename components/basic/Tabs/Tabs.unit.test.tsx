import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Tab, Tabs } from "./Tabs";

describe("Tabs", () => {
  it("renders tabs and shows the default panel", () => {
    render(
      <Tabs defaultTabId="first" ariaLabel="Example tabs">
        <Tab id="first" label="First">
          <p>first panel</p>
        </Tab>
        <Tab id="second" label="Second">
          <p>second panel</p>
        </Tab>
      </Tabs>,
    );

    expect(screen.getByRole("tab", { name: /first/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("first panel")).toBeInTheDocument();
    expect(screen.queryByText("second panel")).not.toBeInTheDocument();
  });

  it("moves focus with tab key but only selects on enter", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultTabId="first" ariaLabel="Example tabs">
        <Tab id="first" label="First">
          <p>first panel</p>
        </Tab>
        <Tab id="second" label="Second">
          <p>second panel</p>
        </Tab>
      </Tabs>,
    );

    const firstTab = screen.getByRole("tab", { name: /first/i });
    const secondTab = screen.getByRole("tab", { name: /second/i });

    await user.tab();
    expect(firstTab).toHaveFocus();

    await user.tab();
    expect(secondTab).toHaveFocus();
    expect(secondTab).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText("first panel")).toBeInTheDocument();

    await user.keyboard("{Enter}");
    expect(secondTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("second panel")).toBeInTheDocument();
  });

  it("moves focus with arrow keys but only selects on enter", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultTabId="first" ariaLabel="Example tabs">
        <Tab id="first" label="First">
          <p>first panel</p>
        </Tab>
        <Tab id="second" label="Second">
          <p>second panel</p>
        </Tab>
      </Tabs>,
    );

    const firstTab = screen.getByRole("tab", { name: /first/i });
    const secondTab = screen.getByRole("tab", { name: /second/i });

    firstTab.focus();
    await user.keyboard("{ArrowRight}");

    expect(secondTab).toHaveFocus();
    expect(secondTab).toHaveAttribute("aria-selected", "false");

    await user.keyboard("{Enter}");

    expect(secondTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("second panel")).toBeInTheDocument();
  });

  it("selects a tab on click", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultTabId="first" ariaLabel="Example tabs">
        <Tab id="first" label="First">
          <p>first panel</p>
        </Tab>
        <Tab id="second" label="Second">
          <p>second panel</p>
        </Tab>
      </Tabs>,
    );

    await user.click(screen.getByRole("tab", { name: /second/i }));

    expect(screen.getByRole("tab", { name: /second/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("second panel")).toBeInTheDocument();
  });
});
