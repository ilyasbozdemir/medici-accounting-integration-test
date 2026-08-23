# 📊 Medici Double-Entry Finans & Gelir-Gider Yönetimi

Production-ready Çift Taraflı Muhasebe Motoru (**Medici** + **Mongoose**), **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS**, **Tek Düzen Hesap Planı (TDHP)** entegrasyonu ve otomatik **Docker MongoDB** altyapısı.

![Node.js](https://img.shields.io/badge/Node.js-v20%2B-emerald?style=for-the-badge&logo=nodedotjs)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Medici](https://img.shields.io/badge/Medici-7.4-teal?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-MongoDB_7-2496ED?style=for-the-badge&logo=docker)

---

## 🌟 Öne Çıkan Özellikler

### 1. ⚖️ Medici Çift Taraflı (Double-Entry) Muhasebe Motoru
- **Borç = Alacak İlkesi**: $Sum(Debits) === Sum(Credits)$ kuralı Medici motoru tarafından sıkı şekilde denetlenir. Dengesiz işlemler reddedilir.
- **Ters Kayıt (Voiding)**: Muhasebe standartlarına uygun şekilde, hatalı kayıtlar silinmez, ters kayıt (voiding) ile iptal edilir.
- **Bilanço & Mizan Dengesi**: $Varlıklar = Borçlar + Özkaynaklar + Net Kar$ eşitliği ve Mizan denkliği otomatik hesaplanır.

### 2. 📑 Tek Düzen Hesap Planı (TDHP) Entegrasyonu
Tüm işlemler Türkiye Tek Düzen Hesap Planı kodlarına uygun olarak hiyerarşik tutulur:
- **`[100.01]` 100 Merkez Kasa Hesabı** (`Assets:100:Kasa`)
- **`[102.01]` 102 Garanti Bankası TL Hesabı** (`Assets:102:Bank:Garanti`)
- **`[120.01]` 120 Alıcılar - ACME Corp (Ticari Alacak)** (`Assets:120:Alicilar:ACME`)
- **`[255.01]` 255 Demirbaşlar - Ofis Bilgisayarları** (`Assets:255:Equipment:Computers`)
- **`[500.01]` 500 Ödenmiş Sermaye Hesabı** (`Equity:500:Sermaye`)
- **`[600.01]` 600 Yurtiçi Satışlar - Danışmanlık Geliri** (`Revenue:600:Services:Consulting`)
- **`[770.01]` 770 Genel Yönetim - Ofis Kira Gideri** (`Expenses:770:Rent`)
- **`[770.02]` 770 Genel Yönetim - Personel Maaş Giderleri** (`Expenses:770:Salaries`)
- **`[770.03]` 770 Genel Yönetim - AWS Sunucu Gideri** (`Expenses:770:Hosting:AWS`)

### 3. 💵 Hızlı Gelir & Gider Yönetim Modalları
- **`+ Gelir Ekle`**: Müşteri satışı veya tahsilatlarını girmek için hazır şablon.
- **`- Gider Ekle`**: Kira, maaş, fatura ve tedarikçi harcamalarını girmek için hazır şablon.
- **`⚙️ Yevmiye Fişi`**: Çok kalemli serbest yevmiye kaydı oluşturma sihirbazı.

### 4. 📱 Mobil Destekli Responsive Sidebar & 🌙/☀️ Tema Modu
- **Sol Gezinme Menüsü (Sidebar)**: Logo, menüler, hızlı butonlar ve canlı rozet sayıları.
- **Mobil Drawer (Hamburger Menu)**: Cep telefonu ve tablet ekranlarında karartılmış backdrop ile açılan mobil menü.
- **Siyah (Dark Mode) / Beyaz (Light Mode) Tema Switcher**: Tek tıkla göz yormayan siyah veya ferah beyaz temaya geçiş.

---

## 🚀 Hızlı Başlangıç & Tek Komutlu Çalıştırma

### 1. Bağımlılıkları Yükleyin
```bash
pnpm install
```

### 2. Geliştirici Sunucusunu Başlatın
```bash
pnpm dev
```

> **🐳 Otomatik Docker Entegrasyonu**: `pnpm dev` çalıştırıldığında sistem ortamınızdaki Docker Desktop durumunu kontrol eder.
> - **Docker Açık**: `docker-compose.yml` ile resmi `mongo:7.0` veritabanı container'ını otomatik başlatır.
> - **Docker Kapalı**: Otomatik fallback ile `mongodb-memory-server` (Sıfır Konfigürasyon In-Memory DB) modunda çalışır.

---

## 📂 Proje Dizin Yapısı

```
.
├── docker-compose.yml        # MongoDB 7.0 Docker Konfigürasyonu
├── scripts/
│   └── start-dev.mjs         # Docker & Next.js Tek Komut Orkestratörü
├── src/
│   ├── app/
│   │   ├── api/medici/       # Next.js API Route Endpoints (seed, journal, accounts, ledger, reports, test)
│   │   ├── globals.css       # Custom Scrollbars, Dark/Light Tema CSS Overrides
│   │   ├── layout.tsx        # Inter Font & Metadata Root Layout
│   │   └── page.tsx          # Ana Finans Dashboard Sayfası
│   ├── components/
│   │   ├── Sidebar.tsx               # Sol Gezinme Menüsü & Mobil Drawer
│   │   ├── Navbar.tsx                # Üst Bar, Hamburger Toggle & DB Durumu
│   │   ├── DashboardOverview.tsx     # Finansal KPI Kartları & Gelir-Gider Oran Barı
│   │   ├── ChartOfAccounts.tsx       # TDHP Hesap Planı Ağaç Tablosu
│   │   ├── LedgerView.tsx            # Defter-i Kebir Hareket Listesi
│   │   ├── FinancialReportsView.tsx  # Bilanço, Gelir Tablosu (P&L) ve Mizan
│   │   ├── MediciTestRunner.tsx      # Canlı Medici Motor Doğrulama Paneli
│   │   └── JournalWizardModal.tsx    # Gelir / Gider / Yevmiye Fişi Modalı
│   └── lib/
│       ├── db.ts             # Hybrid MongoDB Connection Manager
│       ├── medici-service.ts # Medici Double-Entry Engine & Financial Calculations
│       └── utils.ts          # Formatters & TDHP Hesap Planı Dictionary
```

---

## 🔌 API Route Endpoints

| Metot | Endpoint | Açıklama |
| :--- | :--- | :--- |
| `POST` | `/api/medici/seed` | Örnek 7 adet TDHP gelir/gider yevmiye kaydını veritabanına yükler |
| `POST` | `/api/medici/journal` | Yeni çift taraflı yevmiye kaydı oluşturur ve commit eder |
| `GET` | `/api/medici/accounts` | Hesap planını ve canlı bakiyeleri döndürür |
| `GET` | `/api/medici/ledger` | Defter-i kebir işlem hareketlerini döndürür |
| `GET` | `/api/medici/reports` | Bilanço (Balance Sheet), Gelir Tablosu (P&L) ve Mizan (Trial Balance) üretir |
| `POST` | `/api/medici/test` | Medici çekirdek kurallarını birim testlerden geçirir |

---

## 📄 Lisans
MIT License - Geliştirmeye açık açık kaynak kütüphanedir.
