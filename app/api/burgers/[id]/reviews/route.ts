import {
  listBurgerReviews,
  parseListReviewsParams,
} from "@/mocks/review-store";

interface ReviewsRouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: ReviewsRouteParams) {
  const { id } = await params;
  const url = new URL(request.url);

  return Response.json(
    listBurgerReviews(parseListReviewsParams(id, url.searchParams)),
  );
}
