import { NextResponse } from "next/server";
import { getChartOfAccounts } from "@/lib/medici-service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookName = searchParams.get("book") || undefined;
    const accounts = await getChartOfAccounts(bookName);
    return NextResponse.json({ success: true, accounts });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Hesap planı alınamadı." },
      { status: 500 }
    );
  }
}
