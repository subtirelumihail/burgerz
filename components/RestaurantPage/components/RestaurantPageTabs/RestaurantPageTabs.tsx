"use client";

import { useId, useState } from "react";

import { RestaurantBurgers } from "@/components/RestaurantBurgers/RestaurantBurgers";
import { RestaurantReviews } from "@/components/RestaurantReviews/RestaurantReviews";
import { cn } from "@/lib/cn";

import type { RestaurantPageTab, RestaurantPageTabsProps } from "./types";

import styles from "./RestaurantPageTabs.module.css";

const TABS: { id: RestaurantPageTab; label: string }[] = [
  { id: "reviews", label: "Reviews" },
  { id: "menu", label: "Burgers Menu" },
];

export function RestaurantPageTabs({ restaurantId }: RestaurantPageTabsProps) {
  const [activeTab, setActiveTab] = useState<RestaurantPageTab>("reviews");
  const tabListId = useId();

  return (
    <div className={styles.root}>
      <div
        role="tablist"
        id={tabListId}
        aria-label="Restaurant sections"
        className={styles.tabList}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const tabId = `${tabListId}-${tab.id}-tab`;
          const panelId = `${tabListId}-${tab.id}-panel`;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={tabId}
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              className={cn(styles.tab, isActive && styles.tabActive)}
              onClick={() => {
                setActiveTab(tab.id);
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${tabListId}-reviews-panel`}
        aria-labelledby={`${tabListId}-reviews-tab`}
        hidden={activeTab !== "reviews"}
        className={cn(
          styles.panel,
          activeTab !== "reviews" && styles.panelHidden,
        )}
      >
        {activeTab === "reviews" ? (
          <RestaurantReviews restaurantId={restaurantId} />
        ) : null}
      </div>

      <div
        role="tabpanel"
        id={`${tabListId}-menu-panel`}
        aria-labelledby={`${tabListId}-menu-tab`}
        hidden={activeTab !== "menu"}
        className={cn(styles.panel, activeTab !== "menu" && styles.panelHidden)}
      >
        {activeTab === "menu" ? (
          <RestaurantBurgers restaurantId={restaurantId} />
        ) : null}
      </div>
    </div>
  );
}
