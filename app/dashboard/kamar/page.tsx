"use client";

import { useEffect, useState } from "react";
// Sesuaikan jumlah titik (../..) agar sesuai dengan lokasi folder lib Anda
import { db } from "@/lib/firebase"; 
import { collection, getDocs, query } from "firebase/firestore";

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
      try {
        // Kueri diubah: menghapus filter 'where', jadi semua data akan diambil
        const q = query(collection(db, "kamars"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Kamar));
        setKamars(data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchKamar();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Daftar Kamar</h1>

        {loading ? (
          <p className="text-slate-500">Memuat data kamar...</p>
        ) : (
          <div className="grid gap-6">
            {kamars.map((kamar) => (
              <div key={kamar.id} className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900">Kamar {kamar.nomor_kamar}</h3>
                    {/* Badge Status */}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${kamar.status === 'tersedia' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {kamar.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">Fasilitas: {kamar.fasilitas || "-"}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">
                    Rp {kamar.harga_bulanan.toLocaleString("id-ID")}
                    <span className="text-sm text-slate-400 font-normal"> / bln</span>
                  </div>
                  {kamar.status === "tersedia" ? (
                    <a 
                      href={`https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang Kamar ${kamar.nomor_kamar}`}
                      target="_blank"
                      className="mt-3 block bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition"
                    >
                      Booking Sekarang
                    </a>
                  ) : (
                    <button disabled className="mt-3 block bg-slate-200 text-slate-500 px-6 py-2 rounded-lg text-sm font-semibold cursor-not-allowed">
                      Sudah Terisi
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}