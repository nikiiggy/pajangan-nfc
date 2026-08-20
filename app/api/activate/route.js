import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const formData = await request.formData();
  const tagId = formData.get('tagId');
  const storeName = formData.get('storeName');
  const googleUrl = formData.get('googleUrl');
  const pin = formData.get('pin');

  // SETTING PIN RAHASIA KAMU DI SINI (Ganti '1234' sesuai keinginanmu)
  const PIN_RAHASIA = '1234';

  if (pin !== PIN_RAHASIA) {
    return new NextResponse('PIN Rahasia Salah! Akses Ditolak.', { status: 401 });
  }

  // Simpan data ke Database Vercel KV
  await kv.set(`tag:${tagId}`, {
    storeName: storeName,
    googleUrl: googleUrl,
    isActive: true,
    activatedAt: new Date().toISOString()
  });

  // Redirect kembali ke link tag agar langsung dicoba
  return NextResponse.redirect(new URL(`/r/${tagId}`, request.url));
}
