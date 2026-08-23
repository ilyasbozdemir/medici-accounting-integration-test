import { NextResponse } from "next/server";
import { getFinancialReports } from "@/lib/medici-service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookName = searchParams.get("book") || undefined;
    const reports = await getFinancialReports(bookName);
    return NextResponse.json({ success: true, reports });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Finansal raporlar oluşturulamadı." },
      { status: 500 }
    );
  }
}
