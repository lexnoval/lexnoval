import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = Sentry.wrapRouteHandlerWithSentry(
  async (_req: Request) => {
    if (process.env.ENABLE_OOPS === '1') {
      const err = new Error('Test: server error from /api/oops');
      Sentry.captureException(err);
      await Sentry.flush(2000);
      throw err;
    }
    return NextResponse.json({ ok: false }, { status: 404 });
  },
  '/api/oops' // ← ikinci argüman: route path’i
);






















