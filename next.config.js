/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  images: {
    // Add your custom domains here
    domains: ['tailwindui.com', 'images.unsplash.com'],
  },
};

module.exports = nextConfig;
