"use client";

import { useId, useState, type KeyboardEvent } from "react";

import type {
  TabButtonProps,
  TabPanelProps,
  UseTabsOptions,
  UseTabsResult,
} from "@/components/basic/Tabs/types";

export function useTabs<T extends string>({
  tabs,
  defaultTabId,
}: UseTabsOptions<T>): UseTabsResult<T> {
  const [activeTabId, setActiveTabId] = useState(defaultTabId);
  const tabListId = useId();

  function getTabButtonId(tabId: T) {
    return `${tabListId}-${tabId}-tab`;
  }

  function getTabPanelId(tabId: T) {
    return `${tabListId}-${tabId}-panel`;
  }

  function focusTab(tabId: T) {
    document.getElementById(getTabButtonId(tabId))?.focus();
  }

  function getFocusedTabIndex() {
    const activeElement = document.activeElement;

    return tabs.findIndex(
      (tab) =>
        document.getElementById(getTabButtonId(tab.id)) === activeElement,
    );
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, tabId: T) {
    const currentIndex = getFocusedTabIndex();
    const startIndex =
      currentIndex === -1
        ? tabs.findIndex((tab) => tab.id === activeTabId)
        : currentIndex;
    let nextIndex: number | null = null;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (startIndex + 1) % tabs.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (startIndex - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        setActiveTabId(tabId);
        return;
      default:
        return;
    }

    event.preventDefault();
    focusTab(tabs[nextIndex].id);
  }

  function isTabActive(tabId: T) {
    return activeTabId === tabId;
  }

  function getTabButtonProps(tabId: T): TabButtonProps {
    return {
      id: getTabButtonId(tabId),
      role: "tab",
      "aria-selected": isTabActive(tabId),
      "aria-controls": getTabPanelId(tabId),
      onClick: () => {
        setActiveTabId(tabId);
      },
      onKeyDown: (event) => {
        handleTabKeyDown(event, tabId);
      },
    };
  }

  function getTabPanelProps(tabId: T): TabPanelProps {
    return {
      id: getTabPanelId(tabId),
      role: "tabpanel",
      "aria-labelledby": getTabButtonId(tabId),
      hidden: !isTabActive(tabId),
    };
  }

  return {
    activeTabId,
    setActiveTabId,
    tabListId,
    isTabActive,
    getTabButtonProps,
    getTabPanelProps,
  };
}
