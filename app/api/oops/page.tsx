"use client";

import { useState } from "react";

const DEMOS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_DEMOS === "true";

export default function OopsPage() {
  if (!DEMOS_ENABLED) {
    // Production veya demo kapalıyken görünmesin
    return null;
  }

  const [clicked, setClicked] = useState(false);

  const throwClientError = () => {
    setClicked(true);
    throw new Error("Client demo error: Butona basınca fırlatılan örnek hata.");
  };

  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Client Error Demo</h1>
      <p className="text-center max-w-xl">
        Bu sayfa sadece <code>Preview</code> ortamında açıktır. Butona basınca
        client tarafında kasıtlı bir hata fırlatır; Sentry’de bir <b>Frontend Exception</b>
        ve Replay kaydı oluşturur.
      </p>
      <button
        onClick={throwClientError}
        className="px-5 py-3 rounded-2xl shadow bg-black text-white"
      >
        Hata fırlat (client)
      </button>

      {clicked && (
        <p className="text-sm opacity-70">
          Butona basıldı; hata fırlatıldı. Sentry Issues & Replay’i kontrol et.
        </p>
      )}
    </main>
  );
}
