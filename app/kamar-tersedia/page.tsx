import Link from "next/link";

export default function KamarTersediaPage() {
  return (
    <div className="flex justify-center p-10">
      <Link 
        href="/kamar-tersedia" 
        className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-blue-700 transition"
      >
        Lihat Pilihan Kamar
      </Link>
    </div>
  );
}