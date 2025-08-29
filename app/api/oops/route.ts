// app/api/oops/route.ts
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  // Sentry App Router'da bu hatayı otomatik yakalar
  throw new Error('Test: server error from /api/oops');
}









