/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@daily-apps/shared'],
  // serwist (PWA) disabled: @serwist/next uses webpack config incompatible with Next.js 16 Turbopack default.
  // To re-enable PWA, migrate to @serwist/turbopack or configurator mode.
  turbopack: {},
};

module.exports = nextConfig;
