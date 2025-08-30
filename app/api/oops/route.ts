import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

const handler = async (_req: Request, _ctx: { params?: Record<string, string | string[]> }) => {
  try {
    // Bilerek hata gönderiyoruz
    throw new Error('Test: manuel hata gönderildi');
  } catch (error) {
    console.log("Hata mesajı:", error);  // Konsola hata mesajını yazdıralım
    // Hata mesajını Sentry'ye gönder
    Sentry.captureException(error);
    return NextResponse.json({ ok: false, error: 'Hata gönderildi' }, { status: 500 });
  }
};

export const GET = Sentry.wrapRouteHandlerWithSentry(handler, {
  method: 'GET',
  parameterizedRoute: '/api/oops',
});



































