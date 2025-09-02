// app/api/petition/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { headers } from 'next/headers';

// Prod’da kapat (sadece preview/dev’te açık kalsın)
const isProd = process.env.VERCEL_ENV === 'production';
if (isProd) {
  // Next 14’te top-level return destekli; prod’da 404 verelim
  // (İstersen 403 de verebilirsin)
  // @ts-expect-error: top-level return for edge handlers
  return new NextResponse('Not Found', { status: 404 });
}

// Alias yerine relative import kullanıyoruz
import { checkRateLimit } from '../../../lib/rate-limit';
import connectDB from '../../../lib/db';
import Petition from '../../../models/Petition';

// Yardımcı: güvenli JSON parse
async function safeJson<T = any>(req: Request): Promise<T> {
  const text = await req.text();
  try { return JSON.parse(text) as T; } catch { return {} as T; }
}

export async function POST(request: Request) {
  try {
    // 1) Rate limit
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

    // 2) Body’yi al
    type Body = {
      type?: string;
      clientName?: string;
      court?: string;
      facts?: string;
      demands?: string;
      email?: string;
      ua?: string;
    };
    const body = await safeJson<Body>(request);
    if (!body.type || !body.clientName || !body.court || !body.facts || !body.demands) {
      return NextResponse.json(
        { ok: false, error: 'Gerekli alanlar: type, clientName, court, facts, demands' },
        { status: 400 }
      );
    }

    // 3) DB’ye kaydet
    await connectDB();
    const doc = await Petition.create({
      name: body.clientName,
      email: body.email ?? '',
      message: JSON.stringify({
        type: body.type,
        court: body.court,
        facts: body.facts,
        demands: body.demands,
      }),
      ip,
      ua: body.ua ?? '',
    });

    return NextResponse.json({ ok: true, id: String(doc._id), remaining });
  } catch (err) {
    Sentry.captureException(err, { tags: { route: '/api/petition' } });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

