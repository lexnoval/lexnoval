import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { z } from "zod";

// Build & cache davranışı
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0 as const;
export const fetchCache = "force-no-store";

const fileSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  size: z.number().positive()
});

export async function GET() {
  // basit sağlık kontrolü
  return NextResponse.json({ ok: true, via: "GET /api/upload" });
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    // FormData doğrulaması
    if (!(file instanceof Blob)) {
      return NextResponse.json(
        { error: "file bekleniyor (multipart/form-data)" },
        { status: 400 }
      );
    }

    const meta = fileSchema.safeParse({
      name: (file as any).name ?? "unnamed",
      type: file.type,
      size: file.size
    });
    if (!meta.success) {
      return NextResponse.json(
        { error: "Geçersiz dosya", details: meta.error.flatten() },
        { status: 400 }
      );
    }

    // Yalnızca gelen dosyadan oku — yerel dosya YOK
    const buf = Buffer.from(await file.arrayBuffer());
    const parsed = await pdfParse(buf);

    return NextResponse.json({
      ok: true,
      via: "POST /api/upload",
      text: parsed.text
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "unknown error" },
      { status: 500 }
    );
  }
}





