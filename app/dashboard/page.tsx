"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { 
  doc, 
  getDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import Link from "next/link";

// ============ TYPES ============
interface KamarData {
  id: string;
  fasilitas: string;
  harga_bulanan: number;
  nomor_kamar: string;
  status: "tersedia" | "terisi";
}

interface SewaData {
  kamarId: string;
  kamarRef: string;
  tanggalMulai: Timestamp;
  tanggalSelesai: Timestamp;
  status: string;
  userId: string;
}

interface TagihanData {
  bulan: string;
  tahun: number;
  jumlah: number;
  status: "lunas" | "belum_bayar" | "pending";
  tanggalJatuhTempo: Timestamp;
  tanggalBayar?: Timestamp;
  kamarRef: string;
}

interface TagihanDataWithSort extends TagihanData {
  _tanggalBayarMs?: number;
}

// ============ COMPONENT ============
export default function CustomerDashboardPage() {
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Data states
  const [kamarSaya, setKamarSaya] = useState<KamarData | null>(null);
  const [sewaData, setSewaData] = useState<SewaData | null>(null);
  const [tagihanAktif, setTagihanAktif] = useState<TagihanData | null>(null);
  const [riwayatTagihan, setRiwayatTagihan] = useState<TagihanDataWithSort[]>([]);
  const [kamarTersedia, setKamarTersedia] = useState<KamarData[]>([]);

  const [error, setError] = useState<string | null>(null);

  // ============ HELPERS ============
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTanggal = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return "-";
    const date = timestamp.toDate();
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getSisaHari = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return null;
    const end = timestamp.toDate();
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getNamaBulan = () => {
    const now = new Date();
    return now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  // ============ DATA FETCHING ============
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setUserName(user.displayName || user.email?.split('@')[0] || "Penghuni");
      setUserEmail(user.email || "");
      setUserId(user.uid);

      try {
        // 1. Cek apakah user punya sewa aktif
        const sewaRef = doc(db, "sewa", user.uid);
        const unsubscribeSewa = onSnapshot(sewaRef, async (sewaSnap) => {
          if (sewaSnap.exists()) {
            const sewa = sewaSnap.data() as SewaData;
            setSewaData(sewa);

            // Ambil data kamar yang disewa
            if (sewa.kamarRef) {
              const kamarSnap = await getDoc(doc(db, "kamars", sewa.kamarRef));
              if (kamarSnap.exists()) {
                setKamarSaya({
                  id: kamarSnap.id,
                  ...kamarSnap.data()
                } as KamarData);
              }
            }

            // Ambil tagihan aktif (bulan ini yang belum bayar)
            const tagihanQuery = query(
              collection(db, "tagihan"),
              where("userId", "==", user.uid),
              where("status", "==", "belum_bayar")
            );
            const tagihanSnap = await getDocs(tagihanQuery);
            if (!tagihanSnap.empty) {
              setTagihanAktif(tagihanSnap.docs[0].data() as TagihanData);
            } else {
              setTagihanAktif(null);
            }

            // Ambil riwayat tagihan (3 terakhir yang sudah lunas)
            const riwayatQuery = query(
              collection(db, "tagihan"),
              where("userId", "==", user.uid),
              where("status", "==", "lunas")
            );
            const riwayatSnap = await getDocs(riwayatQuery);
            const riwayat = riwayatSnap.docs
              .map(doc => {
                const data = doc.data() as TagihanData;
                return {
                  ...data,
                  _tanggalBayarMs: data.tanggalBayar?.toMillis() || 0
                };
              })
              .sort((a, b) => (b._tanggalBayarMs || 0) - (a._tanggalBayarMs || 0))
              .slice(0, 3);
            setRiwayatTagihan(riwayat);

          } else {
            // User belum punya sewa -> ambil kamar tersedia
            setSewaData(null);
            setKamarSaya(null);
            setTagihanAktif(null);

            const kamarQuery = query(
              collection(db, "kamars"),
              where("status", "==", "tersedia")
            );
            const kamarSnap = await getDocs(kamarQuery);
            const kamars = kamarSnap.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as KamarData[];
            setKamarTersedia(kamars.slice(0, 3)); // Tampilkan 3 kamar
          }
        });

        setIsLoading(false);

        return () => {
          unsubscribeSewa();
        };

      } catch (err) {
        console.error("Error:", err);
        setError("Gagal memuat data dari Firestore");
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // ============ RENDER: LOADING ============
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  // ============ RENDER: ERROR ============
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md border border-red-100">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Terjadi Kesalahan</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const sisaHari = getSisaHari(sewaData?.tanggalSelesai);
  const hasRoom = !!kamarSaya;

  // ============ RENDER: MAIN ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 font-sans text-slate-800 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Halo, {userName}! 👋
            </h1>
            <p className="text-slate-500 mt-2 text-base">
              {hasRoom 
                ? `Anda menempati kamar ${kamarSaya?.nomor_kamar}` 
                : "Selamat datang di RuangKost"}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full shadow-sm border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
              {userName.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <div className="font-semibold text-sm text-slate-800">{userName}</div>
              <div className="text-xs text-slate-500">{userEmail}</div>
            </div>
          </div>
        </div>

        {/* ===== STATS CARDS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {/* Status Kamar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100/50 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                🏠
              </div>
              <span className="text-sm font-medium text-slate-500">Status Kamar</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {hasRoom ? kamarSaya.nomor_kamar : "Belum Aktif"}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {hasRoom 
                ? `${kamarSaya?.fasilitas?.split(',')[0] || 'Kamar'}` 
                : "Anda belum memiliki kamar"}
            </div>
          </div>

          {/* Tagihan */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100/50 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                💰
              </div>
              <span className="text-sm font-medium text-slate-500">Tagihan {getNamaBulan()}</span>
            </div>
            <div className={`text-2xl font-bold ${tagihanAktif ? 'text-red-500' : 'text-emerald-600'}`}>
              {tagihanAktif 
                ? formatRupiah(tagihanAktif.jumlah) 
                : "Lunas"}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {tagihanAktif 
                ? `Jatuh tempo: ${formatTanggal(tagihanAktif.tanggalJatuhTempo)}` 
                : "Tidak ada tagihan tertunda"}
            </div>
          </div>

          {/* Masa Sewa */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100/50 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                📅
              </div>
              <span className="text-sm font-medium text-slate-500">Masa Sewa</span>
            </div>
            <div className="text-2xl font-bold text-amber-500">
              {sisaHari !== null ? `${sisaHari} hari` : "-"}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {sewaData?.tanggalSelesai 
                ? `Berakhir: ${formatTanggal(sewaData.tanggalSelesai)}` 
                : "Belum ada data sewa"}
            </div>
          </div>
        </div>

        {/* ===== MAIN CARDS ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Pantau Kamar */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-blue-100/50 relative overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-50/60 to-violet-50/60 rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-200">
                  🔍
                </div>
                <h2 className="text-xl font-bold text-slate-800">Pantau Kamar</h2>
              </div>

              {hasRoom && kamarSaya ? (
                <div className="space-y-4">
                  {/* Detail Kamar */}
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-2xl font-bold text-blue-700">{kamarSaya.nomor_kamar}</div>
                        <div className="text-sm text-blue-500">{formatRupiah(kamarSaya.harga_bulanan)}/bulan</div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                        Aktif
                      </span>
                    </div>
                    <div className="border-t border-blue-200 pt-3">
                      <div className="text-xs text-slate-500 mb-1">Fasilitas:</div>
                      <div className="flex flex-wrap gap-2">
                        {kamarSaya.fasilitas?.split(',').map((f, i) => (
                          <span key={i} className="px-2 py-1 bg-white rounded-lg text-xs text-slate-600 border border-blue-100">
                            {f.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link href="/kamar">
                    <button className="w-full py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                      <span>📋</span> Lihat Detail Kamar
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Anda belum memiliki kamar yang aktif. Berikut beberapa kamar yang tersedia:
                  </p>

                  {/* Preview Kamar Tersedia */}
                  <div className="space-y-3 mb-6">
                    {kamarTersedia.length > 0 ? (
                      kamarTersedia.map((kamar) => (
                        <div key={kamar.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                          <div>
                            <div className="font-semibold text-sm text-slate-800">{kamar.nomor_kamar}</div>
                            <div className="text-xs text-slate-500">{kamar.fasilitas?.split(',')[0]}...</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-sm text-blue-600">{formatRupiah(kamar.harga_bulanan)}</div>
                            <span className="text-xs text-emerald-600 font-medium">Tersedia</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-slate-400 text-sm">Tidak ada kamar tersedia saat ini</div>
                    )}
                  </div>

                  <Link href="/kamar-tersedia">
                    <button className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
                      <span>🔎</span> Lihat Semua Kamar
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Tagihan Bulanan */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100/50 relative overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-50/60 to-teal-50/60 rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-200">
                  💳
                </div>
                <h2 className="text-xl font-bold text-slate-800">Tagihan Bulanan</h2>
              </div>

              {tagihanAktif ? (
                <div className="space-y-4">
                  <div className="p-5 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-sm text-slate-600">Tagihan {tagihanAktif.bulan} {tagihanAktif.tahun}</div>
                        <div className="text-3xl font-bold text-red-600 mt-1">{formatRupiah(tagihanAktif.jumlah)}</div>
                      </div>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold animate-pulse">
                        Belum Bayar
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-red-500">
                      <span>⏰</span>
                      <span>Jatuh tempo: {formatTanggal(tagihanAktif.tanggalJatuhTempo)}</span>
                    </div>
                  </div>

                  <Link href="/tagihan">
                    <button className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2">
                      <span>💵</span> Bayar Sekarang
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {hasRoom 
                      ? "Semua tagihan sudah lunas. Terima kasih atas pembayaran tepat waktunya!" 
                      : "Tidak ada tagihan yang tertunda saat ini."}
                  </p>
                  <div className="flex items-center gap-3 px-5 py-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl">
                      ✅
                    </div>
                    <div>
                      <div className="text-emerald-700 font-semibold text-sm">Status: Lunas & Aktif</div>
                      <div className="text-emerald-500 text-xs">Tidak ada tagihan yang perlu dibayar</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ===== RIWAYAT PEMBAYARAN ===== */}
        {hasRoom && (
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span>📜</span> Riwayat Pembayaran
              </h3>
              <Link href="/riwayat" className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Lihat Semua →
              </Link>
            </div>

            {riwayatTagihan.length > 0 ? (
              <div className="space-y-3">
                {riwayatTagihan.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                        {item.bulan?.slice(0, 3)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-800">{item.bulan} {item.tahun}</div>
                        <div className="text-xs text-slate-400">
                          Dibayar: {formatTanggal(item.tanggalBayar)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-slate-800">{formatRupiah(item.jumlah)}</div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                        Lunas
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <div className="text-3xl mb-2">📝</div>
                <p className="text-sm">Belum ada riwayat pembayaran</p>
              </div>
            )}
          </div>
        )}

        {/* ===== QUICK ACTIONS ===== */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "🏠", label: "Lihat Kamar", href: "/kamar" },
              { icon: "💵", label: "Bayar Tagihan", href: "/tagihan" },
              { icon: "📞", label: "Hubungi Admin", href: "/kontak" },
              { icon: "⚙️", label: "Pengaturan", href: "/pengaturan" },
            ].map((action, idx) => (
              <Link key={idx} href={action.href}>
                <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{action.icon}</div>
                  <div className="font-semibold text-sm text-slate-700">{action.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
