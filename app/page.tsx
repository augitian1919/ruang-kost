"use client";

import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Link from "next/link";

// ============ TYPES ============
interface Kamar {
  id: string;
  nomor_kamar: string;
  harga_bulanan: number;
  fasilitas: string;
  url_gambar?: string;
}

// ============ COMPONENT ============
export default function HomePage() {
  const [kamars, setKamars] = useState<Kamar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchKamars = async () => {
      try {
        const q = query(collection(db, "kamars"), where("status", "==", "tersedia"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Kamar[];
        setKamars(data.slice(0, 3));
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchKamars();
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTipeKamar = (nomor: string) => {
    if (nomor.toLowerCase().includes("vip")) return "VIP";
    if (nomor.toLowerCase().includes("deluxe")) return "Deluxe";
    return "Reguler";
  };

  const getTipeColor = (tipe: string) => {
    switch (tipe) {
      case "VIP": return "from-rose-400 to-orange-400";
      case "Deluxe": return "from-violet-400 to-fuchsia-400";
      default: return "from-sky-400 to-indigo-400";
    }
  };

  const getTipeBadge = (tipe: string) => {
    switch (tipe) {
      case "VIP": return "bg-rose-50 text-rose-600 border-rose-200";
      case "Deluxe": return "bg-violet-50 text-violet-600 border-violet-200";
      default: return "bg-sky-50 text-sky-600 border-sky-200";
    }
  };

  const fixImageUrl = (url?: string) => {
    if (!url) return "";
    if (url.includes("ibb.co") && !url.includes("i.ibb.co")) {
      return url.replace("ibb.co", "i.ibb.co");
    }
    return url;
  };

  const handleImageError = (kamarId: string) => {
    setImageErrors((prev) => new Set(prev).add(kamarId));
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] font-sans text-slate-700">

      {/* ===== NAVBAR ===== */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            RuangKost
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Tombol Admin Baru dengan desain identik seperti tombol Masuk */}
            <Link href="/admin" className="hidden sm:block">
              <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105 transition-all">
                Admin
              </button>
            </Link>
            <Link href="/login">
              <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105 transition-all">
                Masuk
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="pt-20 pb-24 px-4 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50 border border-indigo-100 rounded-full text-sm text-indigo-600 font-semibold mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Tersedia Kamar Kosong Bulan Ini
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-800 mb-8 leading-[1.1] tracking-tight">
            Temukan Kost{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Nyaman, Harga
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Terjangkau
            </span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Pilihan cerdas untuk hunian sementara Anda. Nikmati fasilitas lengkap, 
            lokasi yang sangat strategis, dan lingkungan aman untuk produktivitasmu.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/kamar-tersedia">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-200 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                🔍 Jelajahi Kamar
              </button>
            </Link>
            <Link href="/kontak">
              <button className="px-8 py-4 bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 rounded-2xl font-bold text-sm shadow-sm hover:shadow-md transition-all">
                📞 Hubungi Kami
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== KEUNTUNGAN ===== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-indigo-500 uppercase tracking-widest">Keunggulan</span>
            <h2 className="text-4xl font-black text-slate-800 mt-3 mb-4">
              Kenapa Memilih RuangKost?
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">Kami hadir untuk memberikan pengalaman tinggal terbaik dengan harga terjangkau.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { 
                icon: "🛏️", 
                title: "Fasilitas Lengkap", 
                desc: "Kamar mandi dalam, AC, Wi-Fi cepat, dan perabotan modern. Tinggal bawa koper!",
                gradient: "from-rose-100 to-orange-50",
                iconColor: "text-rose-500"
              },
              { 
                icon: "📍", 
                title: "Lokasi Strategis", 
                desc: "5 menit ke kampus & halte bus. Minimarket dan tempat makan di sekitar.",
                gradient: "from-emerald-100 to-teal-50",
                iconColor: "text-emerald-500"
              },
              { 
                icon: "🛡️", 
                title: "Aman & Nyaman", 
                desc: "CCTV 24 jam, akses kunci pintar, dan lingkungan yang tenang untuk istirahat.",
                gradient: "from-indigo-100 to-purple-50",
                iconColor: "text-indigo-500"
              },
            ].map((item, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${item.gradient} rounded-3xl p-8 border border-white/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center group`}>
                <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  <span className={item.iconColor}>{item.icon}</span>
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KAMAR POPULER ===== */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-sm font-bold text-purple-500 uppercase tracking-widest">Rekomendasi</span>
              <h2 className="text-4xl font-black text-slate-800 mt-2">Kamar Populer</h2>
              <p className="text-slate-400 mt-2">Pilihan terbaik dari penghuni kami.</p>
            </div>
            <Link href="/kamar-tersedia">
              <button className="text-sm font-bold text-indigo-600 hover:text-purple-600 flex items-center gap-1 transition-colors group">
                Lihat Semua <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {kamars.map((kamar) => {
                const tipe = getTipeKamar(kamar.nomor_kamar);
                const imageUrl = fixImageUrl(kamar.url_gambar);
                const hasImage = !!imageUrl && !imageErrors.has(kamar.id);

                return (
                  <Link key={kamar.id} href={`/kamar/${kamar.id}`}>
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
                      <div className="h-56 relative overflow-hidden">
                        {hasImage ? (
                          <img
                            src={imageUrl}
                            alt={kamar.nomor_kamar}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={() => handleImageError(kamar.id)}
                            loading="lazy"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${getTipeColor(tipe)} flex items-center justify-center`}>
                            <span className="text-6xl opacity-40">🏠</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl text-xs font-bold text-emerald-600 shadow-sm">
                          Tersedia
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm ${getTipeBadge(tipe)}`}>
                            {tipe}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-1">{kamar.nomor_kamar}</h3>
                        <p className="text-sm text-slate-400 mb-4">{kamar.fasilitas.split(",")[0]}...</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {formatRupiah(kamar.harga_bulanan)}
                          </span>
                          <span className="text-sm text-slate-400">/bulan</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-[2.5rem] p-12 sm:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">
                Siap Menemukan<br/>Kost Impian?
              </h2>
              <p className="text-indigo-100 mb-10 max-w-lg mx-auto text-lg">
                Jangan tunda lagi! Kamar terbaik bisa saja diambil orang lain. Segera booking sekarang juga.
              </p>
              <Link href="/kamar-tersedia">
                <button className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-bold text-base shadow-2xl hover:shadow-3xl hover:scale-105 transition-all">
                  🚀 Lihat Kamar Sekarang
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="font-black text-2xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                RuangKost
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Solusi hunian modern untuk mahasiswa dan pekerja. Nyaman, aman, dan terjangkau.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Menu</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/kamar-tersedia" className="text-slate-400 hover:text-indigo-400 transition-colors">Kamar Tersedia</Link></li>
                <li><Link href="/login" className="text-slate-400 hover:text-indigo-400 transition-colors">Masuk</Link></li>
                <li><Link href="/register" className="text-slate-400 hover:text-indigo-400 transition-colors">Daftar</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Kontak</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2">📍 Jl. Kasatrian No. 3, Sleman</li>
                <li className="flex items-center gap-2">📞 0858-0209-0008</li>
                <li className="flex items-center gap-2">✉️ info@ruangkost.id</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            © 2026 RuangKost. Dibuat dengan cinta untuk kenyamanan Anda 
          </div>
        </div>
      </footer>

    </div>
  );
}