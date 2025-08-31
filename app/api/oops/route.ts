import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const isPreview = process.env.VERCEL_ENV === 'preview';
  const enabled = process.env.ENABLE_OOPS;

  // Preview algısını doğrulamak için basit ping
  if (url.searchParams.get('debug') === '1') {
    return NextResponse.json(
      { isPreview, ENABLE_OOPS: enabled ?? null },
      { status: 200 },
    );
  }

  // Prod/preview değilse ve anahtar kapalıysa endpoint'i gizle
  if (!isPreview && enabled !== '1') {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  try {
    // Bilerek hata fırlat
    throw new Error('Sentry demo error from /api/oops');
  } catch (err) {
    // Sentry'ye gönder ve serverless'ta kaybolmasın diye flush et
    Sentry.setTag('route', '/api/oops');
    Sentry.captureException(err);
    await Sentry.flush(2000);

    return NextResponse.json(
      { ok: false, error: 'Hata gönderildi' },
      { status: 500 },
    );
  }
}

