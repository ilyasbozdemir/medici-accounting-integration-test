import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Sayfa Bulunamadı (404)</h2>
        <p className="text-slate-400 text-sm">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
        <Link href="/" className="inline-block bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl text-sm font-bold">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
