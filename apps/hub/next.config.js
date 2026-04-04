const withSerwist = require('@serwist/next').default({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@daily-apps/shared'],
};

module.exports = withSerwist(nextConfig);
