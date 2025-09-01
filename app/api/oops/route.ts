import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';          // Edge yerine Node.js (in-memory limiter için)
export const dynamic = 'force-dynamic';   // Cache'e takılmasın

// Basit in-memory rate limit (örnek): 10 sn pencerede IP başına 5 istek
const WINDOW_MS = 10_000;
const MAX_REQ = 5;

type Entry = { count: number; resetAt: number };
const hits = new Map<string, Entry>();

function rateLimit(key: string) {
  const now = Date.now();
  const curr = hits.get(key);

  if (!curr || now > curr.resetAt) {
    const resetAt = now + WINDOW_MS;
    hits.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: MAX_REQ - 1, resetAt };
  }

  if (curr.count >= MAX_REQ) {
    return { allowed: false, remaining: 0, resetAt: curr.resetAt };
  }

  curr.count += 1;
  return { allowed: true, remaining: MAX_REQ - curr.count, resetAt: curr.resetAt };
}

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'anon';

  const rl = rateLimit(ip);
  const headers = {
    'X-RateLimit-Limit': String(MAX_REQ),
    'X-RateLimit-Remaining': String(rl.remaining),
    'X-RateLimit-Reset': String(Math.ceil(rl.resetAt / 1000)),
  };

  if (!rl.allowed) {
    return new NextResponse(JSON.stringify({ ok: false, error: 'rate_limited' }), {
      status: 429,
      headers,
    });
  }

  // ?force=1 verilirse kasıtlı hata at (Sentry otomatik yakalayacak)
  const { searchParams } = new URL(req.url);
  if (searchParams.get('force') === '1') {
    throw new Error('Lexnoval test error from /api/oops');
  }

  return NextResponse.json(
    {
      ok: true,
      message: 'Hata testi için URL sonuna ?force=1 ekleyin. Rate-limit headerlarına bakın.',
    },
    { headers },
  );
}








