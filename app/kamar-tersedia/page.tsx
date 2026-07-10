"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase"; 
import { collection, getDocs, query, where } from "firebase/firestore";

interface Kamar {
  id: string;
  nomor_kamar: string;
  harga_bulanan: number;
  fasilitas: string;
}

export default function KamarTersedia() {
  const [kamars, setKamars] = useState<Kamar[]>([]);

  useEffect(() => {
    const fetchKamars = async () => {
      const q = query(collection(db, "kamars"), where("status", "==", "tersedia"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Kamar[];
      setKamars(data);
    };

    fetchKamars();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Daftar Kamar Tersedia</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {kamars.length > 0 ? (
          kamars.map((kamar) => (
            <div key={kamar.id} className="border p-6 rounded-2xl shadow-sm bg-white">
              <h2 className="text-xl font-bold text-blue-600">Kamar {kamar.nomor_kamar}</h2>
              <p className="text-slate-600 mt-2">Harga: Rp{kamar.harga_bulanan.toLocaleString()}/bulan</p>
              <p className="text-slate-500 text-sm mt-2">Fasilitas: {kamar.fasilitas}</p>
            </div>
          ))
        ) : (
          <p>Belum ada kamar tersedia saat ini.</p>
        )}
      </div>
    </div>
  );
}