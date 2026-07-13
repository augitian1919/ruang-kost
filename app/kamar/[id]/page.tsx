"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // Menggunakan useParams agar lebih stabil
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface KamarData {
  nomor_kamar: string;
  harga_bulanan: number;
  fasilitas: string;
  status: string;
  url_gambar?: string;
}

export default function DetailKamarPage() {
  const router = useRouter();
  const params = useParams(); 
  const kamarId = params.id as string; // Mengambil ID "A3T1acAOhrfEL5QCyiCh" dengan aman

  const [kamar, setKamar] = useState<KamarData | null>(null);
  const [loadingKamar, setLoadingKamar] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 1. Ambil data kamar dari Firestore
  useEffect(() => {
    if (!kamarId) return;

    const fetchKamarDetails = async () => {
      try {
        const docRef = doc(db, "kamars", kamarId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setKamar(docSnap.data() as KamarData);
        } else {
          alert("Kamar tidak ditemukan di database!");
          router.push("/");
        }
      } catch (error) {
        console.error("Gagal mengambil data kamar:", error);
      } finally {
        setLoadingKamar(false);
      }
    };

    fetchKamarDetails();
  }, [kamarId, router]);

  // 2. Fungsi saat tombol sewa diklik
  const handleAjukanSewa = async () => {
    // Validasi status ketersediaan kamar
    const statusBersih = kamar?.status?.trim().toLowerCase();
    if (statusBersih !== "tersedia") {
      alert(`Maaf, kamar ini saat ini tidak tersedia (Status: ${kamar?.status})`);
      return;
    }

    // Validasi status login pengguna
    const user = auth.currentUser;
    if (!user) {
      alert("Anda harus login terlebih dahulu untuk menyewa kamar ini.");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const dataPengajuan = {
        kamarId: kamarId,
        nomorKamar: kamar?.nomor_kamar || "Tidak Diketahui",
        hargaKamar: kamar?.harga_bulanan || 0,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email?.split("@")[0] || "Penghuni",
        status: "menunggu_konfirmasi",
        tanggal_pengajuan: serverTimestamp(),
      };

      await addDoc(collection(db, "sewa"), dataPengajuan);

      alert("Pengajuan sewa berhasil dikirim! Menunggu konfirmasi admin.");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error Firebase:", error);
      alert(`Gagal mengajukan sewa: ${error.message || "Periksa kembali aturan Rules Firestore Anda"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingKamar) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 animate-pulse font-medium">Memuat detail kamar...</p>
      </div>
    );
  }

  // Cek apakah kamar memang tersedia
  const isTersedia = kamar?.status?.trim().toLowerCase() === "tersedia";

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <button 
          onClick={() => router.back()} 
          className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← Kembali
        </button>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
          
          {kamar?.url_gambar ? (
            <img 
              src={kamar.url_gambar} 
              alt={kamar.nomor_kamar} 
              className="w-full h-64 md:h-80 object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-48 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}

          <div className="border-b border-gray-100 pb-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isTersedia ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {kamar?.status}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{kamar?.nomor_kamar}</h1>
            <p className="text-2xl font-extrabold text-blue-600 mt-1">
              Rp {kamar?.harga_bulanan.toLocaleString("id-ID")}<span className="text-sm font-normal text-gray-500"> / bulan</span>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Fasilitas Kamar</h3>
            <p className="text-gray-700 mt-2 leading-relaxed text-lg bg-gray-50 p-4 rounded-xl border border-gray-100">
              {kamar?.fasilitas}
            </p>
          </div>

          {/* Tombol selalu aktif secara visual kecuali saat loading kirim data */}
          <button
            onClick={handleAjukanSewa}
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-sm transition-all duration-200 text-center
              ${isSubmitting 
                ? "bg-gray-400 cursor-not-allowed shadow-none" 
                : isTersedia 
                ? "bg-blue-600 hover:bg-blue-700 active:scale-[0.99]" 
                : "bg-amber-600 hover:bg-amber-700"
              }`}
          >
            {isSubmitting ? "Sedang Mengirim Pengajuan..." : "Ajukan Sewa Sekarang"}
          </button>

        </div>
      </div>
    </div>
  );
}