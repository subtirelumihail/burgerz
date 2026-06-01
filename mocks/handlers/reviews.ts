import { http, HttpResponse } from "msw";

import {
  listBurgerReviews,
  parseListReviewsParams,
} from "@/mocks/review-store";

export const reviewHandlers = [
  http.get("/api/burgers/:id/reviews", ({ params, request }) => {
    const id = params.id;

    if (typeof id !== "string") {
      return new HttpResponse(null, { status: 400 });
    }

    const url = new URL(request.url);

    return HttpResponse.json(
      listBurgerReviews(parseListReviewsParams(id, url.searchParams)),
    );
  }),
];
