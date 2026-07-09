"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

// Definisi tipe data Kamar untuk TypeScript
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
  const [suksesMsg, setSuksesMsg] = useState("");

  // 1. FUNGSI READ: Mengambil data kamar dari Firestore milik user yang sedang login
  const fetchKamar = async () => {
    if (!user) return;
    setLoadingFetch(true);
    try {
      const q = query(
        collection(db, "kamar"),
        where("owner_id", "==", user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const dataKamar: Kamar[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        dataKamar.push({
          id: doc.id,
          nomor_kamar: data.nomor_kamar,
          harga_bulanan: data.harga_bulanan,
          status: data.status,
        });
      });
      
      setKamars(dataKamar);
    } catch (error) {
      console.error("Gagal mengambil data kamar:", error);
    } finally {
      setLoadingFetch(false);
    }
  };

  // Jalankan fetch data saat halaman pertama kali dimuat
  useEffect(() => {
    fetchKamar();
  }, [user]);

  // 2. FUNGSI CREATE: Menambah data kamar baru ke Firestore
  const handleTambahKamar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !nomorKamar || !hargaBulanan) return;

    setLoadingSubmit(true);
    setSuksesMsg("");

    try {
      await addDoc(collection(db, "kamar"), {
        owner_id: user.uid,
        nomor_kamar: nomorKamar,
        harga_bulanan: Number(hargaBulanan),
        status: "tersedia", // Default kamar baru selalu tersedia
        created_at: serverTimestamp(),
      });

      setSuksesMsg("Kamar baru berhasil ditambahkan!");
      setNomorKamar("");
      setHargaBulanan("");
      
      // Refresh daftar kamar setelah berhasil menambah data
      fetchKamar();
    } catch (error) {
      console.error("Gagal menambahkan kamar:", error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Kamar</h1>
        <p className="text-sm text-gray-500">Kelola unit kamar kos yang Anda miliki di sini.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM TAMBAH KAMAR */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Tambah Kamar Baru</h2>
          
          {suksesMsg && (
            <p className="mb-4 text-sm text-green-600 bg-green-50 p-2 rounded font-medium">
              ✅ {suksesMsg}
            </p>
          )}

          <form onSubmit={handleTambahKamar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nomor / Nama Kamar</label>
              <input
                type="text"
                required
                placeholder="Contoh: A-01, B-05"
                className="mt-1 w-full rounded border p-2 text-black focus:outline-blue-500"
                value={nomorKamar}
                onChange={(e) => setNomorKamar(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Harga Per Bulan (Rp)</label>
              <input
                type="number"
                required
                placeholder="Contoh: 850000"
                className="mt-1 w-full rounded border p-2 text-black focus:outline-blue-500"
                value={hargaBulanan}
                onChange={(e) => setHargaBulanan(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loadingSubmit}
              className="w-full rounded-lg bg-blue-600 p-2.5 font-semibold text-white hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loadingSubmit ? "Menyimpan..." : "Simpan Kamar"}
            </button>
          </form>
        </div>

        {/* TABEL DAFTAR KAMAR */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Daftar Semua Kamar</h2>
          
          {loadingFetch ? (
            <div className="py-8 text-center text-gray-500">Memuat data kamar dari database...</div>
          ) : kamars.length === 0 ? (
            <div className="py-8 text-center text-gray-500">Belum ada kamar yang terdaftar.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600 text-sm font-semibold">
                    <th className="p-3">Nomor Kamar</th>
                    <th className="p-3">Harga Bulanan</th>
                    <th className="p-3">Status Kelayakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {kamars.map((kamar) => (
                    <tr key={kamar.id} className="hover:bg-gray-50 transition">
                      <td className="p-3 font-semibold text-gray-800">{kamar.nomor_kamar}</td>
                      <td className="p-3 text-gray-700">
                        Rp {kamar.harga_bulanan.toLocaleString("id-ID")}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            kamar.status === "tersedia"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {kamar.status === "tersedia" ? "Kosong (Tersedia)" : "Terisi"}
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
  );
}