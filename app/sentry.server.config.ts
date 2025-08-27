import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // dsn / environment sihirbazla geldiyse bırak
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0.1"),
  profilesSampleRate: Number(process.env.SENTRY_PROFILES_SAMPLE_RATE ?? "0.1"),
});
