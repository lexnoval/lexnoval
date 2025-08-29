import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export const runtime = 'nodejs';          // Edge yerine Node (Sentry için en sorunsuz)
export const dynamic = 'force-dynamic';   // Olası cache'i engelle

export const GET = Sentry.wrapRouteHandlerWithSentry(async () => {
  // Sadece Preview ortamında “hata at”
  if (process.env.ENABLE_OOPS === '1') {
    const err = new Error('Test: server error from /api/oops');

    // İsteğe bağlı ama serverless'ta çok faydalı: olayı yakala + flush et
    Sentry.captureException(err);
    await Sentry.flush(2000); // 2 sn bekle (gerekirse 3000 yap)

    throw err; // 500 dönsün
  }

  // Prod (ve local) 404
  return NextResponse.json({ ok: false }, { status: 404 });
});




















