// instrumentation.ts (PROJE KÖKÜ)
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Sentry server config'i yükle
    await import('./sentry.server.config');  // <-- DÜZELTİLEN YOL
  }

  // İstersen client tarafını da ekleyebilirsin (şart değil)
  // if (typeof window !== 'undefined') {
  //   await import('./sentry.client.config'); // kökteyse bu yol
  // }
}





