<<<<<<< HEAD
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN, // server-side değişken
  tracesSampleRate: 0.2,       // backend için %20 örnekleme
});

=======
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // dsn / environment sihirbazla geldiyse bırak
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0.1"),
  profilesSampleRate: Number(process.env.SENTRY_PROFILES_SAMPLE_RATE ?? "0.1"),
});
>>>>>>> main
