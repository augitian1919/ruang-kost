"use client";

import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase"; // Sesuaikan path ini jika perlu
import { collection, addDoc, getDocs, query, serverTimestamp } from "firebase/firestore";

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
  const [formData, setFormData] = useState({ nama: "", wa: "" });

  const fetchKamars = async () => {
    try {
      const q = query(collection(db, "kamars"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Kamar));
      setKamars(data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKamars();
  }, []);

  const handleBooking = async (nomor_kamar: string) => {
    if (!formData.nama || !formData.wa) return alert("Isi nama dan nomor WA!");

    try {
      // Perhatikan tanda koma setelah db
      await addDoc(collection(db, "pendaftar"), {
        nomor_kamar,
        nama: formData.nama,
        wa: formData.wa,
        tanggal: serverTimestamp(),
        status: "pending",
      });
      alert("Berhasil mendaftar! Pemilik akan segera menghubungi Anda.");
      setFormData({ nama: "", wa: "" }); // Reset form
    } catch (error) {
      console.error("Gagal mendaftar:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Kamar</h1>
      
      {/* Contoh Form Input Pendaftar (opsional, sesuaikan kebutuhan UI Anda) */}
      <div className="mb-6 p-4 border rounded bg-white">
        <input placeholder="Nama Anda" className="border p-2 mr-2" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} />
        <input placeholder="No WA" className="border p-2 mr-2" value={formData.wa} onChange={(e) => setFormData({...formData, wa: e.target.value})} />
      </div>

      <div className="grid gap-4">
        {kamars.map((kamar) => (
          <div key={kamar.id} className="p-4 border rounded bg-white flex justify-between items-center">
            <div>
              <p className="font-bold">Kamar {kamar.nomor_kamar}</p>
              <p className="text-sm text-gray-500">{kamar.fasilitas}</p>
            </div>
            <button 
              onClick={() => handleBooking(kamar.nomor_kamar)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Booking
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}