"use client";

// FIX 3: Menambahkan import React secara utuh di awal
import React, { useState, useEffect } from "react"; 
// FIX 1: Mengubah import menjadi relative path agar folder 'lib' langsung terbaca
import { useAuth } from "../../../lib/AuthContext";
import { db } from "../../../lib/firebase";
import { collection, addDoc, getDocs, query, serverTimestamp } from "firebase/store";

interface Kamar {
  id: string;
  nomor_kamar: string;
  harga_bulanan: number;
  status: "tersedia" | "terisi";
}

export default function MandiriKamarPage() {
  const { user } = useAuth();
  const [kamars, setKamars] = useState<Kamar[]>([]);
  const [nomorKamar, setNomorKamar] = useState("");
  const [hargaBulanan, setHargaBulanan] = useState("");
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Fungsi fetch data dari Firestore
  const fetchKamars = async () => {
    try {
      setLoadingFetch(true);
      const q = query(collection(db, "kamars"));
      const querySnapshot = await getDocs(q);
      const data: Kamar[] = [];
      
      // FIX 2: Menambahkan tipe ': any' pada parameter doc agar lolos strict mode
      querySnapshot.forEach((doc: any) => {
        data.push({ id: doc.id, ...doc.data() } as Kamar);
      });
      
      setKamars(data);
    } catch (error) {
      console.error("Gagal mengambil data kamar:", error);
    } finally {
      setLoadingFetch(false);
    }
  };

  useEffect(() => {
    fetchKamars();
  }, []);

  // Fungsi tambah data kamar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomorKamar || !hargaBulanan) return;

    try {
      setLoadingSubmit(true);
      await addDoc(collection(db, "kamars"), {
        nomor_kamar: nomorKamar,
        harga_bulanan: Number(hargaBulanan),
        status: "tersedia",
        createdAt: serverTimestamp(),
      });
      setNomorKamar("");
      setHargaBulanan("");
      fetchKamars(); 
    } catch (error) {
      console.error("Gagal menyimpan kamar:", error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const totalKamar = kamars.length;
  const tersedia = kamars.filter((k) => k.status === "tersedia").length;
  const terisi = kamars.filter((k) => k.status === "terisi").length;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manajemen Unit Kamar</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola ketersediaan dan harga sewa kamar kos Anda secara real-time.</p>
          </div>
          
          {/* STATS WIDGET */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm text-center">
              <span className="text-xs text-slate-400 font-medium block">Total</span>
              <span className="text-lg font-bold text-slate-800">{totalKamar}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl text-center">
              <span className="text-xs text-emerald-600 font-medium block">Tersedia</span>
              <span className="text-lg font-bold text-emerald-700">{tersedia}</span>
            </div>
            <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl text-center">
              <span className="text-xs text-blue-600 font-medium block">Terisi</span>
              <span className="text-lg font-bold text-blue-700">{terisi}</span>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* FORM CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <span className="w-2 h-5 bg-blue-600 rounded-full inline-block"></span>
              Tambah Kamar Baru
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Nomor / Nama Kamar</label>
                <input
                  type="text"
                  value={nomorKamar}
                  onChange={(e) => setNomorKamar(e.target.value)}
                  placeholder="Contoh: A-01, B-05"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Harga Per Bulan (Rp)</label>
                <input
                  type="number"
                  value={hargaBulanan}
                  onChange={(e) => setHargaBulanan(e.target.value)}
                  placeholder="Contoh: 850000"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={loadingSubmit}
                className="w-full bg-blue-600 text-white font-medium text-sm py-3 px-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-50 shadow-sm shadow-blue-200 mt-2"
              >
                {loadingSubmit ? "Menyimpan..." : "Simpan Unit Kamar"}
              </button>
            </form>
          </div>

          {/* LIST DATA CARD */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm min-h-[300px]">
            <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <span className="w-2 h-5 bg-slate-800 rounded-full inline-block"></span>
              Daftar Semua Kamar
            </h2>

            {loadingFetch ? (
              <div className="space-y-3 pt-4">
                <div className="h-10 bg-slate-100 rounded-xl animate-pulse"></div>
                <div className="h-14 bg-slate-50 rounded-xl animate-pulse"></div>
                <div className="h-14 bg-slate-50 rounded-xl animate-pulse"></div>
              </div>
            ) : kamars.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-sm text-slate-400 font-medium">Belum ada data unit kamar yang terdaftar.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-4">Nomor Kamar</th>
                      <th className="p-4">Harga Sewa</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {kamars.map((kamar) => (
                      <tr key={kamar.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-semibold text-slate-900">{kamar.nomor_kamar}</td>
                        <td className="p-4 font-mono text-slate-600">
                          Rp {kamar.harga_bulanan.toLocaleString("id-ID")}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
                              kamar.status === "tersedia"
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10"
                                : "bg-blue-50 text-blue-700 ring-1 ring-blue-600/10"
                            }`}
                          >
                            {kamar.status === "tersedia" ? "● Tersedia" : "● Terisi"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}