"use client";

import Link from "next/link";

export default function DashboardMainPage() {
  return (
    <div className="max-w-md mx-auto mt-12 text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang!</h1>
      <p className="text-gray-500 mb-6">Akun pemilik kos Anda telah berhasil masuk dan aktif secara online.</p>
      
      <Link 
        href="/dashboard/kamar" 
        className="inline-block w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 transition text-sm"
      >
        Mulai Kelola Kamar Kos ➡️
      </Link>
    </div>
  );
}