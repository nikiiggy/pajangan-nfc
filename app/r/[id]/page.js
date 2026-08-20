import { redirect } from 'next/navigation';
import { kv } from '@vercel/kv';

export default async function Page({ params }) {
  const { id } = params;

  // Cek data tag di database Vercel KV
  let tagData = null;
  try {
    tagData = await kv.get(`tag:${id}`);
  } catch (error) {
    console.log("Database belum terhubung atau kosong");
  }

  // JIKA SUDAH AKTIF -> Langsung Lempar ke Google Maps Review
  if (tagData && tagData.isActive && tagData.googleUrl) {
    redirect(tagData.googleUrl);
  }

  // JIKA BELUM AKTIF -> Tampilkan Form Aktivasi
  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '12px' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Aktivasi Display Review</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>ID Pajangan: <strong>{id}</strong></p>
      <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />

      <form action="/api/activate" method="POST">
        <input type="hidden" name="tagId" value={id} />

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nama Toko / Bisnis:</label>
          <input type="text" name="storeName" required placeholder="Contoh: Kopi Kenangan" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Link Google Review Toko:</label>
          <input type="url" name="googleUrl" required placeholder="https://maps.app.goo.gl/xxxx" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>PIN Passcode Admin:</label>
          <input type="password" name="pin" required placeholder="Masukkan PIN Rahasia" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          Simpan & Aktifkan Pajangan
        </button>
      </form>
    </div>
  );
}
