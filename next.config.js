const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx'],
  images: {
    domains: ['i.scdn.co'],
  },
};

module.exports = withContentlayer(nextConfig);
