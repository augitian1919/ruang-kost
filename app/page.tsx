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
      case "VIP": return "from-amber-400 to-orange-500";
      case "Deluxe": return "from-violet-400 to-purple-500";
      default: return "from-blue-400 to-cyan-500";
    }
  };

  const getTipeBadge = (tipe: string) => {
    switch (tipe) {
      case "VIP": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Deluxe": return "bg-violet-100 text-violet-700 border-violet-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 font-sans text-slate-800">

      {/* ===== NAVBAR ===== */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            RuangKost
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/kamar-tersedia" className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors hidden sm:block">
              Kamar
            </Link>
            <Link href="/login">
              <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-full text-sm font-semibold shadow-md shadow-blue-200 hover:shadow-lg transition-all">
                Masuk
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="pt-16 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm text-blue-700 font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Tersedia Kamar Kosong Bulan Ini
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Temukan Kost Nyaman,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Harga Terjangkau
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Pilihan cerdas untuk hunian sementara Anda. Nikmati fasilitas lengkap, 
            lokasi yang sangat strategis, dan lingkungan aman untuk mendukung produktivitasmu setiap hari.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/kamar-tersedia">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
                🔍 Lihat Pilihan Kamar
              </button>
            </Link>
            <Link href="/kontak">
              <button className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-300 hover:text-blue-600 rounded-xl font-bold text-sm transition-all">
                📞 Hubungi Pemilik
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="py-10 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { number: "50+", label: "Kamar Tersedia" },
              { number: "200+", label: "Penghuni Puas" },
              { number: "4.9", label: "Rating Google" },
              { number: "24/7", label: "Keamanan" },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KEUNTUNGAN ===== */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
              Kenapa Memilih RuangKost?
            </h2>
            <p className="text-slate-500">Kenyamanan Anda adalah prioritas utama kami.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "🛏️", title: "Fasilitas Lengkap", desc: "Kamar mandi dalam, AC dingin, Wi-Fi super cepat, dan perabotan modern siap pakai. Bawa koper saja!" },
              { icon: "📍", title: "Lokasi Strategis", desc: "Hanya 5 menit jalan kaki ke kampus dan halte bus. Dikelilingi minimarket dan tempat makan murah." },
              { icon: "🛡️", title: "Aman & Tenang", desc: "Dilengkapi dengan keamanan CCTV 24 jam dan akses kunci gerbang pintar untuk ketenangan istirahat Anda." },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-violet-100 rounded-2xl flex items-center justify-center text-3xl">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KAMAR POPULER ===== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Kamar Populer</h2>
              <p className="text-slate-500">Pilihan kamar favorit penghuni kami.</p>
            </div>
            <Link href="/kamar-tersedia">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                Lihat Semua →
              </button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {kamars.map((kamar) => {
                const tipe = getTipeKamar(kamar.nomor_kamar);
                const imageUrl = fixImageUrl(kamar.url_gambar);
                const hasImage = !!imageUrl && !imageErrors.has(kamar.id);

                return (
                  <Link key={kamar.id} href={`/kamar/${kamar.id}`}>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                      <div className="h-52 relative overflow-hidden">
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
                            <span className="text-5xl opacity-30">🏠</span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 px-2 py-1 bg-emerald-500/90 backdrop-blur-sm rounded-lg text-xs font-bold text-white">
                          Tersedia
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getTipeBadge(tipe)}`}>
                            {tipe}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-slate-800 mb-1">{kamar.nomor_kamar}</h3>
                        <p className="text-xs text-slate-500 mb-3">{kamar.fasilitas.split(",")[0]}...</p>
                        <div className="font-extrabold text-blue-600">{formatRupiah(kamar.harga_bulanan)}<span className="text-xs text-slate-400 font-normal">/bulan</span></div>
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
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                Siap Menemukan Kost Impian?
              </h2>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                Jangan tunda lagi! Kamar terbaik bisa saja diambil orang lain. 
                Segera lihat pilihan kamar yang tersedia.
              </p>
              <Link href="/kamar-tersedia">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all">
                  🚀 Lihat Kamar Sekarang
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-white border-t border-slate-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-extrabold text-lg bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
                RuangKost
              </h3>
              <p className="text-sm text-slate-500">
                Solusi hunian nyaman untuk mahasiswa dan pekerja dengan harga terjangkau.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-3">Menu</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/kamar-tersedia" className="hover:text-blue-600 transition-colors">Kamar Tersedia</Link></li>
                <li><Link href="/login" className="hover:text-blue-600 transition-colors">Masuk</Link></li>
                <li><Link href="/register" className="hover:text-blue-600 transition-colors">Daftar</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-3">Kontak</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>📍 Jl. Kampus No. 123, Yogyakarta</li>
                <li>📞 0812-3456-7890</li>
                <li>✉️ info@ruangkost.id</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-6 text-center text-sm text-slate-400">
            © 2026 RuangKost. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
