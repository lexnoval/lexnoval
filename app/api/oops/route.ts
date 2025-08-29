import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  // Preview'da ENABLE_OOPS=1 ise 500 fırlat; aksi halde 404 dön (prod dahil)
  if (process.env.ENABLE_OOPS !== '1') {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  throw new Error('Test: server error from /api/oops');
}











