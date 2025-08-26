// app/api/oops/route.ts
export async function GET() {
  // Bilerek sunucu hatası fırlatıyoruz
  throw new Error('Test: server error from /api/oops');
}
