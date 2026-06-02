import {
  Children,
  isValidElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";

import { Tab } from "./components/Tab/Tab";
import type { TabProps } from "./components/Tab/types";

export type { TabProps } from "./components/Tab/types";
export { Tab } from "./components/Tab/Tab";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
}

export interface UseTabsOptions<T extends string> {
  tabs: readonly TabItem<T>[];
  defaultTabId: T;
}

export type TabButtonKeyDownEvent = Parameters<
  NonNullable<ComponentProps<"button">["onKeyDown"]>
>[0];

export interface TabButtonProps {
  id: string;
  role: "tab";
  "aria-selected": boolean;
  "aria-controls": string;
  onClick: () => void;
  onKeyDown: (event: TabButtonKeyDownEvent) => void;
}

export interface TabPanelProps {
  id: string;
  role: "tabpanel";
  "aria-labelledby": string;
  hidden: boolean;
}

export interface UseTabsResult<T extends string> {
  activeTabId: T;
  setActiveTabId: (tabId: T) => void;
  tabListId: string;
  isTabActive: (tabId: T) => boolean;
  getTabButtonProps: (tabId: T) => TabButtonProps;
  getTabPanelProps: (tabId: T) => TabPanelProps;
}

export interface TabsProps<T extends string = string> {
  defaultTabId: T;
  ariaLabel: string;
  className?: string;
  children: ReactNode;
}

export interface ParsedTab<T extends string = string> {
  id: T;
  label: string;
  content: ReactNode;
}

export function getTabChildren<T extends string>(
  children: ReactNode,
): ParsedTab<T>[] {
  return Children.toArray(children)
    .filter(
      (child): child is ReactElement<TabProps<T>> =>
        isValidElement(child) && child.type === Tab,
    )
    .map((child) => ({
      id: child.props.id,
      label: child.props.label,
      content: child.props.children,
    }));
}
