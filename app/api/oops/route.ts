import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request) {
  const isPreview = process.env.VERCEL_ENV === 'preview';
  const enabled = process.env.ENABLE_OOPS === '1';

  // Preview değilse ve anahtar kapalıysa 404 dön
  if (!isPreview && !enabled) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  try {
    // Bilerek hata fırlat
    throw new Error('Sentry demo error from /api/oops');
  } catch (err) {
    // Sentry'ye gönder ve flush et ki serverless'ta kaybolmasın
    Sentry.setTag('route', '/api/oops');
    Sentry.captureException(err);
    await Sentry.flush(2000);
    return NextResponse.json({ ok: false, error: 'Hata gönderildi' }, { status: 500 });
  }
}


