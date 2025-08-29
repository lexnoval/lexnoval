// app/sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || undefined,
  tracesSampleRate: 1.0,
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
  enabled: !!process.env.SENTRY_DSN && process.env.NODE_ENV !== "test",
  debug: false,
});

