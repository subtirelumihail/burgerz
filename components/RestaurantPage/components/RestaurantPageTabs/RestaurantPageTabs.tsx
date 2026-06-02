"use client";

import { Tab, Tabs } from "@/components/basic/Tabs/Tabs";
import { RestaurantBurgers } from "@/components/RestaurantBurgers/RestaurantBurgers";
import { RestaurantReviews } from "@/components/RestaurantReviews/RestaurantReviews";

import type { RestaurantPageTabsProps } from "./types";

export function RestaurantPageTabs({ restaurantId }: RestaurantPageTabsProps) {
  return (
    <Tabs defaultTabId="reviews" ariaLabel="Restaurant sections">
      <Tab id="reviews" label="Reviews">
        <RestaurantReviews restaurantId={restaurantId} />
      </Tab>
      <Tab id="menu" label="Burgers Menu">
        <RestaurantBurgers restaurantId={restaurantId} />
      </Tab>
    </Tabs>
  );
}
