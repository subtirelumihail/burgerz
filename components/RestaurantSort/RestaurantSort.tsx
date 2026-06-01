"use client";

import type { ChangeEvent } from "react";

import type { RestaurantSortOption } from "@/types/restaurant";

import { LocationPermissionNotice } from "./components/LocationPermissionNotice/LocationPermissionNotice";
import type { RestaurantSortProps, SortOption } from "./types";

import styles from "./RestaurantSort.module.css";

const sortOptions: SortOption[] = [
  { value: "nearby", label: "Near By" },
  { value: "name", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
];

function getDisplaySort(
  sort: RestaurantSortOption,
  needsLocationAccess: boolean,
): RestaurantSortOption {
  if (sort === "nearby" && needsLocationAccess) {
    return "name";
  }

  return sort;
}

export function RestaurantSort({
  sort,
  onSortChange,
  needsLocationAccess,
  isLocationPending = false,
  onEnableLocation,
  isLoading = false,
}: RestaurantSortProps) {
  const displaySort = getDisplaySort(sort, needsLocationAccess);

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    onSortChange(event.target.value as RestaurantSortOption);
  }

  return (
    <section className={styles.root} aria-label="Sort restaurants">
      <div className={styles.controls}>
        <div className={styles.field}>
          <label htmlFor="restaurant-sort" className={styles.label}>
            Sort by
          </label>
          <select
            id="restaurant-sort"
            className={styles.select}
            value={displaySort}
            onChange={handleChange}
            disabled={isLoading}
          >
            {sortOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.value === "nearby" && needsLocationAccess}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {needsLocationAccess ? (
        <LocationPermissionNotice
          onEnableLocation={onEnableLocation}
          isRequesting={isLocationPending}
        />
      ) : null}
    </section>
  );
}
