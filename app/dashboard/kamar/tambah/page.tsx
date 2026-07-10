"use client";

import { useState } from "react";
import Link from "next/link";
import { db } from "../../../../lib/firebase"; // Disesuaikan: mundur 4 level folder
import { collection, addDoc } from "firebase/firestore";

export default function TambahKamar() {
  const [formData, setFormData] = useState({
    nomor_kamar: "",
    harga_bulanan: "",
    fasilitas: "",
    status: "tersedia" as "tersedia" | "terisi",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "kamars"), {
        ...formData,
        harga_bulanan: Number(formData.harga_bulanan),
      });
      alert("Kamar berhasil ditambahkan!");
      setFormData({ nomor_kamar: "", harga_bulanan: "", fasilitas: "", status: "tersedia" });
    } catch (error) {
      console.error("Error menambah kamar:", error);
      alert("Gagal menambahkan kamar.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow border">
      <Link href="/dashboard/kamar" className="text-blue-600 hover:underline mb-4 block">
        &larr; Kembali ke Daftar Kamar
      </Link>

      <h2 className="text-xl font-bold mb-4">Tambah Kamar Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          placeholder="Nomor Kamar (contoh: A-01)" 
          className="w-full border p-2 rounded" 
          value={formData.nomor_kamar}
          onChange={(e) => setFormData({...formData, nomor_kamar: e.target.value})}
          required
        />
        <input 
          type="number"
          placeholder="Harga Bulanan" 
          className="w-full border p-2 rounded" 
          value={formData.harga_bulanan}
          onChange={(e) => setFormData({...formData, harga_bulanan: e.target.value})}
          required
        />
        <input 
          placeholder="Fasilitas (contoh: AC, Kasur)" 
          className="w-full border p-2 rounded" 
          value={formData.fasilitas}
          onChange={(e) => setFormData({...formData, fasilitas: e.target.value})}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700">
          Simpan Kamar
        </button>
      </form>
    </div>
  );
}