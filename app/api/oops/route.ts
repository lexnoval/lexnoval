// app/api/oops/route.ts
import * as Sentry from '@sentry/nextjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = Sentry.wrapRouteHandler(async () => {
  throw new Error('Test: server error from /api/oops');
});


