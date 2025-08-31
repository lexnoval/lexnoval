import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export async function GET(_req: Request) {
  try {
    // Bilerek hata fırlatıyoruz
    throw new Error('Test: manuel hata gönderildi');
  } catch (error) {
    // Hata Sentry’ye gönderilsin
    Sentry.captureException(error);
    return NextResponse.json({ ok: false, error: 'Hata gönderildi' }, { status: 500 });
  }
}

































