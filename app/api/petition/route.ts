// app/api/petition/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { checkRateLimit } from '../../../lib/rate-limit';

export async function POST(request: Request) {
  // Sadece preview/dev'de çalışsın; prod'da 404 dön.
  const isProd = process.env.VERCEL_ENV === 'production';
  if (isProd) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // ----- Basit rate limit: 5 istek / 60 sn / IP -----
  const h = headers();
  const ip =
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    '127.0.0.1';

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
  // ---------------------------------------------------

  // JSON gövdeyi al
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { type, clientName, court, facts, demands } = body ?? {};
  if (!type || !clientName) {
    return NextResponse.json(
      { error: 'type ve clientName zorunlu' },
      { status: 422 },
    );
  }

  // (İstersen burada DB kaydı yap)

  return NextResponse.json(
    { ok: true, received: { type, clientName, court, facts, demands }, remaining },
    { status: 200 },
  );
}





