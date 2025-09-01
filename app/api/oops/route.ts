// app/api/oops/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export const runtime = 'nodejs';         // In-memory limiter için Node.js
export const dynamic = 'force-dynamic';  // Cache'e takılmasın

// Prod'da bu route'u kapatmak istersen (isteğe bağlı):
// if (process.env.VERCEL_ENV === 'production' && process.env.ENABLE_OOPS !== '1') {
//   export async function GET() {
//     return new NextResponse('Not Found', { status: 404 });
//   }
//   // Not: Yukarıyı açarsan alttaki GET'i kaldırma.
// }

const WINDOW_MS = 10_000; // 10 saniye
const MAX_REQ = 5;        // IP başına 5 istek

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

function applyRLHeaders(res: NextResponse, rl: { remaining: number; resetAt: number }) {
  res.headers.set('X-RateLimit-Limit', String(MAX_REQ));
  res.headers.set('X-RateLimit-Remaining', String(rl.remaining));
  res.headers.set('X-RateLimit-Reset', String(Math.ceil(rl.resetAt / 1000)));
  return res;
}

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'anon';

  const rl = rateLimit(ip);

  if (!rl.allowed) {
    return applyRLHeaders(
      new NextResponse(JSON.stringify({ ok: false, error: 'rate_limited' }), {
        status: 429,
        headers: { 'content-type': 'application/json' },
      }),
      rl
    );
  }

  const { searchParams } = new URL(req.url);
  if (searchParams.get('force') === '1') {
    const err = new Error('Lexnoval test error from /api/oops');
    // Manuel bildir → sonra yine throw; Sentry hem captureException hem unhandled'ı görebilir.
    Sentry.captureException(err);
    throw err;
  }

  return applyRLHeaders(
    NextResponse.json({
      ok: true,
      message: 'Hata testi için URL sonuna ?force=1 ekleyin. Rate-limit headerlarına bakın.',
    }),
    rl
  );
}









