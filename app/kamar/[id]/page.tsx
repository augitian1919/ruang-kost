"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import Link from "next/link";

// ============ TYPES ============
interface KamarDetail {
  id: string;
  nomor_kamar: string;
  harga_bulanan: number;
  fasilitas: string;
  status: string;
  url_gambar?: string;
  deskripsi?: string;
  ukuran?: string;
  lantai?: number;
  kapasitas?: number;
}

// ============ COMPONENT ============
export default function DetailKamarPage() {
  const params = useParams();
  const kamarId = params.id as string;

  const [kamar, setKamar] = useState<KamarDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // ============ DATA FETCHING ============
  useEffect(() => {
    const fetchKamar = async () => {
      if (!kamarId) return;
      try {
        const docRef = doc(db, "kamars", kamarId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setKamar({
            id: docSnap.id,
            ...docSnap.data(),
          } as KamarDetail);
        }
      } catch (err) {
        console.error("Error fetching kamar:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKamar();
  }, [kamarId]);

  // ============ HELPERS ============
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
      case "VIP": return "from-amber-500 to-orange-600";
      case "Deluxe": return "from-violet-500 to-purple-600";
      default: return "from-blue-500 to-cyan-600";
    }
  };

  const getTipeBadge = (tipe: string) => {
    switch (tipe) {
      case "VIP": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Deluxe": return "bg-violet-100 text-violet-700 border-violet-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getFasilitasList = (fasilitas: string) => {
    return fasilitas.split(",").map((f) => f.trim()).filter(Boolean);
  };

  const fixImageUrl = (url?: string) => {
    if (!url) return "";
    if (url.includes("ibb.co") && !url.includes("i.ibb.co")) {
      return url.replace("ibb.co", "i.ibb.co");
    }
    return url;
  };

  // ============ RENDER: LOADING ============
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Memuat detail kamar...</p>
        </div>
      </div>
    );
  }

  // ============ RENDER: NOT FOUND ============
  if (!kamar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md border border-slate-100">
          <div className="text-5xl mb-4">🏠</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Kamar Tidak Ditemukan</h2>
          <p className="text-slate-500 mb-6">Kamar yang Anda cari tidak tersedia atau sudah dihapus.</p>
          <Link href="/kamar-tersedia">
            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
              ← Lihat Kamar Lain
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const tipe = getTipeKamar(kamar.nomor_kamar);
  const fasilitasList = getFasilitasList(kamar.fasilitas);
  const imageUrl = fixImageUrl(kamar.url_gambar);
  const hasImage = !!imageUrl && !imageError;

  // ============ RENDER: MAIN ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 font-sans text-slate-800 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ===== BREADCRUMB ===== */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <span>/</span>
          <Link href="/kamar-tersedia" className="hover:text-blue-600 transition-colors">Kamar</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">{kamar.nomor_kamar}</span>
        </div>

        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">
                {kamar.nomor_kamar}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getTipeBadge(tipe)}`}>
                {tipe}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{kamar.status === "tersedia" ? "Tersedia" : "Terisi"}</span>
              {kamar.lantai && <span>• Lantai {kamar.lantai}</span>}
              {kamar.ukuran && <span>• {kamar.ukuran}</span>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              {formatRupiah(kamar.harga_bulanan)}
            </div>
            <div className="text-sm text-slate-400">/bulan</div>
          </div>
        </div>

        {/* ===== GAMBAR ===== */}
        <div className="h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 relative mb-8 group">
          {hasImage ? (
            <img
              src={imageUrl}
              alt={kamar.nomor_kamar}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getTipeColor(tipe)} flex items-center justify-center`}>
              <span className="text-8xl opacity-30">🏠</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
        </div>

        {/* ===== CONTENT GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Deskripsi */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span>📝</span> Tentang Kamar
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {kamar.deskripsi || `Kamar ${kamar.nomor_kamar} adalah kamar ${tipe.toLowerCase()} yang nyaman dan strategis. 
                Dilengkapi dengan fasilitas lengkap untuk kenyamanan penghuni. 
                Lokasi aman dengan akses mudah ke berbagai fasilitas umum.`}
              </p>
            </div>

            {/* Fasilitas */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span>✨</span> Fasilitas Lengkap
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {fasilitasList.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-emerald-500">✓</span>
                    <span className="text-sm font-medium text-slate-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Tambahan */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span>📋</span> Informasi Kamar
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Tipe", value: tipe, icon: "🏷️" },
                  { label: "Ukuran", value: kamar.ukuran || "3x4 m", icon: "📐" },
                  { label: "Lantai", value: kamar.lantai ? `Lantai ${kamar.lantai}` : "1", icon: "🏢" },
                  { label: "Kapasitas", value: `${kamar.kapasitas || 1} Orang`, icon: "👤" },
                ].map((item, idx) => (
                  <div key={idx} className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-xs text-slate-400 mb-1">{item.label}</div>
                    <div className="font-bold text-slate-800 text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Syarat & Ketentuan */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span>📌</span> Syarat & Ketentuan
              </h2>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Minimal sewa 3 bulan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Pembayaran dilakukan setiap awal bulan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Pemutusan kontrak minimal 1 bulan sebelumnya</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Booking Card (TANPA DEPOSIT) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 mb-4">💳 Ringkasan Biaya</h3>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-500">Sewa Bulanan</span>
                  <span className="font-bold text-2xl text-blue-600">{formatRupiah(kamar.harga_bulanan)}</span>
                </div>
                <div className="text-xs text-slate-400 text-right">/bulan</div>
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 mb-3 active:scale-[0.98]">
                <span>📋</span> Ajukan Sewa Sekarang
              </button>

              <button className="w-full py-3 border-2 border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2">
                <span>💬</span> Tanya Admin
              </button>

              <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 text-lg">💡</span>
                  <p className="text-xs text-blue-700">
                    Dengan mengajukan sewa, Anda menyetujui syarat dan ketentuan yang berlaku.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ===== KAMAR LAINNYA ===== */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-800 mb-6">🏠 Kamar Lainnya</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { nama: "A-2 Kamar VIP", harga: 850000, fasilitas: "AC, Kasur, Lemari", tipe: "VIP" },
              { nama: "B-2 Kamar Reguler", harga: 600000, fasilitas: "Kasur, Lemari, Meja", tipe: "Reguler" },
              { nama: "C-1 Kamar Deluxe", harga: 750000, fasilitas: "AC, Kasur, TV", tipe: "Deluxe" },
            ].map((k, idx) => (
              <Link key={idx} href="/kamar-tersedia">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-800">{k.nama}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      k.tipe === "VIP" ? "bg-amber-100 text-amber-700" :
                      k.tipe === "Deluxe" ? "bg-violet-100 text-violet-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {k.tipe}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{k.fasilitas}</p>
                  <div className="font-bold text-blue-600">{formatRupiah(k.harga)}/bulan</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
