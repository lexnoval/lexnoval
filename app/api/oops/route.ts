import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);

  // Preview algısı + manuel açma anahtarı
  const isPreview = process.env.VERCEL_ENV === 'preview';
  const enabled = process.env.ENABLE_OOPS === '1';

  // Geçici debug: ortam değerlerini gör
  if (url.searchParams.get('debug') === '1') {
    return NextResponse.json({
      isPreview,
      ENABLE_OOPS: process.env.ENABLE_OOPS ?? null,
    });
  }

  // Prod’da gizli tut (preview değilse ve anahtar kapalıysa 404)
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
    await Sentry.


