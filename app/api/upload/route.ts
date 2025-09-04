// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { z } from "zod";

// Build'da prerender/toplama denemesini kapat
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// NOT: Module scope'ta FS/yerel dosya okuma YAPMA!
// Her şey handler içinde çalışsın.

const fileSchema = z
  .instanceof(Blob, { message: "Dosya bulunamadı" })
  .refine((b) => b.type === "application/pdf", "Yalnızca PDF kabul edilir");

export async function GET() {
  // Sade bir sağlık kontrolü; FS/parse yok
  return NextResponse.json({ ok: true, via: "GET /api/upload" });
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    // Tip ve mime doğrulama
    if (!fileSchema.safeParse(file).success) {
      return NextResponse.json(
        { error: "Geçersiz dosya" },
        { status: 400 }
      );
    }

    // Blob -> Buffer
    const buf = Buffer.from(await (file as Blob).arrayBuffer());

    // PDF'i parse et
    const parsed = await pdfParse(buf);

    return NextResponse.json({
      ok: true,
      via: "POST /api/upload",
      text: parsed.text ?? "",
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "unknown error" },
      { status: 500 }
    );
  }
}


