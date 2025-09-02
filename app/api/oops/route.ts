// app/api/oops/route.ts
export const runtime = 'nodejs'; // in-memory rate-limit için Node

import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { headers } from 'next/headers';

// '@' alias'ınız yoksa şunu kullanın:
// import { checkRateLimit } from '../../../lib/rate-limit';
import { checkRateLimit } from '@/lib/rate-limit';

const isProd = process.env.VERCEL_ENV === 'production';

export async function GET(request: Request) {
  // Prod ortamında tamamen kapat
  if (isProd) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const h = headers();
  const ip =
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    '127.0.0.1';

  // 5 istek / 60sn basit bellek-içi limit
  const { ok, remaining, reset } = checkRateLimit(ip, 5, 60_000);
  if (!ok) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(reset), // epoch seconds
      },
    });
  }

  // Hata zorlamak için: /api/oops?force=1
  const force = new URL(request.url).searchParams.get('force');
  if (force) {
    const err = new Error('Forced error from /api/oops');
    Sentry.captureException(err, { tags: { route: '/api/oops' } });
    throw err; // 500 döndürür
  }

  return NextResponse.json({ ok: true, remaining });
}














