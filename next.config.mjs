// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // ✅ Handles all routes that include /api
      {
        source: "/api/:path*",
        destination: "https://api.skillswapbackend.kesug.com/api/:path*", // backend with /api
      },
      // // ✅ Handles routes without /api (like upload, etc.)
      // {
      //   source: "/backend/:path*",
      //   destination: "https://api.skillswapbackend.kesug.com/:path*", // backend root
      // },
    ];
  },
};

export default nextConfig;
