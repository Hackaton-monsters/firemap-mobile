/**
 * Cloudinary image transformation helpers
 * Transforms Cloudinary URLs to optimize image loading with specific dimensions and quality
 */

type CloudinaryTransformOptions = {
  width?: number;
  height?: number;
  quality?: number | "auto";
  crop?: "fill" | "fit" | "scale" | "thumb";
  gravity?: "auto" | "center" | "face";
};

/**
 * Transforms a Cloudinary URL to apply optimizations
 *
 * @param url - Original Cloudinary image URL
 * @param options - Transformation options (width, height, quality, crop, gravity)
 * @returns Transformed Cloudinary URL with applied optimizations
 *
 * @example
 * // Original: https://res.cloudinary.com/dnpfpbc9l/image/upload/v1763288482/firemap/firemap/images/d4ac8658_photo_1763288481476.jpg.jpg
 * // Transformed: https://res.cloudinary.com/dnpfpbc9l/image/upload/w_200,h_200,c_fill,q_auto/v1763288482/firemap/firemap/images/d4ac8658_photo_1763288481476.jpg.jpg
 * transformCloudinaryUrl(url, { width: 200, height: 200, quality: 'auto', crop: 'fill' })
 */
export const transformCloudinaryUrl = (
  url: string,
  options: CloudinaryTransformOptions = {}
): string => {
  if (!url || !url.includes("cloudinary.com")) {
    return url;
  }

  const {
    width,
    height,
    quality = "auto",
    crop = "fill",
    gravity = "auto",
  } = options;

  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity && crop === "fill") transformations.push(`g_${gravity}`);
  if (quality) transformations.push(`q_${quality}`);

  if (transformations.length === 0) {
    return url;
  }

  const transformString = transformations.join(",");

  // Match pattern: /upload/[version]/
  const uploadPattern = /\/upload\/(v\d+\/)?/;

  if (!uploadPattern.test(url)) {
    return url;
  }

  return url.replace(uploadPattern, `/upload/${transformString}/$1`);
};

/**
 * Get thumbnail version of Cloudinary image (small size, optimized for lists)
 *
 * @param url - Original Cloudinary image URL
 * @param size - Thumbnail size in pixels (default: 100)
 * @returns Thumbnail URL with 100x100px, auto quality, fill crop
 */
export const getCloudinaryThumbnail = (
  url: string,
  size: number = 100
): string => {
  return transformCloudinaryUrl(url, {
    width: size,
    height: size,
    quality: "auto",
    crop: "fill",
    gravity: "auto",
  });
};

/**
 * Get preview version of Cloudinary image (medium size, optimized for detail views)
 *
 * @param url - Original Cloudinary image URL
 * @param width - Preview width in pixels (default: 400)
 * @returns Preview URL with specified width, auto quality, fit crop
 */
export const getCloudinaryPreview = (
  url: string,
  width: number = 400
): string => {
  return transformCloudinaryUrl(url, {
    width,
    quality: "auto",
    crop: "fit",
  });
};

/**
 * Get full-size version of Cloudinary image (optimized for fullscreen viewing)
 *
 * @param url - Original Cloudinary image URL
 * @param maxWidth - Maximum width in pixels (default: 1200)
 * @returns Full-size URL with max width, auto quality, fit crop
 */
export const getCloudinaryFullSize = (
  url: string,
  maxWidth: number = 1200
): string => {
  return transformCloudinaryUrl(url, {
    width: maxWidth,
    quality: "auto",
    crop: "fit",
  });
};
