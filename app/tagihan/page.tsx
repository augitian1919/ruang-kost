"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { 
  collection, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // Pastikan path ini sesuai
import Link from "next/link";

// ============ TYPES ============
interface TagihanData {
  id: string;
  bulan: string;
  tahun: number;
  jumlah: number;
  status: "lunas" | "belum_bayar" | "pending";
  tanggalJatuhTempo: Timestamp;
  tanggalBayar?: Timestamp;
  metodeBayar?: string;
}

// ============ COMPONENT ============
export default function TagihanPage() {
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tagihanList, setTagihanList] = useState<TagihanData[]>([]);
  const [statusSewa, setStatusSewa] = useState<string | null>(null); // State baru untuk status sewa
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

  // ============ DATA FETCHING ============
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setUserName(user.displayName || user.email?.split('@')[0] || "Penghuni");

      try {
        // 1. CEK STATUS SEWA TERLEBIH DAHULU
        const sewaQuery = query(
          collection(db, "sewa"),
          where("userId", "==", user.uid)
        );
        const sewaSnap = await getDocs(sewaQuery);
        if (!sewaSnap.empty) {
          // Ambil status dari dokumen sewa pertama yang ditemukan
          setStatusSewa(sewaSnap.docs[0].data().status);
        }

        // 2. AMBIL DATA TAGIHAN
        const tagihanQuery = query(
          collection(db, "tagihan"),
          where("userId", "==", user.uid)
        );
        const tagihanSnap = await getDocs(tagihanQuery);
        const data: TagihanData[] = [];
        
        tagihanSnap.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as TagihanData);
        });

        // Urutkan: belum_bayar di atas, sisanya diurutkan berdasarkan tanggal jatuh tempo terbaru
        data.sort((a, b) => {
          if (a.status === "belum_bayar" && b.status !== "belum_bayar") return -1;
          if (a.status !== "belum_bayar" && b.status === "belum_bayar") return 1;
          return b.tanggalJatuhTempo.toMillis() - a.tanggalJatuhTempo.toMillis();
        });

        setTagihanList(data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data tagihan");
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // ============ RENDER: LOADING & ERROR ============
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Memuat data tagihan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md border border-red-100">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Terjadi Kesalahan</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const tagihanBelumBayar = tagihanList.filter(t => t.status === "belum_bayar");
  const tagihanSelesai = tagihanList.filter(t => t.status !== "belum_bayar");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 font-sans text-slate-800 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ===== HEADER BAR ===== */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors text-lg">
            ⬅️
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Tagihan Keuangan
            </h1>
            <p className="text-slate-500 text-sm mt-1">Kelola dan pantau seluruh status pembayaran kontrakan Anda</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ===== LEFT/MAIN COLUMN: DAFTAR TAGIHAN ===== */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bagian 1: Perlu Pembayaran / Status Pending */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span>🚨</span> Perlu Dibayar
              </h3>
              
              {/* LOGIKA UI BARU DIMULAI DI SINI */}
              {statusSewa === "menunggu_konfirmasi" ? (
                // UI Jika Sewa Masih Pending
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 text-center border border-amber-200 shadow-sm">
                  <div className="text-5xl mb-4 animate-bounce">⏳</div>
                  <h4 className="font-bold text-amber-800 text-lg mb-2">Menunggu Konfirmasi Admin</h4>
                  <p className="text-sm text-amber-700/80 max-w-md mx-auto leading-relaxed">
                    Pengajuan sewa kamar Anda sedang diproses oleh admin. Rincian tagihan pembayaran akan otomatis diterbitkan di sini setelah pengajuan Anda disetujui.
                  </p>
                </div>
              ) : tagihanBelumBayar.length > 0 ? (
                // UI Jika Ada Tagihan
                <div className="space-y-4">
                  {tagihanBelumBayar.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-50/50 to-orange-50/30 rounded-bl-full"></div>
                      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                            Belum Bayar
                          </span>
                          <h4 className="text-xl font-bold text-slate-800 mt-2">Tagihan {item.bulan} {item.tahun}</h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1">⏰ Jatuh Tempo: <strong>{formatTanggal(item.tanggalJatuhTempo)}</strong></span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                          <div className="text-2xl font-black text-red-600">{formatRupiah(item.jumlah)}</div>
                          <Link href={`/tagihan/bayar/${item.id}`} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-100 transition-all">
                            Bayar Sekarang ➔
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // UI Jika Sudah Aktif & Tidak Ada Tunggakan
                <div className="bg-white rounded-2xl p-8 text-center border border-emerald-100/60 shadow-sm">
                  <div className="text-4xl mb-2">🎉</div>
                  <h4 className="font-bold text-slate-800 text-sm">Kerja Bagus, {userName}!</h4>
                  <p className="text-xs text-slate-500 mt-1">Semua tagihan Anda bulan ini telah diselesaikan dengan rapi.</p>
                </div>
              )}
            </div>

            {/* Bagian 2: Riwayat Transaksi Terdahulu */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span>📜</span> Riwayat Pembayaran Sebelumnya
              </h3>
              
              {tagihanSelesai.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                  {tagihanSelesai.map((item) => (
                    <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs ${item.status === 'lunas' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {item.status === 'lunas' ? '✅' : '⏳'}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-800">Bulan {item.bulan} {item.tahun}</div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {item.status === 'lunas' 
                              ? `Lunas pada: ${formatTanggal(item.tanggalBayar)}` 
                              : "Sedang diverifikasi admin"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-sm text-slate-800">{formatRupiah(item.jumlah)}</div>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${item.status === 'lunas' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {item.status === 'lunas' ? 'Lunas' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm bg-white rounded-2xl border border-slate-100 shadow-sm">
                  Belum memiliki riwayat transaksi apa pun.
                </div>
              )}
            </div>

          </div>

          {/* ===== RIGHT COLUMN: INFORMASI PEMBAYARAN ===== */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-100 relative overflow-hidden">
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
              <h3 className="font-bold text-base mb-3 flex items-center gap-2">
                <span>💡</span> Informasi Rekening Kost
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed mb-4">
                Pembayaran resmi RuangKost hanya dilayani melalui rekening di bawah ini:
              </p>
              <div className="space-y-3 border-t border-white/20 pt-3 text-sm">
                <div>
                  <div className="text-xs text-blue-200">Bank Transfer</div>
                  <div className="font-bold tracking-wide">Bank BCA — 4561258605</div>
                  <div className="text-xs text-blue-100/80">a.n. Augitian Alba Setiaji</div>
                </div>
                <div>
                  <div className="text-xs text-blue-200">E-Wallet</div>
                  <div className="font-bold tracking-wide">OVO / Dana — 085802090008</div>
                  <div className="text-xs text-blue-100/80">a.n. Augitian Alba Setiaji</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h4 className="font-bold text-sm text-slate-800 mb-2">Butuh Bantuan?</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">Jika nominal tagihan tidak sesuai atau Anda salah mengirimkan dana konfirmasi, hubungi layanan admin segera.</p>
              <Link href="/kontak" className="block text-center w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors">
                📞 Hubungi Customer Service
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}