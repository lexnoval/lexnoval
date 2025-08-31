// app/api/oops/route.ts
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const isPreview = process.env.VERCEL_ENV === 'preview';
  const enabled = process.env.ENABLE_OOPS;

  // İsteğe bağlı debug görünümü
  if (url.searchParams.get('debug') === '1') {
    return NextResponse.json(
      { isPreview, ENABLE_OOPS: enabled ?? null },
      { status: 200 }
    );
  }

  // Prod’da gizli: sadece preview + flag açıkken 500 at
  if (!isPreview || enabled !== '1') {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  try {
    // Bilerek hata fırlat
    throw new Error('Sentry demo error from /api/oops');
  } catch (err) {
    // Sentry: etiket, yakala ve güvenli gönder
    Sentry.setTag('route', '/api/oops');
    Sentry.captureException(err);
    await Sentry.flush(2000); // event’in kaybolmaması için bekle
    return NextResponse.json(
      { ok: false, error: 'Hata gönderildi' },
      { status: 500 }
    );
  }
}



