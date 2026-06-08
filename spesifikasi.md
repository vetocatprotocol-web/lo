
### 1. Landing Page Publik (Public Homepage)

**Tujuan:** Menarik calon pelanggan, memberikan informasi klinik, dan memudahkan akses login/registrasi.

**Fitur Utama:**

- **Hero Section**  
  - Judul besar: “Klinik Hewan Terpercaya untuk Sahabat Anda”  
  - Subjudul + tombol **“Daftar Sekarang”** dan **“Login”**

- **Layanan Klinik**  
  - Daftar layanan (vaksinasi, pemeriksaan umum, bedah, grooming, laboratorium, dll) dengan ikon

- **Dokter Kami**  
  - Carousel atau grid foto dokter beserta spesialisasi dan pengalaman singkat

- **Testimoni Pelanggan**  
  - Review dari pelanggan beserta foto hewan

- **Informasi Praktis**  
  - Alamat, jam operasional, nomor telepon/WhatsApp, Google Maps embed

- **Artikel/Blog Teaser**  
  - 3–4 artikel terbaru (tips kesehatan hewan)

- **Footer**  
  - Link cepat, kontak, social media, kebijakan privasi

**Fitur Tambahan:**
- Responsif mobile-friendly
- Form “Konsultasi Gratis” atau “Booking Janji Temu” cepat
- Tombol WhatsApp floating
- SEO optimized (meta title, description, Open Graph)

---

### 2. Dashboard Pelanggan

**Role:** Pemilik hewan / Pelanggan

**Fitur Utama:**

| Menu | Fitur Utama |
|------|-------------|
| **Beranda** | Ringkasan: Hewan saya, appointment mendatang, notifikasi |
| **Hewan Saya** | CRUD hewan (tambah, edit, hapus), upload foto, info microchip, riwayat kesehatan |
| **Monitoring Hewan** | Input data harian (berat, suhu, nafsu makan, aktivitas, catatan), grafik tren, peringatan abnormal |
| **Appointment** | Booking janji temu, lihat jadwal dokter, riwayat booking + status (Pending, Confirmed, Done) |
| **Riwayat Kunjungan** | Daftar rekam medis semua kunjungan, filter berdasarkan tanggal/hewan |
| **Konsultasi / Chat** | Chat langsung dengan dokter (realtime), riwayat chat |
| **Profil & Pengaturan** | Edit data diri, ganti password, notifikasi preference |
| **Invoice & Pembayaran** | Lihat tagihan, riwayat pembayaran |

**Fitur Pendukung:**
- Notifikasi push/email (reminder vaksin, appointment, hasil lab)
- Download rekam medis dalam format PDF
- Dark mode support

---

### 3. Dashboard Dokter

**Role:** Dokter Hewan

**Fitur Utama:**

| Menu | Fitur Utama |
|------|-------------|
| **Beranda** | Jadwal hari ini, antrian pasien saat ini, statistik singkat |
| **Antrian Hari Ini** | Daftar antrian realtime, status pasien (Menunggu, Sedang Diperiksa, Selesai) |
| **Pasien Hari Ini** | Detail pasien yang sedang ditangani, akses cepat monitoring & riwayat |
| **Rekam Medis** | Input diagnosis, keluhan, pemeriksaan fisik, diagnosis, tindakan, resep obat, follow-up |
| **Jadwal Saya** | Lihat & atur jadwal praktik, cuti, ketersediaan slot |
| **Chat Konsultasi** | Chat dengan pelanggan (bisa dari antrian atau booking) |
| **Riwayat Pasien** | Cari pasien/hewan, lihat semua rekam medis |
| **Laporan Harian** | Ringkasan pasien yang ditangani hari ini |

**Fitur Khusus Dokter:**
- Otomatis pengurangan stok obat saat meresepkan
- Foto atau lampiran hasil pemeriksaan
- Akses monitoring harian pelanggan
- Notifikasi realtime antrian baru

---

### 4. Dashboard Admin

**Role:** Pemilik Klinik / Administrator

**Fitur Utama:**

| Menu | Fitur Utama |
|------|-------------|
| **Beranda** | Dashboard overview: jumlah pasien hari ini, pendapatan, antrian aktif, statistik |
| **Manajemen User** | CRUD Pelanggan, Dokter, dan Staff (aktivasi, role, reset password) |
| **Manajemen Hewan** | Overview semua hewan (opsional) |
| **Appointment** | Kelola semua booking, konfirmasi, pembatalan, reschedule |
| **Jadwal Dokter** | Atur jadwal semua dokter, kelola shift |
| **Inventory & Obat** | Manajemen stok obat, alert stok rendah, riwayat pemakaian |
| **Keuangan** | Laporan pendapatan, pengeluaran, invoice, rekap harian/mingguan/bulanan |
| **Rekam Medis** | Akses keseluruhan rekam medis (view only atau edit khusus) |
| **Notifikasi** | Kelola template notifikasi email/WhatsApp |
| **Pengaturan Klinik** | Profil klinik, jam operasional, harga layanan, konfigurasi sistem |

**Fitur Tambahan Admin:**
- Export laporan ke Excel/PDF
- Manajemen konten landing page (opsional)
- User activity log
- Backup & restore database (via Dokploy)

---

### Ringkasan Akses Berdasarkan Role

| Fitur                    | Pelanggan | Dokter | Admin |
|--------------------------|---------|--------|-------|
| Booking Appointment      | ✓       | View   | Full  |
| Rekam Medis              | View    | Full   | View  |
| Monitoring Hewan         | Input   | View   | View  |
| Inventory                | -       | View   | Full  |
| Keuangan & Laporan       | -       | -      | Full  |
| Manajemen User           | -       | -      | Full  |
| Chat Konsultasi          | ✓       | ✓      | View  |

---

