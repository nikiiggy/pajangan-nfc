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

 // Ambil parameter '?edit=true' dari URL jika ada
const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const { searchParams: serverParams } = new URL(request?.url || 'http://localhost');

// Cek apakah ada query parameter ?edit=true
const isEditMode = params?.edit === 'true' || searchParams?.get('edit') === 'true';

// JIKA SUDAH AKTIF DAN TIDAK DALAM MODE EDIT -> Direct ke Google Review
if (tagData && tagData.isActive && tagData.googleUrl && !isEditMode) {
  redirect(tagData.googleUrl);
}

  return (
    <div style={{ maxWidth: '400px', margin: '30px auto', padding: '24px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', margin: '0 0 8px 0', color: '#111' }}>Aktivasi Display</h2>
      <p style={{ textAlign: 'center', margin: '0 0 20px 0', color: '#666', fontSize: '14px' }}>ID Pajangan: <strong>{id}</strong></p>
      
      <form action="/api/activate" method="POST">
        <input type="hidden" name="tagId" value={id} />

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>1. Nama Toko / Bisnis:</label>
          <input 
            type="text" 
            id="storeName"
            name="storeName" 
            required 
            placeholder="Contoh: Kopi Kenangan" 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>2. Link Google Review Toko:</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
            <input 
              type="url" 
              id="googleUrl"
              name="googleUrl" 
              required 
              placeholder="Paste link https://maps.app.goo.gl/..." 
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            />
            <button 
              type="button" 
              id="btnSearch"
              style={{ padding: '10px 12px', backgroundColor: '#34a853', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap' }}
            >
              🔍 Cari Link
            </button>
          </div>
          <small style={{ color: '#666', fontSize: '12px', display: 'block', lineHeight: '1.4' }}>
            *Ketik Nama Toko, lalu klik tombol <b>Cari Link</b> di atas untuk membuka Google Maps & salin link ulasannya.
          </small>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>3. PIN Passcode Admin:</label>
          <input type="password" name="pin" required placeholder="Masukkan PIN Rahasia" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
          Simpan & Aktifkan Pajangan
        </button>
      </form>

      {/* Script Buka Google Maps Otomatis tanpa API */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('btnSearch').addEventListener('click', function() {
              const name = document.getElementById('storeName').value;
              if (!name) {
                alert('Silakan ketik Nama Toko terlebih dahulu!');
                return;
              }
              const searchUrl = 'https://www.google.com/maps/search/' + encodeURIComponent(name);
              window.open(searchUrl, '_blank');
            });
          `,
        }}
      />
    </div>
  );
}
