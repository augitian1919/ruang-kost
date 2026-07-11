"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase"; // Sesuaikan path jika perlu

export default function CustomerDashboardPage() {
  const [userName, setUserName] = useState<string>("Penghuni");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email || "Penghuni");
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="p-10 text-center">Memuat data...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Halo, {userName}!</h1>
      
      <div className="grid gap-6">
        <section className="p-6 bg-white shadow rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Pantau Kamar</h2>
          <p>Informasi detail kamar Anda akan muncul di sini.</p>
        </section>

        <section className="p-6 bg-white shadow rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Tagihan</h2>
          <p>Status pembayaran Anda saat ini belum tersedia.</p>
        </section>
      </div>
    </div>
  );
}