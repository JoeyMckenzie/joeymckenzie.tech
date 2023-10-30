const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withContentlayer(nextConfig);
