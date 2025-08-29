import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN, // Vercel -> Production + Preview
  environment:
    process.env.SENTRY_ENVIRONMENT ||
    process.env.VERCEL_ENV ||        // 'production' | 'preview' | 'development'
    process.env.NODE_ENV,
  tracesSampleRate: 1.0,              // APM istersen
  debug: process.env.VERCEL_ENV === 'preview',
});


