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
}
