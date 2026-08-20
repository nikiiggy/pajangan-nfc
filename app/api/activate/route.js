import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const tagId = formData.get('tagId');
    const storeName = formData.get('storeName');
    const googleUrl = formData.get('googleUrl');
    const pin = formData.get('pin');

    // PIN RAHASIA UNTUK AKTIVASI (Silakan ganti jika ingin PIN lain)
    const PIN_RAHASIA = '1234';

    if (pin !== PIN_RAHASIA) {
      return new NextResponse('PIN Rahasia Salah! Akses Ditolak.', { status: 401 });
    }

    // Mengambil variabel koneksi Redis secara otomatis
    const redis = Redis.fromEnv();

    // Simpan data ke Upstash Redis Database
    await redis.set(`tag:${tagId}`, {
      storeName: storeName,
      googleUrl: googleUrl,
      isActive: true,
      activatedAt: new Date().toISOString()
    });

    // Redirect kembali ke halaman tag agar langsung terlempar ke Google Maps
    return NextResponse.redirect(new URL(`/r/${tagId}`, request.url), 303);

  } catch (error) {
    console.error("Error Redis/Aktivasi:", error);
    return new NextResponse(`Terjadi Masalah Server/Database: ${error.message}`, { status: 500 });
  }
}
