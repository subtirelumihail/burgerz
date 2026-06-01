import type { Burger } from "@/types/burger";

export interface BurgerHeroProps {
  burger: Burger;
  onHeroImageLoad?: () => void;
}
