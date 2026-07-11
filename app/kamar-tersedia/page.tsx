"use client";

import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";

// ============ TYPES ============
interface Kamar {
  id: string;
  nomor_kamar: string;
  harga_bulanan: number;
  fasilitas: string;
  status: string;
  url_gambar?: string;
  ukuran?: string;
  lantai?: number;
}

// ============ COMPONENT ============
export default function KamarTersediaPage() {
  const [kamars, setKamars] = useState<Kamar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterTipe, setFilterTipe] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"harga-asc" | "harga-desc" | "nama">("harga-asc");
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // ============ DATA FETCHING ============
  useEffect(() => {
    const fetchKamars = async () => {
      try {
        const q = query(collection(db, "kamars"), where("status", "==", "tersedia"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Kamar[];
        setKamars(data);
      } catch (err) {
        console.error("Error fetching kamars:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKamars();
  }, []);

  // ============ HELPERS ============
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getFasilitasList = (fasilitas: string) => {
    return fasilitas.split(",").map((f) => f.trim()).filter(Boolean);
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

  const getTipeBg = (tipe: string) => {
    switch (tipe) {
      case "VIP": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Deluxe": return "bg-violet-50 text-violet-700 border-violet-200";
      default: return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const handleImageError = (kamarId: string) => {
    setImageErrors((prev) => new Set(prev).add(kamarId));
  };

  const getImageUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes("ibb.co") && !url.includes("i.ibb.co")) {
      return url.replace("ibb.co", "i.ibb.co");
    }
    return url;
  };

  // ============ FILTER & SORT ============
  const filteredKamars = kamars
    .filter((k) => {
      const tipe = getTipeKamar(k.nomor_kamar);
      const matchTipe = filterTipe === "semua" || tipe === filterTipe;
      const matchSearch = k.nomor_kamar.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         k.fasilitas.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTipe && matchSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "harga-asc": return a.harga_bulanan - b.harga_bulanan;
        case "harga-desc": return b.harga_bulanan - a.harga_bulanan;
        case "nama": return a.nomor_kamar.localeCompare(b.nomor_kamar);
        default: return 0;
      }
    });

  // ============ RENDER: LOADING ============
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Memuat kamar...</p>
        </div>
      </div>
    );
  }

  // ============ RENDER: MAIN ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 font-sans text-slate-800 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ===== HEADER ===== */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-4 inline-flex items-center gap-1 transition-colors">
            ← Kembali ke Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                🏠 Kamar Tersedia
              </h1>
              <p className="text-slate-500 mt-2">
                {kamars.length} kamar siap dihuni — pilih yang paling cocok untuk Anda
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-medium text-slate-600">{kamars.length} Tersedia</span>
            </div>
          </div>
        </div>

        {/* ===== SEARCH & FILTER BAR ===== */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
              <input
                type="text"
                placeholder="Cari kamar atau fasilitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
              />
            </div>

            {/* Filter Tipe */}
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {["semua", "VIP", "Deluxe", "Reguler"].map((tipe) => (
                <button
                  key={tipe}
                  onClick={() => setFilterTipe(tipe)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    filterTipe === tipe
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tipe === "semua" ? "Semua" : tipe}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm bg-white cursor-pointer"
            >
              <option value="harga-asc">💰 Harga: Rendah → Tinggi</option>
              <option value="harga-desc">💰 Harga: Tinggi → Rendah</option>
              <option value="nama">🔤 Nama Kamar</option>
            </select>
          </div>
        </div>

        {/* ===== KAMAR GRID ===== */}
        {filteredKamars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredKamars.map((kamar) => {
              const tipe = getTipeKamar(kamar.nomor_kamar);
              const fasilitasList = getFasilitasList(kamar.fasilitas);
              const imageUrl = getImageUrl(kamar.url_gambar);
              const hasImage = !!imageUrl && !imageErrors.has(kamar.id);

              return (
                <div
                  key={kamar.id}
                  className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Card Header dengan Gambar */}
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
                      <div className={`w-full h-full bg-gradient-to-br ${getTipeColor(tipe)} relative flex items-center justify-center`}>
                        <div className="text-center">
                          <span className="text-6xl opacity-30">🏠</span>
                          {!kamar.url_gambar && (
                            <p className="text-white/60 text-sm mt-2">Belum ada gambar</p>
                          )}
                          {kamar.url_gambar && imageErrors.has(kamar.id) && (
                            <p className="text-white/60 text-sm mt-2">Gagal memuat gambar</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>

                    {/* Badge Tipe */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${getTipeBg(tipe)} shadow-sm`}>
                        {tipe}
                      </span>
                    </div>

                    {/* Badge Tersedia */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1.5 bg-emerald-500/90 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                        Tersedia
                      </span>
                    </div>

                    {/* Nama Kamar di bawah */}
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <h3 className="text-white font-bold text-xl drop-shadow-lg">{kamar.nomor_kamar}</h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Harga */}
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-2xl font-extrabold text-slate-800">{formatRupiah(kamar.harga_bulanan)}</span>
                      <span className="text-sm text-slate-400">/bulan</span>
                    </div>

                    {/* Fasilitas */}
                    <div className="mb-5">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Fasilitas</div>
                      <div className="flex flex-wrap gap-2">
                        {fasilitasList.slice(0, 5).map((f, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium border border-slate-100"
                          >
                            {f}
                          </span>
                        ))}
                        {fasilitasList.length > 5 && (
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium border border-blue-100">
                            +{fasilitasList.length - 5} lainnya
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Info tambahan */}
                    <div className="flex items-center gap-4 mb-5 text-sm text-slate-500">
                      {kamar.ukuran && (
                        <div className="flex items-center gap-1">
                          <span>📐</span>
                          <span>{kamar.ukuran}</span>
                        </div>
                      )}
                      {kamar.lantai && (
                        <div className="flex items-center gap-1">
                          <span>🏢</span>
                          <span>Lantai {kamar.lantai}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span>⚡</span>
                        <span>Listrik Included</span>
                      </div>
                    </div>

                    {/* Action Button dengan Link */}
                    <Link href={`/kamar/${kamar.id}`}>
                      <button className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group-hover:shadow-xl active:scale-[0.98]">
                        <span>📋</span> Lihat Detail & Pesan
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Tidak ada kamar ditemukan</h3>
            <p className="text-slate-500 mb-6">Coba ubah filter atau kata kunci pencarian Anda</p>
            <button
              onClick={() => { setFilterTipe("semua"); setSearchQuery(""); }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* ===== INFO SECTION ===== */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: "🛡️", title: "Aman & Nyaman", desc: "Keamanan 24 jam dan lingkungan bersih" },
            { icon: "📍", title: "Lokasi Strategis", desc: "Dekat kampus, pusat perbelanjaan, dan transportasi" },
            { icon: "💬", title: "Admin Responsif", desc: "Siap membantu kapan saja Anda butuhkan" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center hover:shadow-md transition-all">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
