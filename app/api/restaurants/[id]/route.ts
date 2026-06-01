import { getRestaurantById } from "@/mocks/data/restaurants";

interface RestaurantRouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: Request,
  { params }: RestaurantRouteParams,
) {
  const { id } = await params;
  const restaurant = getRestaurantById(id);

  if (!restaurant) {
    return new Response(null, { status: 404 });
  }

  return Response.json(restaurant);
}
