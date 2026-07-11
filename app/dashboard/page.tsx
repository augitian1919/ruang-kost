"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export default function CustomerDashboardPage() {
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasRoom, setHasRoom] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName || user.email?.split('@')[0] || "Penghuni");

        const userDocRef = doc(db, "sewa", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setHasRoom(true);
        } else {
          setHasRoom(false);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Halo, {userName}! 👋
            </h1>
            <p className="text-slate-500 mt-2 text-base">Selamat datang kembali di RuangKost</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
              {userName.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <div className="font-semibold text-sm text-slate-800">{userName}</div>
              <div className="text-xs text-slate-500">Penghuni</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100/50 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xl">
                🏠
              </div>
              <span className="text-sm font-medium text-slate-500">Status Kamar</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {hasRoom ? "Aktif" : "Belum Aktif"}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {hasRoom ? "Kamar Anda aktif" : "Anda belum memiliki kamar"}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100/50 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-xl">
                💰
              </div>
              <span className="text-sm font-medium text-slate-500">Tagihan Bulanan</span>
            </div>
            <div className="text-2xl font-bold text-emerald-600">Rp 0</div>
            <div className="text-xs text-slate-400 mt-1">Tidak ada tagihan tertunda</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100/50 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-xl">
                📅
              </div>
              <span className="text-sm font-medium text-slate-500">Masa Sewa</span>
            </div>
            <div className="text-2xl font-bold text-amber-500">-</div>
            <div className="text-xs text-slate-400 mt-1">Belum ada data sewa</div>
          </div>
        </div>

        {/* Main Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Pantau Kamar */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-blue-100/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50/50 to-violet-50/50 rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-200">
                  🔍
                </div>
                <h2 className="text-xl font-bold text-slate-800">Pantau Kamar</h2>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Anda belum memiliki kamar yang aktif. Temukan kamar ideal Anda sekarang juga.
              </p>
              <button className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
                <span>🔎</span> Cari Kamar Tersedia
              </button>
            </div>
          </div>

          {/* Tagihan Bulanan */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-50/50 to-teal-50/50 rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-200">
                  💳
                </div>
                <h2 className="text-xl font-bold text-slate-800">Tagihan Bulanan</h2>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Tidak ada tagihan yang tertunda saat ini. Semua pembayaran Anda sudah up to date.
              </p>
              <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-lg">✅</span>
                <span className="text-emerald-700 font-semibold text-sm">Status: Lunas & Aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "🏠", label: "Lihat Kamar" },
              { icon: "💵", label: "Bayar Tagihan" },
              { icon: "📞", label: "Hubungi Admin" },
              { icon: "⚙️", label: "Pengaturan" },
            ].map((action, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</div>
                <div className="font-semibold text-sm text-slate-700">{action.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}