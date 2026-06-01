import {
  listRestaurants,
  parseListRestaurantsParams,
} from "@/mocks/restaurant-store";

export async function GET(request: Request) {
  const url = new URL(request.url);

  return Response.json(
    listRestaurants(parseListRestaurantsParams(url.searchParams)),
  );
}
