import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    compiler: {
        styledComponents: true,
    },
    images: {
        domains: ['backend-hotel-51v4.onrender.com'],
    },

};

export default nextConfig;
