'use client';
import { useState } from "react";

export default function Home() {
  const [facts, setFacts] = useState("");
  const [demand, setDemand] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true); setResult("");
    const r = await fetch("/api/petition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ facts, demand })
    });
    const data = await r.json();
    setLoading(false);
    if (data.ok) setResult(data.text); else alert(data.error);
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Lexnoval — Dilekçe Asistanı (MVP)</h1>
      <textarea className="border p-2 w-full h-28 mb-2" placeholder="Olaylar"
        value={facts} onChange={e=>setFacts(e.target.value)} />
      <textarea className="border p-2 w-full h-24 mb-2" placeholder="Talep"
        value={demand} onChange={e=>setDemand(e.target.value)} />
      <button onClick={generate} className="border px-4 py-2" disabled={loading}>
        {loading ? "Oluşturuluyor..." : "Dilekçe Oluştur"}
      </button>
      {result && <div className="mt-4 border p-3 whitespace-pre-wrap">{result}</div>}
    </main>
  );
}
