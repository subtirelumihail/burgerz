import { apiClient } from "@/lib/api/client";
import type {
  CreateBurgerReviewRequest,
  CreateBurgerReviewResponse,
  CreateRestaurantReviewRequest,
  CreateRestaurantReviewResponse,
  GetBurgerReviewsParams,
  GetBurgerReviewsResponse,
  GetRestaurantReviewsParams,
  GetRestaurantReviewsResponse,
} from "@/types/review";

function buildBurgerReviewsPath(
  burgerId: string,
  params?: GetBurgerReviewsParams,
): string {
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

  const query = searchParams.toString();

  return query
    ? `/api/burgers/${burgerId}/reviews?${query}`
    : `/api/burgers/${burgerId}/reviews`;
}

export async function getBurgerReviews(
  burgerId: string,
  params?: GetBurgerReviewsParams,
): Promise<GetBurgerReviewsResponse> {
  return apiClient.get<GetBurgerReviewsResponse>(
    buildBurgerReviewsPath(burgerId, params),
  );
}

export async function createBurgerReview(
  burgerId: string,
  body: CreateBurgerReviewRequest,
): Promise<CreateBurgerReviewResponse> {
  return apiClient.post(`/api/burgers/${burgerId}/reviews`, body);
}

function buildRestaurantReviewsPath(
  restaurantId: string,
  params?: GetRestaurantReviewsParams,
): string {
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

  const query = searchParams.toString();

  return query
    ? `/api/restaurants/${restaurantId}/reviews?${query}`
    : `/api/restaurants/${restaurantId}/reviews`;
}

export async function getRestaurantReviews(
  restaurantId: string,
  params?: GetRestaurantReviewsParams,
): Promise<GetRestaurantReviewsResponse> {
  return apiClient.get<GetRestaurantReviewsResponse>(
    buildRestaurantReviewsPath(restaurantId, params),
  );
}

export async function createRestaurantReview(
  restaurantId: string,
  body: CreateRestaurantReviewRequest,
): Promise<CreateRestaurantReviewResponse> {
  return apiClient.post(`/api/restaurants/${restaurantId}/reviews`, body);
}
