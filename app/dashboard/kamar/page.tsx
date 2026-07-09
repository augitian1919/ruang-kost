"use client";

import React, { useState, useEffect } from "react"; 
import { db } from "../../../lib/firebase"; // Sesuaikan path ini jika perlu
import { collection, addDoc, getDocs, query, serverTimestamp } from "firebase/firestore";

interface Kamar {
  id: string;
  nomor_kamar: string;
  harga_bulanan: number;
  fasilitas: string;
  status: "tersedia" | "terisi";
}

export default function MandiriKamarPage() {
  const [kamars, setKamars] = useState<Kamar[]>([]);
  const [nomorKamar, setNomorKamar] = useState("");
  const [hargaBulanan, setHargaBulanan] = useState("");
  const [fasilitas, setFasilitas] = useState("");
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const fetchKamars = async () => {
    try {
      setLoadingFetch(true);
      const q = query(collection(db, "kamars"));
      const querySnapshot = await getDocs(q);
      const data: Kamar[] = [];
      querySnapshot.forEach((doc: any) => {
        data.push({ id: doc.id, ...doc.data() } as Kamar);
      });
      setKamars(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoadingFetch(false);
    }
  };

  useEffect(() => {
    fetchKamars();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomorKamar || !hargaBulanan) return;

    try {
      setLoadingSubmit(true);
      await addDoc(collection(db, "kamars"), {
        nomor_kamar: nomorKamar,
        harga_bulanan: Number(hargaBulanan),
        fasilitas: fasilitas,
        status: "tersedia",
        createdAt: serverTimestamp(),
      });
      setNomorKamar("");
      setHargaBulanan("");
      setFasilitas("");
      fetchKamars(); 
    } catch (error) {
      console.error("Gagal menyimpan:", error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manajemen Unit Kamar</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Input */}
        <div className="bg-white p-6 rounded-xl border">
          <h2 className="font-bold mb-4">Tambah Kamar Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              className="w-full border p-2 rounded" 
              placeholder="Nomor Kamar" 
              value={nomorKamar} 
              onChange={(e) => setNomorKamar(e.target.value)} 
            />
            <input 
              type="number"
              className="w-full border p-2 rounded" 
              placeholder="Harga per bulan" 
              value={hargaBulanan} 
              onChange={(e) => setHargaBulanan(e.target.value)} 
            />
            <input 
              className="w-full border p-2 rounded" 
              placeholder="Fasilitas (ex: AC, WiFi)" 
              value={fasilitas} 
              onChange={(e) => setFasilitas(e.target.value)} 
            />
            <button 
              type="submit" 
              disabled={loadingSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              {loadingSubmit ? "Menyimpan..." : "Simpan Kamar"}
            </button>
          </form>
        </div>

        {/* Tabel Data */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-slate-500">
                <th className="p-2">Kamar</th>
                <th className="p-2">Harga & Fasilitas</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {kamars.map((kamar) => (
                <tr key={kamar.id} className="border-b">
                  <td className="p-2 font-bold">{kamar.nomor_kamar}</td>
                  <td className="p-2">
                    <div className="font-bold">Rp {kamar.harga_bulanan.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">Fasilitas: {kamar.fasilitas || "-"}</div>
                  </td>
                  <td className="p-2 text-xs font-bold text-emerald-600">{kamar.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}