import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const isPreview = process.env.VERCEL_ENV === 'preview';
  const enabled = process.env.ENABLE_OOPS;

  // Geçici debug: ENV ve preview algısını göster
  if (url.searchParams.get('debug') === '1') {
    return NextResponse.json({ isPreview, ENABLE_OOPS: enabled ?? null }, { status: 200 });
  }

  if (!isPreview && enabled !== '1') {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  try {
    throw new Error('Sentry demo error from /api/oops');
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json({ ok: false, error: 'Hata gönderildi' }, { status: 500 });
  }
}

