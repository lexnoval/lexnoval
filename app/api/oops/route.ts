// app/api/oops/route.ts
import { NextResponse } from 'next/server';
import { wrapRouteHandlerWithSentry } from '@sentry/nextjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = async (_req: Request) => {
  if (process.env.ENABLE_OOPS === '1') {
    const err = new Error('Test: server error from /api/oops');
    // İstersen raporla:
    // Sentry.captureException(err);
    throw err;
  }
  return NextResponse.json({ ok: false }, { status: 404 });
};

export const GET = wrapRouteHandlerWithSentry(handler, {
  method: 'GET',
  route: '/api/oops',
});



























