import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = async (_req: Request) => {
  if (process.env.ENABLE_OOPS === '1') {
    const err = new Error('Test: server error from /api/oops');
    Sentry.captureException(err);
    await Sentry.flush(2000);
    throw err;                      // Preview’da 500
  }
  return NextResponse.json({ ok: false }, { status: 404 }); // Prod’da 404
};

// v8 imzası: (handler, context)
// context olarak route bilgisini ver:
export const GET = Sentry.wrapRouteHandlerWithSentry(handler, {
  method: 'GET',
  route: '/api/oops',
});
























