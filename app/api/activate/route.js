import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const formData = await request.formData();
  const tagId = formData.get('tagId');
  const storeName = formData.get('storeName');
  const googleUrl = formData.get('googleUrl');
  const pin = formData.get('pin');

  // PIN RAHASIA UNTUK AKTIVASI (Silakan ganti '1234' jika ingin PIN lain)
  const PIN_RAHASIA = '1234';

  if (pin !== PIN_RAHASIA) {
    return new NextResponse('PIN Rahasia Salah! Akses Ditolak.', { status: 401 });
  }

  const redis = Redis.fromEnv();
  await redis.set(`tag:${tagId}`, {
    storeName: storeName,
    googleUrl: googleUrl,
    isActive: true,
    activatedAt: new Date().toISOString()
  });

  return NextResponse.redirect(new URL(`/r/${tagId}`, request.url));
}
