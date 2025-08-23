import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { title = "Dilekçe", facts, demand } = await req.json();

    // 1) Taslak (uygun maliyet)
    const draft = await client.responses.create({
      model: "gpt-4o-mini",
      input:
        `Türkçe resmi üslupta kısa bir dilekçe taslağı yaz. ` +
        `Başlık: ${title}. Olaylar: ${facts}. Talep: ${demand}. ` +
        `Yapı: Başlık, Taraflar, Olaylar, Hukuki Değerlendirme, Sonuç ve Talep. ` +
        `Sadece metin ver.`
    });

    const draftText = draft.output_text || "";

    // 2) Nihai düzenleme (kalite)
    const final = await client.responses.create({
      model: "gpt-4o",
      input:
        `Aşağıdaki taslağı Türk hukuku üslubuna uygun biçimde ` +
        `resmileştir; yazım/dilbilgisini düzelt; başlıkları koru.\n\n` +
        draftText
    });

    return NextResponse.json({ ok: true, text: final.output_text || draftText });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "error" }, { status: 500 });
  }
}
