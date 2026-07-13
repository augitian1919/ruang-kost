"use client";

import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, updateDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Pastikan path benar

interface SewaData {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  kamarId: string;
  nomorKamar: string;
  status: "menunggu_konfirmasi" | "disetujui";
  tanggal_pengajuan: any;
}

export default function AdminDashboardPage() {
  const [pengajuan, setPengajuan] = useState<SewaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch semua pengajuan yang statusnya masih menunggu
  const fetchData = async () => {
    setIsLoading(true);
    const q = query(collection(db, "sewa"), where("status", "==", "menunggu_konfirmasi"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SewaData));
    setPengajuan(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi Approve
  const handleApprove = async (sewaId: string, userId: string, kamarId: string) => {
    if (!confirm("Setujui pengajuan ini dan aktifkan akses penghuni?")) return;

    try {
      // 1. Update status sewa jadi disetujui
      await updateDoc(doc(db, "sewa", sewaId), {
        status: "disetujui"
      });

      // 2. (Opsional) Langsung buatkan tagihan bulan pertama
      await addDoc(collection(db, "tagihan"), {
        userId: userId,
        kamarId: kamarId,
        bulan: new Date().toLocaleDateString('id-ID', { month: 'long' }),
        tahun: new Date().getFullYear(),
        jumlah: 1000000, // Anda bisa ubah ini sesuai harga kamar
        status: "belum_bayar",
        tanggalJatuhTempo: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 hari dari sekarang
        dibuatOleh: "admin",
        createdAt: serverTimestamp()
      });

      alert("Pengajuan disetujui dan tagihan berhasil dibuat!");
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Error updating:", error);
      alert("Gagal memproses data");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-8">Admin Dashboard</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Pengajuan Sewa Masuk</h2>
          
          {isLoading ? (
            <p className="text-slate-500">Memuat data...</p>
          ) : pengajuan.length > 0 ? (
            <div className="space-y-4">
              {pengajuan.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-800">{item.userName}</div>
                    <div className="text-sm text-slate-500">Kamar {item.nomorKamar} • {item.userEmail}</div>
                  </div>
                  <button 
                    onClick={() => handleApprove(item.id, item.userId, item.kamarId)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Setujui
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-10">Tidak ada pengajuan baru.</p>
          )}
        </div>
      </div>
    </div>
  );
}