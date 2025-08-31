// app/api/oops/route.ts
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Preview'da her zaman; prod'da sadece ENABLE_OOPS=1 ise hata fırlat
export const GET = Sentry.wrapRouteHandlerWithSentry(async () => {
  const isPreview = process.env.VERCEL_ENV === 'preview';
  const enabled = process.env.ENABLE_OOPS === '1';

  if (!isPreview && !enabled) {
    // prod'da endpoint gizli kalsın
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  throw new Error('Sentry demo error from /api/oops');
});
