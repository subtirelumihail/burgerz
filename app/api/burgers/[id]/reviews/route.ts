import {
  createBurgerReview,
  listBurgerReviews,
  parseListReviewsParams,
} from "@/mocks/review-store";
import type { CreateBurgerReviewRequest } from "@/types/review";
import type { BurgerUserReviewRating } from "@/types/review";

interface ReviewsRouteParams {
  params: Promise<{ id: string }>;
}

const VALID_RATINGS = new Set<BurgerUserReviewRating>([1, 2, 3, 4, 5]);

function isValidRating(value: unknown): value is BurgerUserReviewRating {
  return (
    typeof value === "number" &&
    VALID_RATINGS.has(value as BurgerUserReviewRating)
  );
}

function parseCreateReviewBody(
  body: unknown,
): CreateBurgerReviewRequest | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const record = body as Record<string, unknown>;
  const authorName =
    typeof record.authorName === "string" ? record.authorName.trim() : "";
  const text = typeof record.text === "string" ? record.text.trim() : "";

  if (!authorName || !text) {
    return null;
  }

  const aspectsRecord = record.aspects;

  if (!aspectsRecord || typeof aspectsRecord !== "object") {
    return null;
  }

  const aspects = aspectsRecord as Record<string, unknown>;
  const taste = aspects.taste;
  const texture = aspects.texture;
  const visualPresentation = aspects.visualPresentation;

  if (
    !isValidRating(taste) ||
    !isValidRating(texture) ||
    !isValidRating(visualPresentation)
  ) {
    return null;
  }

  const image =
    record.image && typeof record.image === "object"
      ? (record.image as CreateBurgerReviewRequest["image"])
      : undefined;

  return {
    authorName,
    text,
    aspects: {
      taste,
      texture,
      visualPresentation,
    },
    ...(image ? { image } : {}),
  };
}

export async function GET(request: Request, { params }: ReviewsRouteParams) {
  const { id } = await params;
  const url = new URL(request.url);

  return Response.json(
    listBurgerReviews(parseListReviewsParams(id, url.searchParams)),
  );
}

export async function POST(request: Request, { params }: ReviewsRouteParams) {
  const { id } = await params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = parseCreateReviewBody(body);

  if (!payload) {
    return Response.json({ error: "Invalid review payload" }, { status: 400 });
  }

  const review = createBurgerReview(id, payload);

  return Response.json(review, { status: 201 });
}
