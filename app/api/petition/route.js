export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { title, facts, demand } = await req.json();

    const prompt =
      `Türkçe resmi üslupta kısa ve okunabilir bir DİLEKÇE yaz.
Başlık: ${title}
Olaylar: ${facts}
Talep: ${demand}
Yapı: Başlık, Taraflar, Olaylar, Hukuki Değerlendirme, Sonuç ve Talep.
Sadece düz metin üret.`

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You write formal Turkish legal petitions. Output plain text only.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(JSON.stringify({ error: errText }), { status: 500 });
    }

    const data = await resp.json();
    const text =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ?? '';

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message ?? 'Unexpected error' }), { status: 500 });
  }
}
