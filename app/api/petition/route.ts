// app/api/petition/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs'; // OpenAI için edge yerine nodejs

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { title, facts, demand } = await req.json();

    const prompt = `
Türkçe resmi üslupta kısa, okunabilir bir DİLEKÇE taslağı hazırla.
- Başlık: ${title ?? ''}
- Olaylar (maddeler halinde): ${facts ?? ''}
- Talep: ${demand ?? ''}

Yapı:
1) Başlık
2) Taraflar (varsa)
3) Olayların kısa özeti (madde madde)
4) Hukuki değerlendirme (çok kısa)
5) Sonuç ve Talep

Sadece metin döndür.
    `.trim();

    // 1) Hızlı/ucuz taslak
    const draft = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
    });

    const draftText =
      draft?.output_text ||
      (draft as any)?.choices?.[0]?.message?.content?.toString?.() ||
      '';

    // 2) Son düzenleme – daha özenli çıktı
    const finalResp = await client.responses.create({
      model: 'gpt-4o',
      input:
        'Aşağıdaki taslağı Türk hukuku üslubuna uygun, temiz ve kısa bir resmi dilekçeye dönüştür. ' +
        'Yazım/noktalama düzelt; gereksiz tekrarları çıkar.\n\nTaslak:\n' +
        draftText,
    });

    const text =
      finalResp?.output_text ||
      (finalResp as any)?.choices?.[0]?.message?.content?.toString?.() ||
      draftText;

    return NextResponse.json({ text });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Unexpected error' },
      { status: 500 }
    );
  }
}
