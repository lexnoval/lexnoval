// app/api/oops/route.ts
import { wrapRouteHandlerWithSentry } from '@sentry/nextjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = wrapRouteHandlerWithSentry(async () => {
  // Bilerek 500 fırlatıyoruz; Sentry bu hatayı yakalayacak
  throw new Error('Test: server error from /api/oops');
});






