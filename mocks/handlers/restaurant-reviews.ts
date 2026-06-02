import { http, HttpResponse } from "msw";

import {
  createRestaurantReview,
  listRestaurantReviews,
  parseListRestaurantReviewsParams,
} from "@/mocks/restaurant-review-store";

export const restaurantReviewHandlers = [
  http.get("/api/restaurants/:id/reviews", ({ params, request }) => {
    const id = params.id;

    if (typeof id !== "string") {
      return new HttpResponse(null, { status: 400 });
    }

    const url = new URL(request.url);

    return HttpResponse.json(
      listRestaurantReviews(
        parseListRestaurantReviewsParams(id, url.searchParams),
      ),
    );
  }),

  http.post("/api/restaurants/:id/reviews", async ({ params, request }) => {
    const id = params.id;

    if (typeof id !== "string") {
      return new HttpResponse(null, { status: 400 });
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return HttpResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!body || typeof body !== "object") {
      return HttpResponse.json(
        { error: "Invalid review payload" },
        { status: 400 },
      );
    }

    const record = body as Record<string, unknown>;
    const authorName =
      typeof record.authorName === "string" ? record.authorName.trim() : "";
    const text = typeof record.text === "string" ? record.text.trim() : "";

    if (!authorName || !text) {
      return HttpResponse.json(
        { error: "Invalid review payload" },
        { status: 400 },
      );
    }

    const aspectsRecord = record.aspects;

    if (!aspectsRecord || typeof aspectsRecord !== "object") {
      return HttpResponse.json(
        { error: "Invalid review payload" },
        { status: 400 },
      );
    }

    const aspects = aspectsRecord as Record<string, unknown>;
    const validRatings = new Set([1, 2, 3, 4, 5]);
    const taste = aspects.taste;
    const texture = aspects.texture;
    const visualPresentation = aspects.visualPresentation;

    if (
      typeof taste !== "number" ||
      typeof texture !== "number" ||
      typeof visualPresentation !== "number" ||
      !validRatings.has(taste) ||
      !validRatings.has(texture) ||
      !validRatings.has(visualPresentation)
    ) {
      return HttpResponse.json(
        { error: "Invalid review payload" },
        { status: 400 },
      );
    }

    const review = createRestaurantReview(id, {
      authorName,
      text,
      aspects: {
        taste: taste as 1 | 2 | 3 | 4 | 5,
        texture: texture as 1 | 2 | 3 | 4 | 5,
        visualPresentation: visualPresentation as 1 | 2 | 3 | 4 | 5,
      },
      ...(record.image && typeof record.image === "object"
        ? {
            image: record.image as Parameters<
              typeof createRestaurantReview
            >[1]["image"],
          }
        : {}),
    });

    return HttpResponse.json(review, { status: 201 });
  }),
];
