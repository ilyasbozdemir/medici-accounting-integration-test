import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Medici Double-Entry Accounting System",
  description: "Production-ready double-entry bookkeeping engine with Node.js, Mongoose, and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
