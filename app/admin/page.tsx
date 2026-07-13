"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// ============ TYPES ============
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

// ============ COMPONENT ============
export default function AdminDashboardPage() {
  const router = useRouter();
  const [pengajuan, setPengajuan] = useState<SewaData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ============ FETCH DATA PENGAJUAN SEWA ============
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "sewa"), 
        where("status", "==", "menunggu_konfirmasi")
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SewaData));
      setPengajuan(data);
    } catch (error) {
      console.error("Gagal mengambil data pengajuan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ============ PROTEKSI & AUTENTIKASI ADMIN ============
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      // Validasi email admin khusus
      const ADMIN_EMAIL = "augitianalba@gmail.com"; 
      if (user.email !== ADMIN_EMAIL) {
        router.push("/dashboard"); 
        return;
      }

      // Jika lolos, ambil data dari database
      fetchData();
    });

    return () => unsubscribe();
  }, [router]);

  // ============ PROSES APPROVAL SEWA & BUAT TAGIHAN ============
  const handleApprove = async (sewaId: string, userId: string, kamarId: string) => {
    if (!confirm("Setujui pengajuan ini dan aktifkan akses penghuni?")) return;

    try {
      // 1. Update status sewa menjadi disetujui
      await updateDoc(doc(db, "sewa", sewaId), {
        status: "disetujui"
      });

      // 2. Otomatis buatkan data tagihan pertama untuk user tersebut
      await addDoc(collection(db, "tagihan"), {
        userId: userId,
        kamarId: kamarId,
        bulan: new Date().toLocaleDateString('id-ID', { month: 'long' }),
        tahun: new Date().getFullYear(),
        jumlah: 1000000, // Nominal bawaan, silakan sesuaikan dengan tarif kost Anda
        status: "belum_bayar",
        tanggalJatuhTempo: new Date(new Date().setDate(new Date().getDate() + 7)), // Batas waktu bayar 7 hari ke depan
        dibuatOleh: "admin",
        createdAt: serverTimestamp()
      });

      alert("Pengajuan berhasil disetujui dan tagihan perdana telah diterbitkan!");
      fetchData(); // Segarkan list antrean
    } catch (error) {
      console.error("Gagal memproses persetujuan sewa:", error);
      alert("Terjadi kesalahan sistem saat memproses data.");
    }
  };

  // ============ RENDER UI ============
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Dashboard */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Panel manajemen dan verifikasi RuangKost</p>
        </div>

        {/* Kontainer Utama */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span>📥</span> Antrean Pengajuan Sewa Kamar
          </h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-slate-600 mx-auto mb-2"></div>
              <p className="text-slate-500 text-sm">Memeriksa hak akses dan memuat data...</p>
            </div>
          ) : pengajuan.length > 0 ? (
            <div className="space-y-4">
              {pengajuan.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-slate-100 rounded-xl hover:bg-slate-50/40 transition-colors gap-4">
                  <div>
                    <div className="font-bold text-base text-slate-800">{item.userName}</div>
                    <div className="text-sm text-slate-500 mt-0.5">
                      🚪 Kamar {item.nomorKamar} • ✉️ {item.userEmail}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleApprove(item.id, item.userId, item.kamarId)}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-100 transition-all text-center"
                  >
                    Setujui Sewa ✓
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              ✨ Tidak ada antrean pengajuan sewa baru saat ini.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}