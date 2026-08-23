import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Medici Finans & Gelir-Gider Ön Muhasebe Yönetimi",
  description:
    "Kurumsal gelir-gider, fiş düzenleme, müşteri, tedarikçi ve bakiye yönetim sistemi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
