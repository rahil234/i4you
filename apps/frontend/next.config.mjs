import pwa from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  }, typescript: {
    ignoreBuildErrors: true,
  }, images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['i4you.local.net'],
  experimental: {
    webpackBuildWorker: true, parallelServerBuildTraces: true, parallelServerCompiles: true,
  },
  devIndicators: false,
};

const pwaConfig = pwa({
  dest: 'public',
  register: true,
  swSrc: "service-worker/sw.js",
  skipWaiting: true,
  clientsClaim: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/app-build-manifest\.json$/],
});

export default pwaConfig(nextConfig);
