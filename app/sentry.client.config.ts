// Client-side Sentry init (Next.js App Router)
import * as Sentry from "@sentry/nextjs";

const enabled = process.env.NEXT_PUBLIC_SHOW_DEMOS === "1";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled,
  tracesSampleRate: 1.0,
  // Replay + Performance demoları
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
});

