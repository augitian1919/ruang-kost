import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigasi Atas */}
      <nav className="flex justify-between items-center py-4 px-6 md:px-12 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-blue-600 tracking-tighter">
          RuangKost<span className="text-orange-500">.</span>
        </h1>
        <div className="flex gap-4 items-center">
          
          {/* UBAH BAGIAN HREF DI BAWAH INI */}
          <Link 
            href="/login" 
            className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors px-4 py-2 hover:bg-blue-50 rounded-md"
          >
            Masuk
          </Link>

        </div>
      </nav>

      {/* Hero Section */}

      <section className="relative px-6 py-24 md:py-32 flex flex-col items-center text-center overflow-hidden">
        {/* Latar Belakang Gradien Halus */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white"></div>
        
        <div className="inline-block py-1 px-3 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-6">
          ✨ Tersedia Kamar Kosong Bulan Ini
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-4xl leading-tight">
          Temukan Kost Nyaman, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Serasa di Rumah Sendiri.
          </span>
        </h1>
        
        <p className="text-lg text-slate-600 mb-10 max-w-2xl leading-relaxed">
          Pilihan cerdas untuk hunian sementara Anda. Nikmati fasilitas lengkap, lokasi yang sangat strategis, dan lingkungan aman untuk mendukung produktivitasmu setiap hari.
        </p>
        
<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
  {/* UBAH DARI <button> MENJADI <Link> */}
<Link href="/kamar-tersedia" className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-blue-700 transition">
  Lihat Pilihan Kamar
</Link>
  
<Link 
  href="/kontak" 
  className="bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-full font-semibold hover:bg-slate-50 transition"
>
  Hubungi Pemilik
</Link>

</div>
      </section>

      {/* Keunggulan Section */}
      <section className="px-6 py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Kenapa Memilih RuangKost?</h2>
            <p className="text-slate-600">Kenyamanan Anda adalah prioritas utama kami.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card Fitur 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                🛏️
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Fasilitas Lengkap</h3>
              <p className="text-slate-600 leading-relaxed">
                Kamar mandi dalam, AC dingin, Wi-Fi super cepat, dan perabotan modern siap pakai. Bawa koper saja!
              </p>
            </div>

            {/* Card Fitur 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                📍
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Lokasi Strategis</h3>
              <p className="text-slate-600 leading-relaxed">
                Hanya 5 menit jalan kaki ke kampus dan halte bus. Dikelilingi minimarket dan tempat makan murah.
              </p>
            </div>

            {/* Card Fitur 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Aman & Tenang</h3>
              <p className="text-slate-600 leading-relaxed">
                Dilengkapi dengan keamanan CCTV 24 jam dan akses kunci gerbang pintar untuk ketenangan istirahat Anda.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Sederhana */}
      <footer className="bg-white py-8 border-t border-slate-100 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} RuangKost. Dibuat dengan cinta untuk kenyamanan Anda.</p>
      </footer>
    </div>
  );
}