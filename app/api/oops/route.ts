// app/api/oops/route.ts
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request) {
  const isPreview = process.env.VERCEL_ENV === 'preview';
  const enabled = process.env.ENABLE_OOPS === '1';

  if (!isPreview && !enabled) {
    // prod'da endpoint gizli kalsın
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  try {
    // Bilerek hata fırlatıyoruz; Sentry'ye de göndereceğiz
    throw new Error('Sentry demo error from /api/oops');
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json({ ok: false, error: 'Hata gönderildi' }, { status: 500 });
  }
}

