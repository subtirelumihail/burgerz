import type { ImageAsset } from "@/types/image";

interface MockImageSizes {
  thumbnail: [number, number];
  full: [number, number];
}

const DEFAULT_BURGER_SIZES: MockImageSizes = {
  thumbnail: [160, 160],
  full: [960, 640],
};

const DEFAULT_REVIEW_SIZES: MockImageSizes = {
  thumbnail: [200, 150],
  full: [960, 640],
};

const DEFAULT_RESTAURANT_SIZES: MockImageSizes = {
  thumbnail: [160, 160],
  full: [960, 640],
};

function buildImageAsset(seed: string, sizes: MockImageSizes): ImageAsset {
  return {
    thumbnailUrl: `https://picsum.photos/seed/${seed}/${sizes.thumbnail[0]}/${sizes.thumbnail[1]}`,
    fullUrl: `https://picsum.photos/seed/${seed}/${sizes.full[0]}/${sizes.full[1]}`,
    width: sizes.full[0],
    height: sizes.full[1],
  };
}

export function createMockBurgerImage(seed: string): ImageAsset {
  return buildImageAsset(seed, DEFAULT_BURGER_SIZES);
}

export function createMockReviewImage(seed: string): ImageAsset {
  return buildImageAsset(seed, DEFAULT_REVIEW_SIZES);
}

export function createMockRestaurantImage(seed: string): ImageAsset {
  return buildImageAsset(seed, DEFAULT_RESTAURANT_SIZES);
}
