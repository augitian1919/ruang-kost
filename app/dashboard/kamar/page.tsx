"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Kamar {
  id: string;
  nomor_kamar: string;
  harga_bulanan: number;
  fasilitas: string;
  status: "tersedia" | "terisi";
}

export default function DaftarKamarPublik() {
  const [kamars, setKamars] = useState<Kamar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKamar = async () => {
      // Kita hanya mengambil yang statusnya 'tersedia' untuk ditampilkan ke publik
      const q = query(collection(db, "kamars"), where("status", "==", "tersedia"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Kamar));
      setKamars(data);
      setLoading(false);
    };
    fetchKamar();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Pilihan Kamar Tersedia</h1>

        {loading ? (
          <p className="text-slate-500">Memuat daftar kamar...</p>
        ) : kamars.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
            <p className="text-slate-600">Mohon maaf, saat ini belum ada kamar yang tersedia.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {kamars.map((kamar) => (
              <div key={kamar.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Kamar {kamar.nomor_kamar}</h3>
                  <p className="text-sm text-slate-500 mt-1">Fasilitas: {kamar.fasilitas || "-"}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    Rp {kamar.harga_bulanan.toLocaleString("id-ID")}
                    <span className="text-sm text-slate-400 font-normal"> / bulan</span>
                  </div>
                  <button className="mt-3 bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition">
                    Booking Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}