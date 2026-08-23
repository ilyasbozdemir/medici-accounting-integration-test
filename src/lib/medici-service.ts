// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Book } = require("medici");
import mongoose from "mongoose";
import { connectToDatabase } from "./db";

export interface AccountBalance {
  account: string;
  category: "Assets" | "Liabilities" | "Equity" | "Revenue" | "Expenses" | "Other";
  balance: number;
}

export interface JournalLineItem {
  account: string;
  type: "debit" | "credit";
  amount: number;
}

export interface NewJournalEntryInput {
  memo: string;
  date?: string;
  lines: JournalLineItem[];
  bookName?: string;
}

const DEFAULT_BOOK_NAME = "AnaSirketDefteri";

export async function getBook(bookName: string = DEFAULT_BOOK_NAME) {
  await connectToDatabase();
  return new Book(bookName, { maxAccountPath: 5 });
}

// Post a new double-entry journal
export async function createJournalEntry(input: NewJournalEntryInput) {
  const { memo, date, lines, bookName = DEFAULT_BOOK_NAME } = input;
  
  if (!lines || lines.length < 2) {
    throw new Error("En az 2 hesap kalemi (Borç ve Alacak) gereklidir.");
  }

  const totalDebits = lines.filter((l) => l.type === "debit").reduce((sum, l) => sum + Number(l.amount), 0);
  const totalCredits = lines.filter((l) => l.type === "credit").reduce((sum, l) => sum + Number(l.amount), 0);

  if (Math.abs(totalDebits - totalCredits) > 0.001) {
    throw new Error(`Kayıt dengesiz! Toplam Borç (${totalDebits}) ile Toplam Alacak (${totalCredits}) eşit olmalıdır.`);
  }

  const book = await getBook(bookName);
  const entryDate = date ? new Date(date) : new Date();
  
  const entry = book.entry(memo, entryDate);

  for (const line of lines) {
    if (line.type === "debit") {
      entry.debit(line.account, Number(line.amount));
    } else {
      entry.credit(line.account, Number(line.amount));
    }
  }

  const committedEntry = await entry.commit();
  return committedEntry;
}

// Get raw ledger transactions directly from Medici models or book.ledger()
export async function getLedgerTransactions(bookName: string = DEFAULT_BOOK_NAME) {
  await connectToDatabase();
  
  // Medici creates mongoose models 'Medici_Transaction' and 'Medici_Journal'
  const TransactionModel = mongoose.models.Medici_Transaction || mongoose.model("Medici_Transaction");
  const JournalModel = mongoose.models.Medici_Journal || mongoose.model("Medici_Journal");

  if (!TransactionModel) {
    return [];
  }

  const transactions = await TransactionModel.find({ book: bookName }).sort({ datetime: -1 }).lean();
  const journals = await JournalModel.find({ book: bookName }).lean();

  const journalMap = new Map<string, any>();
  for (const j of (journals as any[])) {
    journalMap.set(j._id.toString(), j);
  }

  return transactions.map((t: any) => ({
    id: t._id.toString(),
    datetime: t.datetime,
    account: t.account_path.join(":"),
    credit: t.credit || 0,
    debit: t.debit || 0,
    memo: t.memo || (journalMap.get(t._journal?.toString())?.memo) || "Yevmiye Kaydı",
    journalId: t._journal?.toString(),
    approved: t.approved,
    voided: t.voided,
  }));
}

// Get chart of accounts and aggregated balances
export async function getChartOfAccounts(bookName: string = DEFAULT_BOOK_NAME): Promise<AccountBalance[]> {
  await connectToDatabase();
  const transactions = await getLedgerTransactions(bookName);

  const accountMap = new Map<string, number>();

  for (const t of transactions) {
    if (t.voided) continue;
    const current = accountMap.get(t.account) || 0;
    // Medici conventions: debits increase Assets & Expenses, credits increase Liabilities, Equity, Revenue
    // For net balance calculation:
    const netChange = (t.debit || 0) - (t.credit || 0);
    accountMap.set(t.account, current + netChange);
  }

  const result: AccountBalance[] = [];

  for (const [account, netBalance] of accountMap.entries()) {
    let category: AccountBalance["category"] = "Other";
    if (account.startsWith("Assets") || account.startsWith("Varlıklar")) category = "Assets";
    else if (account.startsWith("Liabilities") || account.startsWith("Borçlar")) category = "Liabilities";
    else if (account.startsWith("Equity") || account.startsWith("Özkaynaklar")) category = "Equity";
    else if (account.startsWith("Revenue") || account.startsWith("Gelirler")) category = "Revenue";
    else if (account.startsWith("Expenses") || account.startsWith("Giderler")) category = "Expenses";

    // Standard accounting balance presentation:
    // Assets & Expenses naturally have DEBIT balance => (+debit - credit)
    // Liabilities, Equity & Revenue naturally have CREDIT balance => (+credit - debit)
    let displayBalance = netBalance;
    if (category === "Liabilities" || category === "Equity" || category === "Revenue") {
      displayBalance = -netBalance;
    }

    result.push({
      account,
      category,
      balance: displayBalance,
    });
  }

  return result.sort((a, b) => a.account.localeCompare(b.account));
}

// Get Financial Statements
export async function getFinancialReports(bookName: string = DEFAULT_BOOK_NAME) {
  const accounts = await getChartOfAccounts(bookName);

  const assets = accounts.filter((a) => a.category === "Assets");
  const liabilities = accounts.filter((a) => a.category === "Liabilities");
  const equity = accounts.filter((a) => a.category === "Equity");
  const revenue = accounts.filter((a) => a.category === "Revenue");
  const expenses = accounts.filter((a) => a.category === "Expenses");

  const totalAssets = assets.reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = liabilities.reduce((s, a) => s + a.balance, 0);
  const totalEquity = equity.reduce((s, a) => s + a.balance, 0);
  const totalRevenue = revenue.reduce((s, a) => s + a.balance, 0);
  const totalExpenses = expenses.reduce((s, a) => s + a.balance, 0);

  const netIncome = totalRevenue - totalExpenses;

  // Accounting Equation: Assets = Liabilities + Equity + Net Income (retained earnings)
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity + netIncome;
  const isBalanceSheetBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01;

  // Trial Balance calculation
  const transactions = await getLedgerTransactions(bookName);
  let totalDebit = 0;
  let totalCredit = 0;
  for (const t of transactions) {
    if (!t.voided) {
      totalDebit += t.debit || 0;
      totalCredit += t.credit || 0;
    }
  }

  return {
    summary: {
      totalAssets,
      totalLiabilities,
      totalEquity,
      totalRevenue,
      totalExpenses,
      netIncome,
      totalLiabilitiesAndEquity,
      isBalanceSheetBalanced,
      totalDebit,
      totalCredit,
      isTrialBalanceBalanced: Math.abs(totalDebit - totalCredit) < 0.01,
    },
    balanceSheet: {
      assets,
      liabilities,
      equity,
    },
    incomeStatement: {
      revenue,
      expenses,
    },
    trialBalance: accounts,
  };
}

// Seed demo data for testing double-entry bookkeeping
export async function seedDemoAccountingData(bookName: string = DEFAULT_BOOK_NAME) {
  await connectToDatabase();
  const book = await getBook(bookName);
  
  // Clear existing transactions for fresh demo
  const TransactionModel = mongoose.models.Medici_Transaction;
  const JournalModel = mongoose.models.Medici_Journal;
  if (TransactionModel) await TransactionModel.deleteMany({ book: bookName });
  if (JournalModel) await JournalModel.deleteMany({ book: bookName });

  // 1. Initial Capital Investment: Owner invests 500,000 TL cash into Garanti Bank (102 Bankalar)
  const e1 = book.entry("Kurucu Sermaye Yatırımı", new Date("2026-01-01"));
  e1.debit("Assets:102:Bank:Garanti", 500000);
  e1.credit("Equity:500:Sermaye", 500000);
  await e1.commit();

  // 2. Buy Office Equipment: Purchased Computers for 65,000 TL paid via Garanti Bank
  const e2 = book.entry("Ofis Bilgisayarları ve Ekipman Alımı", new Date("2026-01-05"));
  e2.debit("Assets:255:Equipment:Computers", 65000);
  e2.credit("Assets:102:Bank:Garanti", 65000);
  await e2.commit();

  // 3. Render Software Consulting Services: Billed client ACME Corp 120,000 TL (120 Alıcılar)
  const e3 = book.entry("Yazılım Danışmanlığı Hizmet Faturası - ACME Corp", new Date("2026-01-10"));
  e3.debit("Assets:120:AccountsReceivable:ACME", 120000);
  e3.credit("Revenue:600:Services:Consulting", 120000);
  await e3.commit();

  // 4. Pay Monthly Office Rent: 25,000 TL paid via Garanti Bank (770 Genel Yönetim - Kira)
  const e4 = book.entry("Ocak Ayı Ofis Kira Ödemesi", new Date("2026-01-15"));
  e4.debit("Expenses:770:Rent", 25000);
  e4.credit("Assets:102:Bank:Garanti", 25000);
  await e4.commit();

  // 5. Receive Partial Payment from Client ACME Corp: 80,000 TL received in Garanti Bank
  const e5 = book.entry("ACME Corp Hizmet Ödemesi Tahsilatı", new Date("2026-01-20"));
  e5.debit("Assets:102:Bank:Garanti", 80000);
  e5.credit("Assets:120:AccountsReceivable:ACME", 80000);
  await e5.commit();

  // 6. Pay Cloud Infrastructure & Hosting Bill: AWS 12,500 TL paid via Garanti Bank
  const e6 = book.entry("AWS Sunucu ve Sunum Giderleri", new Date("2026-01-25"));
  e6.debit("Expenses:770:Hosting:AWS", 12500);
  e6.credit("Assets:102:Bank:Garanti", 12500);
  await e6.commit();

  // 7. Pay Developer Salaries: 90,000 TL total salaries paid
  const e7 = book.entry("Ocak Ayı Personel Maaş Ödemeleri", new Date("2026-01-30"));
  e7.debit("Expenses:770:Salaries", 90000);
  e7.credit("Assets:102:Bank:Garanti", 90000);
  await e7.commit();

  return { success: true, count: 7 };
}

// Run interactive Medici unit tests
export async function runMediciEngineTests() {
  await connectToDatabase();
  const results = [];
  const bookName = `MediciTestBook_${Date.now()}`;
  const book = new Book(bookName, { maxAccountPath: 5 });

  // Test 1: Balanced Entry
  try {
    const e = book.entry("Test 1: Dengeli Kayıt");
    e.debit("Assets:TestBank", 1000);
    e.credit("Revenue:TestRevenue", 1000);
    await e.commit();
    results.push({ name: "Dengeli Yevmiye Kaydı (Debit = Credit)", status: "PASSED", details: "1000 TL Borç ve 1000 TL Alacak başarıyla işlendi ve commit edildi." });
  } catch (err: any) {
    results.push({ name: "Dengeli Yevmiye Kaydı", status: "FAILED", details: err.message });
  }

  // Test 2: Unbalanced Entry Rejection
  try {
    const e = book.entry("Test 2: Dengesiz Kayıt Denemesi");
    e.debit("Assets:TestBank", 5000);
    e.credit("Revenue:TestRevenue", 3000); // 2000 TL difference!
    await e.commit();
    results.push({ name: "Dengesiz Kaydı Engelleme Güvenliği", status: "FAILED", details: "Hata bekleniyordu ancak dengesiz kayıt veritabanına yazıldı!" });
  } catch (err: any) {
    results.push({ name: "Dengesiz Kaydı Engelleme Güvenliği", status: "PASSED", details: `Medici kuralı beklendiği gibi dengesiz işlemi engelledi: "${err.message}"` });
  }

  // Test 3: Sub-Account Aggregation (Hierarchy)
  try {
    const e1 = book.entry("Sub-account Test A");
    e1.debit("Assets:Bank:Akbank", 4000);
    e1.credit("Equity:Capital", 4000);
    await e1.commit();

    const e2 = book.entry("Sub-account Test B");
    e2.debit("Assets:Bank:Yapikredi", 6000);
    e2.credit("Equity:Capital", 6000);
    await e2.commit();

    const parentBalance = await book.balance({ account: "Assets:Bank" });
    const absBalance = Math.abs(parentBalance.balance);
    const isAggregatedCorrectly = absBalance === 10000;

    results.push({
      name: "Hiyerarşik Hesap Toplamı (Assets:Bank -> Akbank + Yapikredi)",
      status: isAggregatedCorrectly ? "PASSED" : "FAILED",
      details: `Assets:Bank toplam bakiye: ${absBalance} TL (Beklenen: 10000 TL)`,
    });
  } catch (err: any) {
    results.push({ name: "Hiyerarşik Hesap Toplamı", status: "FAILED", details: err.message });
  }

  // Test 4: Voiding / Reversing Entry
  try {
    const e = book.entry("İptal Edilecek İşlem");
    e.debit("Expenses:Misc", 500);
    e.credit("Assets:TestBank", 500);
    const journal = await e.commit();
    
    // Void the journal entry
    await book.void(journal._id, "Hatalı girilen işlem iptal edildi");

    results.push({
      name: "Yevmiye Kaydı İptal Etme (Void / Ters Kayıt)",
      status: "PASSED",
      details: `İşlem başarıyla iptal edildi ve ters kayıt Medici defterine işlendi.`,
    });
  } catch (err: any) {
    results.push({ name: "Yevmiye Kaydı İptal Etme", status: "FAILED", details: err.message });
  }

  return results;
}
