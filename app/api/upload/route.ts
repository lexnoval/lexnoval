import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// pdf-parse CommonJS, require ile alınır
const pdfParse = require("pdf-parse") as (data: Buffer | Uint8Array) => Promise<{ text: string }>;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fileSchema = z.object({
  name: z.string().min(1),
  size: z.number().positive().max(10 * 1024 * 1024),
  type: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file alanı gerekli" }, { status: 400 });
    }

    const info = fileSchema.safeParse({
      name: file.name,
      size: file.size,
      type: file.type,
    });
    if (!info.success) {
      return NextResponse.json(
        { error: "Geçersiz dosya", details: info.error.flatten() },
        { status: 400 }
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const { text } = await pdfParse(buf);

    return NextResponse.json({ ok: true, name: file.name, size: file.size, text });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message ?? "unknown error" }, { status: 500 });
  }
}
