import type { RestaurantSummary } from "@/types/restaurant";

export const mockRestaurants: RestaurantSummary[] = [
  { id: "restaurant-1", name: "Smash Shack" },
  { id: "restaurant-2", name: "Midnight Melt Bar" },
  { id: "restaurant-3", name: "Green Bite Co." },
  { id: "restaurant-4", name: "Firehouse Burgers" },
  { id: "restaurant-5", name: "The Bun Stop" },
  { id: "restaurant-6", name: "Patty Palace" },
  { id: "restaurant-7", name: "Urban Grillhouse" },
  { id: "restaurant-8", name: "Coastal Burger Co." },
];

export function getRestaurantById(id: string): RestaurantSummary | null {
  return mockRestaurants.find((restaurant) => restaurant.id === id) ?? null;
}
