// next.config.mjs
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next 13.4+ için instrumentation hook'u etkin (yeni sürümlerde zaten destekli)
  experimental: { instrumentationHook: true },
};

export default withSentryConfig(
  nextConfig,
  // Sentry Webpack Plugin seçenekleri (sourcemap upload vs.)
  {
    silent: true,
    // İstersen aşağıdakileri ENV'den otomatik okur; tek tek vermek şart değil:
    // org: process.env.SENTRY_ORG,
    // project: process.env.SENTRY_PROJECT,
  },
  // Next.js Sentry runtime seçenekleri
  {
    hideSourcemaps: true,
    disableLogger: false,
  }
);

