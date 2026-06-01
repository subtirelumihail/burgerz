import { mockImageAsset } from "@/test/mock-image";
import type { Restaurant } from "@/types/restaurant";

export const mockRestaurantRatings = {
  reviewCount: 42,
  reviewScore: 4.5,
  scores: {
    taste: 4.5,
    texture: 4.4,
    visualPresentation: 4.3,
  },
} as const;

export const mockRestaurant: Restaurant = {
  id: "restaurant-1",
  name: "Smash Shack",
  image: mockImageAsset,
  location: {
    address: "Strada Lipscani 25, Bucharest, Romania",
    coordinates: { latitude: 44.4319, longitude: 26.1027 },
  },
  openingHours: [
    { days: "Mon – Fri", hours: "11:00 – 22:00" },
    { days: "Sat – Sun", hours: "10:00 – 23:00" },
  ],
  ...mockRestaurantRatings,
};
