import { http, HttpResponse } from "msw";

import { getRestaurantById } from "@/mocks/data/restaurants";
import {
  listRestaurants,
  parseListRestaurantsParams,
} from "@/mocks/restaurant-store";

export const restaurantHandlers = [
  http.get("/api/restaurants/:id", ({ params }) => {
    const id = params.id;

    if (typeof id !== "string") {
      return new HttpResponse(null, { status: 400 });
    }

    const restaurant = getRestaurantById(id);

    if (!restaurant) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(restaurant);
  }),

  http.get("/api/restaurants", ({ request }) => {
    const url = new URL(request.url);

    return HttpResponse.json(
      listRestaurants(parseListRestaurantsParams(url.searchParams)),
    );
  }),
];
