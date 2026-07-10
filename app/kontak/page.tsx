import Link from "next/link";

export default function KontakPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6 text-slate-900">Hubungi Pemilik</h1>
        
        <div className="space-y-4">
          <a 
            href="https://wa.me/6285802090008" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Chat WhatsApp
          </a>
          
          <a 
            href="mailto:augitian1919@gmail.com" 
            className="block w-full py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
          >
            Kirim Email
          </a>
        </div>

        <Link href="/" className="mt-8 text-slate-500 hover:text-slate-900 block text-sm">
          &larr; Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}