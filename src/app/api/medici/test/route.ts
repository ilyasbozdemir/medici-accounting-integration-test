import { NextResponse } from "next/server";
import { runMediciEngineTests } from "@/lib/medici-service";

export async function POST() {
  try {
    const testResults = await runMediciEngineTests();
    return NextResponse.json({ success: true, tests: testResults });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Testler çalıştırılırken hata oluştu." },
      { status: 500 }
    );
  }
}
