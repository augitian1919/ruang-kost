"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase"; // Pastikan path ini sesuai

export default function CustomerDashboardPage() {
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Mengambil nama depan dari email jika displayName kosong
        const nameFromEmail = user.email ? user.email.split('@')[0] : "Penghuni";
        setUserName(user.displayName || nameFromEmail);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-medium animate-pulse">Memuat dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Halo, {userName}! 👋
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Selamat datang di dashboard RuangKost Anda.
          </p>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Pantau Kamar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
            <div>
              {/* Ikon Kamar */}
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Pantau Kamar</h2>
              <p className="text-gray-500 leading-relaxed">
                Informasi detail kamar Anda, fasilitas, dan masa sewa akan muncul di sini.
              </p>
            </div>
            <button className="mt-6 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200">
              Lihat Detail Kamar
            </button>
          </div>

          {/* Card 2: Tagihan */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
            <div>
              {/* Ikon Tagihan */}
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Tagihan Bulanan</h2>
              <p className="text-gray-500 leading-relaxed">
                Status pembayaran Anda saat ini belum tersedia. Segera lunasi tagihan Anda tepat waktu.
              </p>
            </div>
            <button className="mt-6 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors duration-200">
              Cek Status Pembayaran
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}