// app/api/upload/route.ts
// Bu route her zaman Node.js runtime'ında ve tamamen dinamik çalışsın:
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

// Basit sağlık kontrolü
export async function GET() {
  return NextResponse.json({
    ok: true,
    via: 'GET /api/upload',
    accepts: 'multipart/form-data',
    usage: 'POST ile "file" alanında PDF gönderin',
  });
}

// PDF yükleme
export async function POST(req: NextRequest) {
  try {
    // 1) form-data oku
    const form = await req.formData();
    const file = form.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { ok: false, error: 'Form-data içinde "file" alanı bulunamadı.' },
        { status: 400 }
      );
    }

    // (opsiyonel) tür kontrolü
    const mime = (file as File).type || '';
    if (!mime.includes('pdf')) {
      return NextResponse.json(
        { ok: false, error: `PDF bekleniyordu, gelen tür: "${mime || 'unknown'}"` },
        { status: 415 }
      );
    }

    // 2) File -> Buffer
    const ab = await (file as File).arrayBuffer();
    const buf = Buffer.from(ab);

    // 3) pdf-parse ile çözümle
    const parsed = await pdfParse(buf);

    // 4) Sonucu döndür
    return NextResponse.json({
      ok: true,
      via: 'POST /api/upload',
      bytes: buf.length,
      meta: {
        numpages: parsed.numpages,
        numrender: parsed.numrender,
        info: parsed.info ?? null,
        version: parsed.version ?? null,
      },
      // Çok uzun olmasın diye metnin sadece başını döndürüyoruz
      textPreview: parsed.text?.slice(0, 1000) ?? '',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}





















