"use client";

import { useState } from "react";
import * as Sentry from "@sentry/nextjs";

export default function SentryClientDemo() {
  const [sent, setSent] = useState(false);

  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="max-w-md w-full rounded-2xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Sentry Client Hata Demo</h1>

        <button
          className="rounded-2xl shadow px-4 py-2 bg-black text-white"
          onClick={() => {
            const err = new Error("Lexnoval client demo error");
            Sentry.captureException(err, {
              tags: { source: "client-demo" },
              extra: { clickedAt: new Date().toISOString() },
            });
            setSent(true);
          }}
        >
          Hata gönder
        </button>

        {sent && <p>Gönderildi! Sentry&apos;de Issues ve Replays sekmelerine bak.</p>}

      </div>
    </main>
  );
}

