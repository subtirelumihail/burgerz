import type { Burger } from "@/types/burger";

export interface BurgersListProps {
  burgers: Burger[];
  isLoading?: boolean;
  /** Appends a safe `from` query param on burger detail links. */
  returnTo?: string;
  showRestaurant?: boolean;
}

export interface BurgerCardProps {
  burger: Burger;
  imagePriority?: boolean;
  /** Enables split keyboard focus: thumbnail link + details link. */
  listMode?: boolean;
  returnTo?: string;
  showRestaurant?: boolean;
}

export interface BurgerScoresProps {
  scores: Burger["scores"];
  /** Decimal places for displayed scores (burgers use 1; user reviews use 0) */
  decimals?: 0 | 1;
}
