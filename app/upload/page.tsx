// app/upload/page.tsx
"use client";

import React, { useState } from "react";

type ApiResult =
  | {
      ok: true;
      type: "pdf";
      fileName: string;
      meta: { nPages?: number; info?: any; metadata?: any };
      extractedText: string;
    }
  | {
      ok: true;
      type: "udf";
      fileName: string;
      fields: Record<string, unknown>;
    }
  | { ok?: false; error: string; detail?: string };

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setResult(null);
    if (!file) {
      setErr("Lütfen bir dosya seçin (.pdf veya .udf)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErr("Dosya 10MB sınırını aşıyor");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json: ApiResult = await res.json();
      setResult(json);
      if (!res.ok) {
        setErr((json as any)?.error ?? "Yükleme/parse hatası");
      }
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Belge Yükle (PDF / UDF)</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="file"
          accept=".pdf,.udf,application/pdf,text/plain"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-xl shadow border"
        >
          {loading ? "Yükleniyor..." : "Yükle ve Çözümle"}
        </button>
      </form>

      {err && (
        <div className="text-red-600 border border-red-300 rounded-lg p-3">
          {err}
        </div>
      )}

      {result?.ok && result.type === "pdf" && (
        <div className="space-y-3 border rounded-xl p-4">
          <div className="font-semibold">Tür: PDF</div>
          <div>Dosya: {result.fileName}</div>
          <div>Sayfa sayısı: {result.meta?.nPages ?? "-"}</div>
          <details>
            <summary className="cursor-pointer">Metni Göster</summary>
            <pre className="whitespace-pre-wrap text-sm">
              {result.extractedText?.slice(0, 20000) /* çok uzun olmasın */}
            </pre>
          </details>
        </div>
      )}

      {result?.ok && result.type === "udf" && (
        <div className="space-y-3 border rounded-xl p-4">
          <div className="font-semibold">Tür: UDF</div>
          <div>Dosya: {result.fileName}</div>
          <details open>
            <summary className="cursor-pointer">Alanlar</summary>
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(result.fields, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {result && result.ok === false && (
        <div className="text-red-600 border border-red-300 rounded-lg p-3">
          {(result as any).error ?? "Hata"}
        </div>
      )}
    </div>
  );
}



