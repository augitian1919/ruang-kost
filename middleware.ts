import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Mengambil data login dari browser
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // GANTI USERNAME DAN PASSWORD DI BAWAH INI
    if (user === 'admin' && pwd === 'hinorn285') {
      return NextResponse.next(); // Izinkan masuk ke dashboard
    }
  }

  // Jika belum login atau password salah, munculkan pop-up
  return new NextResponse('Akses Ditolak. Anda bukan Admin.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Area Khusus Admin RuangKost"',
    },
  });
}

// Aturan ini memastikan hanya link /dashboard dan isinya yang dikunci
export const config = {
  matcher: ['/dashboard/:path*'],
};