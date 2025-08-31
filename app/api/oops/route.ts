// app/api/oops/route.ts
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Not: wrapRouteHandlerWithSentry TEK argüman (handler) alır.
// Handler'ın imzası (req, ctx) olmalı. ctx'i kullanmasak da parametre olarak ekliyoruz.
export const GET = Sentry.wrapRouteHandlerWithSentry(
  async (_req: Request, _ctx: { params: Record<string, string | string[]> }) => {
    const isPreview = process.env.VERCEL_ENV === 'preview';
    const enabled = process.env.ENABLE_OOPS === '1';

    if (!isPreview && !enabled) {
      // prod’da endpoint gizli kalsın
      return NextResponse.json({ ok: false }, { status: 404 });
    }

    throw new Error('Sentry demo error from /api/oops');
  }
);
