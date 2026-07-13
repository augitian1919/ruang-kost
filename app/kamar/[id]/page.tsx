"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// Karena ini dynamic route, Next.js akan mengirimkan 'params' yang berisi ID di URL
export default function DetailKamarPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // --- FUNGSI UNTUK TOMBOL AJUKAN SEWA ---
  const handleAjukanSewa = async () => {
    // 1. Pastikan user sudah login
    const user = auth.currentUser;
    if (!user) {
      alert("Anda harus login terlebih dahulu untuk menyewa kamar ini.");
      router.push("/login"); // Arahkan ke halaman login jika belum
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Simpan data pengajuan ke koleksi baru bernama "sewa" di Firestore
      const dataPengajuan = {
        kamarId: params.id, // Mengambil "A3T1acAOhrfEL5QCyiCh" dari URL
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email?.split('@')[0] || "Penghuni",
        status: "menunggu_konfirmasi", // Status awal saat pertama kali diajukan
        tanggal_pengajuan: serverTimestamp(),
      };

      // Tambahkan dokumen ke Firestore
      await addDoc(collection(db, "sewa"), dataPengajuan);

      // 3. Beri tahu user dan arahkan ke Dashboard
      alert("Pengajuan sewa berhasil dikirim! Silakan tunggu konfirmasi dari Admin.");
      router.push("/dashboard"); 

    } catch (error) {
      console.error("Error saat mengajukan sewa: ", error);
      alert("Terjadi kesalahan sistem. Silakan coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Tampilan Konten Detail Kamar Anda (Gunakan kode Anda yang sudah ada di sini) */}
      <h1 className="text-2xl font-bold mb-4">Detail Kamar Anda...</h1>
      
      {/* --- TOMBOL AJUKAN SEWA --- */}
      <button 
        onClick={handleAjukanSewa}
        disabled={isSubmitting} // Matikan tombol saat proses loading
        className={`mt-6 w-full py-3 rounded-lg font-bold text-white transition-colors duration-200
          ${isSubmitting 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {isSubmitting ? "Sedang Memproses..." : "Ajukan Sewa Sekarang"}
      </button>

    </div>
  );
}