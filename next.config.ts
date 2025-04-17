import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.mux.com" },
      { protocol: "https", hostname: "r1sviudyop.ufs.sh" },
    ],
  },
  /* config options here */
};

export default nextConfig;
