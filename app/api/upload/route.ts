// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { z } from "zod";
import { parseUDF } from "@/lib/udf";

export const runtime = "nodejs"; // pdf-parse için Node runtime

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const AllowedMime = [
  "application/pdf",
  "text/plain",
  "application/octet-stream",
];

const QuerySchema = z.object({
  // İleride opsiyonel bayraklar eklemek istersen
});

export async function POST(req: NextRequest) {
  try {
    // (opsiyonel) query parse
    const url = new URL(req.url);
    const qs = Object.fromEntries(url.searchParams.entries());
    const _parsed = QuerySchema.safeParse(qs);
    // kullanmıyoruz ama yer hazır

    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "file alanı zorunludur" },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "Boş dosya yüklenemez" },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `Dosya çok büyük (>${MAX_SIZE / (1024 * 1024)}MB)` },
        { status: 413 }
      );
    }

    const mime = file.type || "application/octet-stream";
    if (!AllowedMime.includes(mime) && !file.name.toLowerCase().endsWith(".udf") && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: `İzin verilmeyen içerik türü: ${mime}` },
        { status: 415 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // PDF mi UDF mi?
    const isPdf =
      mime === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isUdf = file.name.toLowerCase().endsWith(".udf") || mime === "text/plain" || mime === "application/octet-stream";

    if (isPdf) {
      const pdfData = await pdfParse(buffer);
      return NextResponse.json({
        ok: true,
        type: "pdf",
        fileName: file.name,
        meta: {
          nPages: pdfData.numpages,
          info: pdfData.info ?? null,
          metadata: pdfData.metadata ? pdfData.metadata._metadata : null,
        },
        extractedText: pdfData.text ?? "",
      });
    }

    if (isUdf) {
      const text = buffer.toString("utf8");
      const parsed = parseUDF(text);
      return NextResponse.json({
        ok: true,
        type: "udf",
        fileName: file.name,
        fields: parsed,
      });
    }

    // Bu noktaya düşmemeli ama korunma amaçlı
    return NextResponse.json(
      { error: "Dosya türü anlaşılamadı" },
      { status: 400 }
    );
  } catch (err: any) {
    // Basit logging
    console.error("UPLOAD_ERROR", err);
    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu", detail: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}


