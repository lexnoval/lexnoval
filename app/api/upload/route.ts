// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { z } from "zod";

// Build'da bu route'u asla statikleştirme / prerender etme
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const fileSchema = z.object({
  file: z.any(), // formData() ile gelen Blob için basit doğrulama
});

export async function GET() {
  return NextResponse.json({ ok: true, via: "GET /api/upload" });
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    const info = fileSchema.safeParse({ file });
    if (!info.success || !file) {
      return NextResponse.json(
        { error: "Geçersiz dosya", details: info.error?.flatten?.() },
        { status: 400 }
      );
    }

    // Blob -> Buffer
    const buf = Buffer.from(await (file as Blob).arrayBuffer());

    // Yalnızca upload'tan gelen Buffer ile parse et
    const parsed = await pdfParse(buf);

    return NextResponse.json({
      ok: true,
      text: parsed.text,
      meta: {
        numpages: parsed.numpages,
        version: parsed.version,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "unknown error" },
      { status: 500 }
    );
  }
}






