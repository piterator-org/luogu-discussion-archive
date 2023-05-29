/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["."],
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.luogu.com.cn" }],
  },
};

module.exports = nextConfig;
