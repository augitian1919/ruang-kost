import Link from "next/link";

export default function KontakPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[28px] p-10 shadow-[0_25px_60px_-12px_rgba(15,23,42,0.15)] border border-white/60 relative overflow-hidden">
        
        {/* Decorative glows */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-9 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-[20px] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight mb-2">
            Hubungi Pemilik
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Ada pertanyaan? Kami siap membantu Anda kapan saja.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3.5 relative z-10">
          
          {/* WhatsApp */}
          <a
            href="https://wa.me/6285802090008"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3.5 p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-bold">Chat WhatsApp</div>
              <div className="text-xs opacity-80 font-normal mt-0.5">Balasan cepat dalam hitungan menit</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 flex-shrink-0">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </a>

          {/* Email */}
          <a
            href="mailto:augitian1919@gmail.com"
            className="group flex items-center gap-3.5 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white font-semibold shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-bold">Kirim Email</div>
              <div className="text-xs opacity-70 font-normal mt-0.5">augitian1919@gmail.com</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 flex-shrink-0">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </a>

        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-7 relative z-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <span className="text-xs text-slate-400 font-medium">atau</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-slate-200 to-transparent" />
        </div>

        {/* Back Link */}
        <Link
          href="/"
          className="group flex items-center justify-center gap-2 p-3.5 bg-slate-50 border-[1.5px] border-slate-200 rounded-2xl text-slate-600 font-semibold text-sm hover:bg-slate-100 hover:border-slate-300 hover:text-slate-800 transition-all duration-200 relative z-10"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Kembali ke Beranda
        </Link>

        {/* Footer */}
        <div className="text-center mt-6 relative z-10">
          <p className="text-xs text-slate-400">RuangKost © 2026 — Siap melayani Anda</p>
        </div>

      </div>
    </div>
  );
}