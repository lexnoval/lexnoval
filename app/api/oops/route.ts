import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = async (_req: Request, _ctx: { params?: Record<string, string | string[]> }) => {
  if (process.env.ENABLE_OOPS === '1') {
    // sadece fırlat; sentry wrapper otomatik yakalar
    throw new Error('Test: server error from /api/oops');
  }

  // prod’da 404 dön
  return NextResponse.json({ ok: false }, { status: 404 });
};

// ❗ Burada İKİNCİ ARGÜMAN YOK
export const GET = Sentry.wrapRouteHandlerWithSentry(handler);
// gerekirse POST/PUT için de aynı pattern:
// export const POST = Sentry.wrapRouteHandlerWithSentry(handler);
// export const PUT  = Sentry.wrapRouteHandlerWithSentry(handler);































