/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Add your custom domains here
    domains: ['tailwindui.com', 'images.unsplash.com'],
  },
};

module.exports = nextConfig;
