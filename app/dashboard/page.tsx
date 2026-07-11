import Link from "next/link";

export default function CustomerDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Navbar Khusus Penghuni */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-blue-600">
          RuangKost<span className="text-orange-500">.</span>
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600 hidden sm:block">Halo, Budi Santoso</span>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">
            BS
          </div>
        </div>
      </nav>

      {/* Konten Utama Dashboard */}
      <main className="max-w-5xl mx-auto p-6 md:p-8">
        
        <header className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Dashboard Penghuni</h2>
          <p className="text-slate-500 mt-1">Pantau informasi kamar dan tagihan Anda bulan ini.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Info Kamar Customer */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Kamar Anda</p>
                  <h3 className="text-2xl font-bold text-slate-800">Tipe Eksklusif - A01</h3>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold tracking-wide">AKTIF</span>
              </div>
              <p className="text-slate-600 text-sm">Fasilitas: AC, Kamar Mandi Dalam, WiFi, TV, dan Lemari Pakaian.</p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
              <span className="text-slate-500">Masa sewa berakhir: <strong>10 Agustus 2026</strong></span>
              <button className="text-blue-600 font-medium hover:underline">Detail Kamar &rarr;</button>
            </div>
          </div>

          {/* Info Tagihan Customer */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-sm font-medium text-slate-500 mb-2">Tagihan Bulan Ini</p>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">Rp 1.500.000</h3>
            <p className="text-amber-600 text-sm font-medium flex items-center gap-1 mb-6">
              ⚠️ Belum Dibayar
            </p>
            <button className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm">
              Bayar Sekarang
            </button>
          </div>

        </div>

        {/* Menu Aksi / Layanan */}
        <h3 className="text-lg font-bold text-slate-800 mb-4">Layanan Cepat</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <Link href="/dashboard/riwayat" className="bg-white p-5 rounded-2xl border border-slate-100 text-center hover:border-blue-300 hover:shadow-sm transition group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📄</div>
            <p className="text-sm font-medium text-slate-700">Riwayat Bayar</p>
          </Link>
          
          <Link href="/dashboard/lapor" className="bg-white p-5 rounded-2xl border border-slate-100 text-center hover:border-blue-300 hover:shadow-sm transition group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🛠️</div>
            <p className="text-sm font-medium text-slate-700">Lapor Kerusakan</p>
          </Link>
          
          <Link href="/dashboard/peraturan" className="bg-white p-5 rounded-2xl border border-slate-100 text-center hover:border-blue-300 hover:shadow-sm transition group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📜</div>
            <p className="text-sm font-medium text-slate-700">Peraturan Kost</p>
          </Link>
          
          <Link href="/" className="bg-white p-5 rounded-2xl border border-slate-100 text-center hover:border-red-300 hover:shadow-sm transition group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🚪</div>
            <p className="text-sm font-medium text-red-600">Keluar</p>
          </Link>
          
        </div>

      </main>
    </div>
  );
}