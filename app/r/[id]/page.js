import { redirect } from 'next/navigation';
import { Redis } from '@upstash/redis';

export default async function Page({ params }) {
  const { id } = params;

  let tagData = null;
  try {
    const redis = Redis.fromEnv();
    tagData = await redis.get(`tag:${id}`);
  } catch (error) {
    console.log("Database belum terhubung atau kosong");
  }

  // Jika sudah aktif -> Redirect ke Google Maps
  if (tagData && tagData.isActive && tagData.googleUrl) {
    redirect(tagData.googleUrl);
  }

  // Jika belum aktif -> Tampilkan Form
  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '24px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', margin: '0 0 8px 0', color: '#111' }}>Aktivasi Display</h2>
      <p style={{ textAlign: 'center', margin: '0 0 20px 0', color: '#666', fontSize: '14px' }}>ID Pajangan: <strong>{id}</strong></p>
      
      <form action="/api/activate" method="POST">
        <input type="hidden" name="tagId" value={id} />

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Nama Toko / Bisnis:</label>
          <input type="text" name="storeName" required placeholder="Contoh: Kopi Kenangan" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Link Google Review Toko:</label>
          <input type="url" name="googleUrl" required placeholder="https://maps.app.goo.gl/xxxx" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>PIN Passcode Admin:</label>
          <input type="password" name="pin" required placeholder="Masukkan PIN Rahasia" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          Simpan & Aktifkan
        </button>
      </form>
    </div>
  );
}
