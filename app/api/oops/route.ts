import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  // Yalnızca Preview ortamında veya açıkça ENABLE_OOPS=1 ise çalıştır
  const isPreview = process.env.VERCEL_ENV === 'preview';
  const enabled = process.env.ENABLE_OOPS === '1';

  if (!isPreview && !enabled) {
    // Prod’da 404 dön (endpoint görünmesin)
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  throw new Error('Test: server error from /api/oops');
}










