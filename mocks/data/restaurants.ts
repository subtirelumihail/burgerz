import { createMockRestaurantImage } from "@/mocks/data/images";
import { enrichRestaurantWithRatings } from "@/mocks/restaurant-ratings";
import { getAllReviews } from "@/mocks/review-store";
import type { Restaurant, RestaurantSummary } from "@/types/restaurant";

const weekdayHours = [
  { days: "Mon – Fri", hours: "11:00 – 22:00" },
  { days: "Sat – Sun", hours: "10:00 – 23:00" },
];

const lateNightHours = [
  { days: "Mon – Thu", hours: "17:00 – 01:00" },
  { days: "Fri – Sat", hours: "17:00 – 02:00" },
  { days: "Sun", hours: "17:00 – 00:00" },
];

const restaurantSeeds = [
  {
    id: "restaurant-1",
    name: "Smash Shack",
    image: createMockRestaurantImage("smash-shack"),
    location: {
      address: "Strada Lipscani 25, Bucharest, Romania",
      coordinates: { latitude: 44.4319, longitude: 26.1027 },
    },
    openingHours: weekdayHours,
  },
  {
    id: "restaurant-2",
    name: "Midnight Melt Bar",
    image: createMockRestaurantImage("midnight-melt-bar"),
    location: {
      address: "Bulevardul Magheru 28-30, Bucharest, Romania",
      coordinates: { latitude: 44.4396, longitude: 26.0974 },
    },
    openingHours: lateNightHours,
  },
  {
    id: "restaurant-3",
    name: "Green Bite Co.",
    image: createMockRestaurantImage("green-bite-co"),
    location: {
      address: "Strada Arthur Verona 13, Bucharest, Romania",
      coordinates: { latitude: 44.4462, longitude: 26.0968 },
    },
    openingHours: weekdayHours,
  },
  {
    id: "restaurant-4",
    name: "Firehouse Burgers",
    image: createMockRestaurantImage("firehouse-burgers"),
    location: {
      address: "Calea Victoriei 118, Bucharest, Romania",
      coordinates: { latitude: 44.4412, longitude: 26.0876 },
    },
    openingHours: weekdayHours,
  },
  {
    id: "restaurant-5",
    name: "The Bun Stop",
    image: createMockRestaurantImage("the-bun-stop"),
    location: {
      address: "Strada Franceza 62, Bucharest, Romania",
      coordinates: { latitude: 44.4298, longitude: 26.1045 },
    },
    openingHours: weekdayHours,
  },
  {
    id: "restaurant-6",
    name: "Patty Palace",
    image: createMockRestaurantImage("patty-palace"),
    location: {
      address: "Strada Dionisie Lupu 78, Bucharest, Romania",
      coordinates: { latitude: 44.4431, longitude: 26.1012 },
    },
    openingHours: weekdayHours,
  },
  {
    id: "restaurant-7",
    name: "Urban Grillhouse",
    image: createMockRestaurantImage("urban-grillhouse"),
    location: {
      address: "Piata Universitatii 1, Bucharest, Romania",
      coordinates: { latitude: 44.4358, longitude: 26.1025 },
    },
    openingHours: weekdayHours,
  },
  {
    id: "restaurant-8",
    name: "Coastal Burger Co.",
    image: createMockRestaurantImage("coastal-burger-co"),
    location: {
      address: "Bulevardul Unirii 1, Bucharest, Romania",
      coordinates: { latitude: 44.426, longitude: 26.1026 },
    },
    openingHours: weekdayHours,
  },
] as const;

export const mockRestaurants: Restaurant[] = restaurantSeeds.map((restaurant) =>
  enrichRestaurantWithRatings(restaurant, getAllReviews()),
);

export function getRestaurantById(id: string): Restaurant | null {
  const restaurant = restaurantSeeds.find((entry) => entry.id === id);

  if (!restaurant) {
    return null;
  }

  return enrichRestaurantWithRatings(restaurant, getAllReviews());
}

export function getRestaurantSummaryById(id: string): RestaurantSummary | null {
  const restaurant = getRestaurantById(id);

  if (!restaurant) {
    return null;
  }

  return { id: restaurant.id, name: restaurant.name };
}
