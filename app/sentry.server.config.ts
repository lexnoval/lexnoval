// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN, // server-side değişken
  tracesSampleRate: 0.2,       // backend için %20 örnekleme
});

