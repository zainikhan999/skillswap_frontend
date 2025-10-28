/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source:
          "/:path((?!_next/|favicon\\.ico|images/|assets/|socket\\.io/).*)",
        destination: "https://api.skillswapbackend.kesug.com/:path*",
      },
    ];
  },
};

export default nextConfig;
