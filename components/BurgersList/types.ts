import type { Burger } from "@/types/burger";

export interface BurgersListProps {
  burgers: Burger[];
  isLoading?: boolean;
}

export interface BurgerCardProps {
  burger: Burger;
  imagePriority?: boolean;
}

export interface BurgerScoresProps {
  scores: Burger["scores"];
  /** Decimal places for displayed scores (burgers use 1; user reviews use 0) */
  decimals?: 0 | 1;
}
