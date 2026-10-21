import type { NextConfig } from "next";

// Fully static export (D1). Images are pre-sized WebP files, so no runtime optimiser.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
