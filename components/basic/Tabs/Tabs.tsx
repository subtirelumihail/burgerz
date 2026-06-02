"use client";

import { cn } from "@/lib/cn";
import { useTabs } from "@/hooks/useTabs";

import { getTabChildren, type TabsProps } from "./types";

import styles from "./Tabs.module.css";

export function Tabs<T extends string>({
  defaultTabId,
  ariaLabel,
  className,
  children,
}: TabsProps<T>) {
  const parsedTabs = getTabChildren<T>(children);

  const { tabListId, isTabActive, getTabButtonProps, getTabPanelProps } =
    useTabs({
      tabs: parsedTabs,
      defaultTabId,
    });

  return (
    <div className={cn(styles.root, className)}>
      <div
        role="tablist"
        id={tabListId}
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className={styles.tabList}
      >
        {parsedTabs.map((tab) => {
          const isActive = isTabActive(tab.id);

          return (
            <button
              key={tab.id}
              type="button"
              className={cn(styles.tab, isActive && styles.tabActive)}
              {...getTabButtonProps(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {parsedTabs.map((tab) => (
        <div
          key={tab.id}
          {...getTabPanelProps(tab.id)}
          className={cn(
            styles.panel,
            !isTabActive(tab.id) && styles.panelHidden,
          )}
        >
          {isTabActive(tab.id) ? tab.content : null}
        </div>
      ))}
    </div>
  );
}

export { Tab } from "./components/Tab/Tab";
