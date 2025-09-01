// app/api/oops/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export const runtime = 'nodejs';        // Sentry flush için Node runtime
export const dynamic = 'force-dynamic'; // Cache'e takılmasın

// ---- Basit in-memory rate limit (10 sn'de 5 istek) ----
type Entry = { count: number; resetAt: number };
const WINDOW_MS = 10_000;
const MAX_REQ = 5;
const hits = new Map<string, Entry>();

function ipFrom(req: NextRequest) {
  return (
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('cf-connecting-ip') ||
    'anon'
  );
}

function limitKey(key: string) {
  const now = Date.now();
  const curr = hits.get(key);

  if (!curr || now > curr.resetAt) {
    const entry: Entry = { count: 1, resetAt: now + WINDOW_MS };
    hits.set(key, entry);
    return { allowed: true, limit: MAX_REQ, remaining: MAX_REQ - 1, reset: entry.resetAt };
  }

  curr.count += 1;
  hits.set(key, curr);
  const remaining = Math.max(0, MAX_REQ - curr.count);
  const allowed = curr.count <= MAX_REQ;
  return { allowed, limit: MAX_REQ, remaining, reset: curr.resetAt };
}

function withRLHeaders(
  res: NextResponse,
  info: { limit: number; remaining: number; reset: number }
) {
  const resetSec = Math.ceil(info.reset / 1000); // epoch seconds
  res.headers.set('X-RateLimit-Limit', String(info.limit));
  res.headers.set('X-RateLimit-Remaining', String(info.remaining));
  res.headers.set('X-RateLimit-Reset', String(resetSec));
  return res;
}

// ---- Handler ----
export async function GET(req: NextRequest) {
  const key = `ip:${ipFrom(req)}`;
  const rl = limitKey(key);

  if (!rl.allowed) {
    return withRLHeaders(
      new NextResponse(JSON.stringify({ ok: false, error: 'rate_limited' }), {
        status: 429,
        headers: { 'content-type': 'application/json' },
      }),
      rl
    );
  }

  const { searchParams } = new URL(req.url);

  // Sentry hata testi: /api/oops?force=1
  if (searchParams.get('force') === '1') {
    const err = new Error('Lexnoval test error from /api/oops');
    Sentry.captureException(err);
    await Sentry.flush(2000); // event’i göndermesi için kısa beklet
    throw err;                // 500 döner
  }

  return withRLHeaders(
    NextResponse.json({
      ok: true,
      message: 'Hata testi için URL sonuna ?force=1 ekleyin. Rate-limit headerlarına bakın.',
    }),
    rl
  );
}











