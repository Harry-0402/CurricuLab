import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/supabase/:path*',
        destination: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/:path*`, // Proxy to Supabase
      },
    ];
  },
};

export default nextConfig;
