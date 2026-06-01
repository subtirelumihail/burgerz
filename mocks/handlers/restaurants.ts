import { http, HttpResponse } from "msw";

import {
  listRestaurants,
  parseListRestaurantsParams,
} from "@/mocks/restaurant-store";

export const restaurantHandlers = [
  http.get("/api/restaurants", ({ request }) => {
    const url = new URL(request.url);

    return HttpResponse.json(
      listRestaurants(parseListRestaurantsParams(url.searchParams)),
    );
  }),
];
