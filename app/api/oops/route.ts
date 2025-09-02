// app/api/oops/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { headers } from 'next/headers';

// ÖNEMLİ: Alias yerine relative path (dosya kökü: /lib/rate-limit.ts)
import { checkRateLimit } from '../../../lib/rate-limit';

export async function GET(request: Request) {
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
        'X-RateLimit-Reset': String(reset),
      },
    });
  }

  const force = new URL(request.url).searchParams.get('force');
  if (force) {
    const err = new Error('Forced error from /api/oops');
    Sentry.captureException(err, { tags: { route: '/api/oops' } });
    throw err; // 500 üretir
  }

  return NextResponse.json({ ok: true, remaining });
}


















