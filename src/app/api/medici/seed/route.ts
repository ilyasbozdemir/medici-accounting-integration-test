import { NextResponse } from "next/server";
import { seedDemoAccountingData } from "@/lib/medici-service";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookName = searchParams.get("book") || undefined;
    const result = await seedDemoAccountingData(bookName);
    return NextResponse.json({ success: true, message: "Örnek muhasebe verileri başarıyla yüklendi.", result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Örnek veri yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}
