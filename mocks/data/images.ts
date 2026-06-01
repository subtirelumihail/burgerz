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

function seedToLock(seed: string): number {
  let hash = 0;

  for (let index = 0; index < seed.length; index++) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return hash || 1;
}

function buildLoremFlickrUrl(
  keyword: string,
  lockSeed: string,
  width: number,
  height: number,
): string {
  const lock = seedToLock(lockSeed);

  return `https://loremflickr.com/${width}/${height}/${keyword}?lock=${lock}`;
}

function buildLoremFlickrImageAsset(
  keyword: string,
  lockSeed: string,
  sizes: MockImageSizes,
): ImageAsset {
  const [thumbnailWidth, thumbnailHeight] = sizes.thumbnail;
  const [fullWidth, fullHeight] = sizes.full;

  return {
    thumbnailUrl: buildLoremFlickrUrl(
      keyword,
      lockSeed,
      thumbnailWidth,
      thumbnailHeight,
    ),
    fullUrl: buildLoremFlickrUrl(keyword, lockSeed, fullWidth, fullHeight),
    width: fullWidth,
    height: fullHeight,
  };
}

export function createMockBurgerImage(seed: string): ImageAsset {
  return buildLoremFlickrImageAsset(
    "burger",
    `${seed}burger`,
    DEFAULT_BURGER_SIZES,
  );
}

export function createMockReviewImage(seed: string): ImageAsset {
  return buildLoremFlickrImageAsset(
    "burger",
    `${seed}burger`,
    DEFAULT_REVIEW_SIZES,
  );
}

export function createMockRestaurantImage(seed: string): ImageAsset {
  return buildLoremFlickrImageAsset(
    "restaurant",
    `${seed}restaurant`,
    DEFAULT_RESTAURANT_SIZES,
  );
}
