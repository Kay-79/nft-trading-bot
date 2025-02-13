import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/',
        has: [{ type: 'header', key: 'x-http-method-override', value: 'HEAD' }],
      },
    ];
  },
};

export default nextConfig;
