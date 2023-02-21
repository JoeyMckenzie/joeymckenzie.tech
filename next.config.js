const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.scdn.co'],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = withContentlayer(nextConfig);
