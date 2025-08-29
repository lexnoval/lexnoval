export const runtime = 'nodejs';        // Node.js runtime
export const dynamic = 'force-dynamic'; // bu endpoint'i her istekte çalıştır

export async function GET() {
  // Sentry'yi test etmek için bilerek 500 fırlatıyoruz
  throw new Error('Test: server error from /api/oops');
}
