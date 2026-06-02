import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { TabButtonKeyDownEvent } from "@/components/basic/Tabs/types";

import { useTabs } from "./useTabs";

const TABS = [
  { id: "first", label: "First" },
  { id: "second", label: "Second" },
] as const;

describe("useTabs", () => {
  it("starts on the default tab", () => {
    const { result } = renderHook(() =>
      useTabs({ tabs: TABS, defaultTabId: "first" }),
    );

    expect(result.current.activeTabId).toBe("first");
    expect(result.current.isTabActive("first")).toBe(true);
    expect(result.current.isTabActive("second")).toBe(false);
  });

  it("updates the active tab", () => {
    const { result } = renderHook(() =>
      useTabs({ tabs: TABS, defaultTabId: "first" }),
    );

    act(() => {
      result.current.setActiveTabId("second");
    });

    expect(result.current.activeTabId).toBe("second");
    expect(result.current.getTabButtonProps("second")["aria-selected"]).toBe(
      true,
    );
    expect(result.current.getTabPanelProps("second").hidden).toBe(false);
  });

  it("activates a tab on enter keydown", () => {
    const { result } = renderHook(() =>
      useTabs({ tabs: TABS, defaultTabId: "first" }),
    );

    act(() => {
      result.current.getTabButtonProps("second").onKeyDown({
        key: "Enter",
        preventDefault: () => {},
      } as TabButtonKeyDownEvent);
    });

    expect(result.current.activeTabId).toBe("second");
  });
});
