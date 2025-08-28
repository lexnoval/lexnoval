// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, // Client için public DSN
  // Performance (frontend)
  tracesSampleRate: 0.2, // %20 örnekleme
  // Replay
  integrations: [Sentry.replayIntegration()],
  replaysSessionSampleRate: 0.1,   // normal oturumların %10'u
  replaysOnErrorSampleRate: 1.0,   // hata olursa %100
});

