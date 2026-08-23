import { NextResponse } from "next/server";
import { createJournalEntry } from "@/lib/medici-service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createJournalEntry(body);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Yevmiye kaydı oluşturulamadı." },
      { status: 400 }
    );
  }
}
