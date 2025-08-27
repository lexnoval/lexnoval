// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // dsn / environment zaten sihirbaz eklediyse bırak
  integrations: [
    Sentry.browserTracingIntegration(), // Performance (browser)
    Sentry.replayIntegration(),         // Session Replay
  ],

  // Sampling oranları — prod'da düşürebiliriz
  tracesSampleRate:
    Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? "0.1"),
  replaysSessionSampleRate:
    Number(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? "0.1"),
  replaysOnErrorSampleRate:
    Number(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE ?? "1.0"),
});
