import { NextResponse } from "next/server";
import { getLedgerTransactions } from "@/lib/medici-service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookName = searchParams.get("book") || undefined;
    const transactions = await getLedgerTransactions(bookName);
    return NextResponse.json({ success: true, transactions });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Defter-i Kebir işlemleri alınamadı." },
      { status: 500 }
    );
  }
}
