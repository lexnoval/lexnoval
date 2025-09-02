// app/api/petition/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { dbConnect } from '../../../lib/db';
import Petition from '../../../models/Petition';
import { checkRateLimit } from '../../../lib/rate-limit';

type Body = {
  type?: 'dilekçe' | 'itiraz' | 'istinaf' | 'temyiz';
  clientName: string;
  court: string;
  facts: string;
  demands: string;
  name?: string;
  email?: string;
  message?: string;
};

function isNonEmptyString(v: any, min = 1) {
  return typeof v === 'string' && v.trim().length >= min;
}

function parseBody(data: any):
  | { ok: true; value: Body }
  | { ok: false; errors: string[] } {
  if (!data || typeof data !== 'object') {
    return { ok: false, errors: ['Geçersiz gövde (JSON bekleniyor).'] };
  }

  const value: Body = {
    type: (['dilekçe', 'itiraz', 'istinaf', 'temyiz'] as const).includes(data.type)
      ? data.type
      : 'dilekçe',
    clientName: String(data.clientName ?? ''),
    court: String(data.court ?? ''),
    facts: String(data.facts ?? ''),
    demands: String(data.demands ?? ''),
    name: typeof data.name === 'string' ? data.name : undefined,
    email: typeof data.email === 'string' ? data.email : undefined,
    message: typeof data.message === 'string' ? data.message : undefined,
  };

  const errors: string[] = [];
  if (!isNonEmptyString(value.clientName, 2)) errors.push('clientName en az 2 karakter olmalı.');
  if (!isNonEmptyString(value.court, 2)) errors.push('court en az 2 karakter olmalı.');
  if (!isNonEmptyString(value.facts, 20)) errors.push('facts en az 20 karakter olmalı.');
  if (!isNonEmptyString(value.demands, 10)) errors.push('demands en az 10 karakter olmalı.');

  return errors.length ? { ok: false, errors } : { ok: true, value };
}

export async function POST(req: Request) {
  const h = headers();
  const ip =
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    '127.0.0.1';

  // 10 istek / 60sn limit
  const { ok, reset } = checkRateLimit(`petition:${ip}`, 10, 60_000);
  if (!ok) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(reset),
      },
    });
  }

  let json: any;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, errors: ['Geçersiz JSON.'] }, { status: 400 });
  }

  const parsed = parseBody(json);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 });
  }
  const data = parsed.value;

  await dbConnect();

  const doc = await Petition.create({
    name: data.name ?? data.clientName,
    email: data.email ?? undefined,
    message:
      data.message ??
      `Tür: ${data.type}\nMahkeme: ${data.court}\nOlaylar:\n${data.facts}\nTalepler:\n${data.demands}`,
    ip,
    ua: h.get('user-agent') || 'n/a',
  });

  const previewText =
    `Tür: ${data.type}\nMüvekkil: ${data.clientName}\nMahkeme: ${data.court}\n` +
    `---\nOlaylar:\n${data.facts}\n---\nTalepler:\n${data.demands}`;

  return NextResponse.json({ ok: true, id: String(doc._id), previewText });
}
