export const API_BASE_URL = import.meta.env.VITE_API_URL;
export const ASSET_BASE_URL =
  import.meta.env.VITE_ASSET_URL || "http://localhost:5005";

export const getAssetUrl = (assetPath) => {
  if (!assetPath) return "";

  if (assetPath.startsWith("http://") || assetPath.startsWith("https://")) {
    return assetPath;
  }

  const baseUrl = ASSET_BASE_URL.endsWith("/")
    ? ASSET_BASE_URL.slice(0, -1)
    : ASSET_BASE_URL;

  if (assetPath.startsWith("/uploads")) {
    return `${baseUrl}${assetPath}`;
  }

  if (assetPath.startsWith("uploads/")) {
    return `${baseUrl}/${assetPath}`;
  }

  return `${baseUrl}/uploads/${assetPath.startsWith("/") ? assetPath.slice(1) : assetPath}`;
};
