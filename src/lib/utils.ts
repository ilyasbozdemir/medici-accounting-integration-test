import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "TRY"): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Tek Düzen Hesap Planı (TDHP) Hesap Kodları & Açıklamaları
export const ACCOUNT_DICTIONARY: Record<string, { code: string; name: string }> = {
  // 1. VARLIKLAR (DÖNEN & DURAN)
  "Assets:100:Kasa": { code: "100.01", name: "100 Merkez Kasa Hesabı" },
  "Assets:102:Bank:Garanti": { code: "102.01", name: "102 Garanti Bankası TL Hesabı" },
  "Assets:102:Bank:Akbank": { code: "102.02", name: "102 Akbank TL Hesabı" },
  "Assets:102:Bank:Yapikredi": { code: "102.03", name: "102 Yapı Kredi Bankası Hesabı" },
  "Assets:120:Alicilar:ACME": { code: "120.01", name: "120 Alıcılar - ACME Corp (Ticari Alacak)" },
  "Assets:120:AccountsReceivable:ACME": { code: "120.01", name: "120 Alıcılar - ACME Corp (Ticari Alacak)" },
  "Assets:255:Demirbaslar:Bilgisayarlar": { code: "255.01", name: "255 Demirbaşlar - Ofis Bilgisayarları" },
  "Assets:255:Equipment:Computers": { code: "255.01", name: "255 Demirbaşlar - Ofis Bilgisayarları" },

  // 3. KISA VADELİ YABANCI KAYNAKLAR (BORÇLAR)
  "Liabilities:320:Saticilar:VendorA": { code: "320.01", name: "320 Satıcılar - Tedarikçi A (Ticari Borç)" },
  "Liabilities:300:BankaKredisi": { code: "300.01", name: "300 Kısa Vadeli Banka Kredileri" },

  // 5. ÖZKAYNAKLAR
  "Equity:500:Sermaye": { code: "500.01", name: "500 Ödenmiş Sermaye Hesabı" },

  // 6. GELİRLER
  "Revenue:600:YurticiSatislar:Danismanlik": { code: "600.01", name: "600 Yurtiçi Satışlar - Danışmanlık Gelirleri" },
  "Revenue:600:Services:Consulting": { code: "600.01", name: "600 Yurtiçi Satışlar - Danışmanlık Gelirleri" },
  "Revenue:600:Software": { code: "600.02", name: "600 Yurtiçi Satışlar - Yazılım Lisans Geliri" },

  // 7. GİDERLER
  "Expenses:770:Kira": { code: "770.01", name: "770 Genel Yönetim - Ofis Kira Gideri" },
  "Expenses:770:Rent": { code: "770.01", name: "770 Genel Yönetim - Ofis Kira Gideri" },
  "Expenses:770:PersonelMaas": { code: "770.02", name: "770 Genel Yönetim - Personel Maaş Giderleri" },
  "Expenses:770:Salaries": { code: "770.02", name: "770 Genel Yönetim - Personel Maaş Giderleri" },
  "Expenses:770:HostingAWS": { code: "770.03", name: "770 Genel Yönetim - AWS Sunucu & Bulut Gideri" },
  "Expenses:770:Hosting:AWS": { code: "770.03", name: "770 Genel Yönetim - AWS Sunucu & Bulut Gideri" },
};

// Formats Medici path into Tek Düzen Hesap Planı readable format
export function formatAccountName(accountPath: string): { code: string; title: string; fullLabel: string } {
  if (ACCOUNT_DICTIONARY[accountPath]) {
    const item = ACCOUNT_DICTIONARY[accountPath];
    return {
      code: item.code,
      title: item.name,
      fullLabel: `[${item.code}] ${item.name}`,
    };
  }

  // Fallback parser for arbitrary Medici paths like "Assets:102:Bank:Garanti"
  const parts = accountPath.split(":");
  let code = "100";
  
  if (parts[0] === "Assets" || parts[0] === "Varlıklar") code = "100";
  else if (parts[0] === "Liabilities" || parts[0] === "Borçlar") code = "300";
  else if (parts[0] === "Equity" || parts[0] === "Özkaynaklar") code = "500";
  else if (parts[0] === "Revenue" || parts[0] === "Gelirler") code = "600";
  else if (parts[0] === "Expenses" || parts[0] === "Giderler") code = "770";

  // If a 3-digit or sub-account code (e.g. "100" or "100.01") was included in path
  const foundCode = parts.find((p) => /^\d{3}(\.\d{1,3})?$/.test(p));
  if (foundCode) {
    code = foundCode;
  }

  const cleanName = parts.slice(1).filter((p) => !/^\d{3}(\.\d{1,3})?$/.test(p)).join(" › ");
  const title = cleanName ? `${code} ${cleanName}` : `${code} ${accountPath}`;

  return {
    code,
    title,
    fullLabel: `[${code}] ${cleanName || accountPath}`,
  };
}
