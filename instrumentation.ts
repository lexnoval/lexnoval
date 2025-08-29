// instrumentation.ts (PROJE KÖKÜ)
export async function register() {

  // ⬇️ EKLEDİĞİMİZ SATIR — ilk satırda olsun
  console.log('[instrumentation] boot:', process.env.NEXT_RUNTIME);

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config'); // kökteki dosya
  }

  // İstersen client tarafını da ekleyebilirsin:
  // if (typeof window !== 'undefined') await import('./sentry.client.config');
}







