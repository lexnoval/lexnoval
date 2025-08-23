// app/api/petition/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Vercel'de Node runtime kullan

function toChatMessages(prompt: string) {
  return [
    {
      role: 'system',
      content:
        'Türkçe resmi üslupta kısa ve okunabilir bir DİLEKÇE yaz. Gereksiz tekrarları çıkar, yazım/noktalama düzelt.',
    },
    { role: 'user', content: prompt },
  ] as const;
}

async function chat(model: string, messages: any[]) {
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.3,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text().catch(() => '');
    throw new Error(`OpenAI error (${resp.status}): ${err}`);
  }

  const data = await resp.json();
  return (
    data?.choices?.[0]?.message?.content?.toString?.() ||
    data?.choices?.[0]?.message?.content ||
    ''
  );
}

export async function POST(req: Request) {
  try {
    const { title, facts, demand } = await req.json();

    const basePrompt = `
Başlık: ${title ?? ''}
Olaylar (maddeler halinde): ${facts ?? ''}
Talep: ${demand ?? ''}

Yapı:
1) Başlık
2) Taraflar (varsa)
3) Olayların kısa özeti (madde madde)
4) Hukuki değerlendirme (çok kısa)
5) Sonuç ve Talep
Sadece metni döndür.
`.trim();

    // 1) Taslak (hızlı/uygun)
    const draft = await chat('gpt-4o-mini', toChatMessages(basePrompt));

    // 2) Nihai düzenleme (daha özenli)
    const finalText = await chat(
      'gpt-4o',
      toChatMessages(
        'Aşağıdaki taslağı Türk hukuku üslubuna uygun, temiz ve kısa resmi bir dilekçeye dönüştür:\n\n' +
          draft
      )
    );

    return NextResponse.json({ text: finalText });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'Unexpected error' },
      { status: 500 }
    );
  }
}
