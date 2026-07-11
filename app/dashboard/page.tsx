"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import fungsi Firestore
import { auth, db } from "../../lib/firebase"; 

export default function CustomerDashboardPage() {
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasRoom, setHasRoom] = useState<boolean>(false); // State untuk cek sewa

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName || user.email?.split('@')[0] || "Penghuni");
        
        // --- LOGIKA CEK DATABASE ---
        // Kita cek di koleksi 'sewa' berdasarkan ID user
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

  if (isLoading) return <div className="p-10 text-center">Memuat...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Halo, {userName}! 👋</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card Pantau Kamar dengan Logika */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Pantau Kamar</h2>
            
            {hasRoom ? (
              <p>Detail kamar Anda akan muncul di sini.</p>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-500">Anda belum memiliki kamar yang aktif.</p>
                <button className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                  Cari Kamar Tersedia
                </button>
              </div>
            )}
          </div>

          {/* Card Tagihan */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Tagihan Bulanan</h2>
            <p className="text-gray-500">Tidak ada tagihan yang tertunda saat ini.</p>
          </div>

        </div>
      </div>
    </div>
  );
}