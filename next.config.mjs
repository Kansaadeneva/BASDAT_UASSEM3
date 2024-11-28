const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [{ hostname: "upload.wikimedia.org" }],
  },
  /* config options here */
};

export default nextConfig;
