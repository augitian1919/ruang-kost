"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      {/* Badge */}
      <div className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-6">
        ✨ Tersedia Kamar Kosong Bulan Ini
      </div>

      {/* Headline */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
        Temukan Kost Nyaman,
      </h1>

      {/* Subheadline */}
      <p className="max-w-xl text-slate-600 mb-10 text-lg">
        Pilihan cerdas untuk hunian sementara Anda. Nikmati fasilitas lengkap, 
        lokasi yang sangat strategis, dan lingkungan aman untuk mendukung produktivitasmu setiap hari.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/kamar" 
          className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Lihat Pilihan Kamar
        </Link>
        
        <a 
          href="https://wa.me/6285802090008" // Ganti dengan nomor WA kamu
          className="bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-full font-semibold hover:bg-slate-50 transition"
        >
          Hubungi Pemilik
        </a>
      </div>
    </div>
  );
}