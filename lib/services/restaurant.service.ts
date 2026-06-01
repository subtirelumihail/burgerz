import { ApiError, apiClient } from "@/lib/api/client";
import type {
  GetRestaurantsParams,
  GetRestaurantsResponse,
  Restaurant,
} from "@/types/restaurant";

function buildRestaurantsPath(params?: GetRestaurantsParams): string {
  const searchParams = new URLSearchParams();

  if (params?.q) {
    searchParams.set("q", params.q);
  }

  if (params?.page) {
    searchParams.set("page", String(params.page));
  }

  if (params?.pageSize) {
    searchParams.set("pageSize", String(params.pageSize));
  }

  if (params?.sort) {
    searchParams.set("sort", params.sort);
  }

  if (params?.latitude !== undefined) {
    searchParams.set("latitude", String(params.latitude));
  }

  if (params?.longitude !== undefined) {
    searchParams.set("longitude", String(params.longitude));
  }

  const query = searchParams.toString();

  return query ? `/api/restaurants?${query}` : "/api/restaurants";
}

export async function getRestaurants(
  params?: GetRestaurantsParams,
): Promise<GetRestaurantsResponse> {
  return apiClient.get<GetRestaurantsResponse>(buildRestaurantsPath(params));
}

export async function getRestaurant(id: string): Promise<Restaurant | null> {
  try {
    return await apiClient.get<Restaurant>(`/api/restaurants/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
