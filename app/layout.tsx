import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext"; // Import AuthProvider

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RuangKost - SaaS Manajemen Kos",
  description: "Aplikasi pengelola kos modern",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        {/* Bungkus children di sini */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}