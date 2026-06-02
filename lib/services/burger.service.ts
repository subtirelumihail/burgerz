import { ApiError, apiClient } from "@/lib/api/client";
import type {
  Burger,
  GetBurgersParams,
  GetBurgersResponse,
} from "@/types/burger";

function buildBurgersPath(params?: GetBurgersParams): string {
  const searchParams = new URLSearchParams();

  if (params?.q) {
    searchParams.set("q", params.q);
  }

  if (params?.restaurantId) {
    searchParams.set("restaurantId", params.restaurantId);
  }

  if (params?.page) {
    searchParams.set("page", String(params.page));
  }

  if (params?.pageSize) {
    searchParams.set("pageSize", String(params.pageSize));
  }

  const query = searchParams.toString();

  return query ? `/api/burgers?${query}` : "/api/burgers";
}

export async function getBurgers(
  params?: GetBurgersParams,
): Promise<GetBurgersResponse> {
  return apiClient.get<GetBurgersResponse>(buildBurgersPath(params));
}

export async function getBurger(id: string): Promise<Burger | null> {
  try {
    return await apiClient.get<Burger>(`/api/burgers/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
