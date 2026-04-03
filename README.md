# Military Attendance System (MAS) 🎖️

**Sistem Absensi Keluar & Kembali** - Modular Security Platform

## 📌 Overview

Sistem enterprise-grade untuk memantau pergerakan anggota satuan secara aman, disiplin, fleksibel, dan auditable.

Menggunakan **QR dinamis + device binding + smart detection**, sistem ini memungkinkan petugas untuk mengontrol tingkat keamanan sesuai kebutuhan operasional. Fokus pada:

- ✅ Disiplin tinggi & validasi kehadiran ketat
- ✅ Audit penuh untuk komando
- ✅ Real-time monitoring
- ✅ Produksi-ready

---

## 🚀 Key Features

---

## 📦 Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Monorepo** | Turborepo | Workspace management |
| **Backend** | NestJS + Node.js | REST API & business logic |
| **Frontend** | Next.js 14 (App Router) | Admin dashboard |
| **Database** | PostgreSQL + Prisma | Type-safe data layer |
| **Cache** | Redis | Token & session caching |
| **Realtime** | Socket.IO | Live dashboard updates |
| **Authentication** | NRP + PIN | Military-grade security |

---

## 📁 Directory Structure

```
/lo (Production-Ready Monorepo)
├── apps/
│   ├── web/                  # Next.js Admin Dashboard
│   │   ├── app/dashboard     # Statistics & overview
│   │   ├── app/members       # Member management
│   │   ├── app/import        # Bulk import UI
│   │   ├── app/logs          # Activity logs
│   │   └── app/settings      # Config & feature toggles
│   │
│   └── api/                  # NestJS Backend (10 Modular Services)
│       ├── modules/auth/     # Authentication (PIN+JWT)
│       ├── modules/device/   # Device binding & validation
│       ├── modules/location/ # GPS & geo-fence validation
│       ├── modules/qr-token/ # Dynamic QR token generation
│       ├── modules/attendance/  # Attendance recording
│       ├── modules/detection/   # Anomaly detection engine
│       ├── modules/audit-log/   # Comprehensive logging
│       ├── modules/config/      # Feature toggles (centralized)
│       ├── modules/import/      # Bulk import (CSV/XLSX)
│       └── modules/stats/       # Real-time statistics
│
├── packages/                  # Shared Code
│   ├── types/                 # Shared TypeScript types
│   ├── constants/             # System constants
│   ├── lib/                   # Utilities (validation, encryption, detection)
│   ├── ui/                    # Shared UI components
│   └── config/                # ESLint, Prettier, tsconfig
│
├── prisma/                    # Database
│   ├── schema.prisma          # Complete schema (8 models)
│   ├── seed.ts                # Demo data seeding
│   └── scripts/               # Setup & cleanup
│
└── docs/                      # Documentation
    ├── architecture.md        # System design
    └── api.md                 # Full API reference
```

---

## 🔳 QR-Based Attendance

## 🔳 QR-Based Attendance

- Dynamic QR tokens (10-minute expiry, auto-refresh every 10 seconds)
- Prevents unauthorized scanning
- Time-limited verification

## 🔐 Modular Security System

All security features can be configured via `/config/system` endpoint:

```json
{
  "auth": { "pin": true, "otp": false, "face": true },
  "device": { "mode": "strict" },
  "geo": { "mode": "hybrid", "radius": 50 },
  "qr": { "refresh": 10 },
  "detection": { "level": "high" }
}
```

Real-time toggle system for operational flexibility.

## 📍 Location Validation

- GPS coordinate validation
- Multiple geo-fence support (configurable radius)
- Hybrid mode: GPS + network triangulation
- Accuracy checking

## 📱 Device Binding

- Device UUID/fingerprint tracking
- Device-to-user binding
- Device verification
- Multiple device support per user

## 📸 Proof of Presence (Camera)

- Snapshot capture at attendance
- Optional / Required modes
- Timestamp & GPS embedding

## 🧠 Smart Detection Engine

Automatic anomaly detection with 3-level response:

**Rules:**
- Location Jump: Distance > 1km in < 5 minutes → +40 points
- Rapid Scanning: 2+ scans in 30 seconds → +30 points
- Device Switch: Device change in < 10 minutes → +25 points

**Status:**
- **Normal** (0-29): Accept
- **Suspicious** (30-79): Flag & log
- **Blocked** (80+): Reject

## 📊 Audit & Monitoring

- Complete activity logs (NRP, device, IP, coordinates, timestamp)
- Real-time monitoring dashboard
- Member status tracking (inside/outside)
- Security alert aggregation

## ⚙️ Installer & Quick Setup

```bash
# Installation
pnpm install

# Setup Database
pnpm db:setup

# Start Development
pnpm dev

# Available Commands
pnpm build                 # Production build
pnpm lint                 # Code quality
pnpm db:seed             # Demo data
pnpm db:clean            # Clean database
```

---

## 🆕 📥 Bulk Import System (CSV/XLSX)

## 🆕 📥 Bulk Import System (CSV/XLSX)

Untuk kebutuhan satuan (kompi/batalyon), sistem mendukung input data anggota secara massal.

### 📄 Format File yang Didukung

- `.csv` - Comma-separated values
- `.xlsx` - Microsoft Excel

### 🧾 Struktur Data (Wajib)

| Field | Keterangan | Format |
|-------|-----------|--------|
| `nrp` | Nomor Registrasi Prajurit | 8 digit (unik) |
| `name` | Nama anggota | String |
| `rank` | Pangkat | String |
| `unit` | Unit / Kompi | String |
| `pin` | PIN awal | 4 digit |

### ⚙️ Import Features

- ✅ Upload langsung dari dashboard
- ✅ Validasi otomatis (NRP duplikat, format)
- ✅ Preview sebelum submit
- ✅ Mode: Skip duplicates atau Overwrite
- ✅ Batch processing (hingga 1000 records)
- ✅ Error reporting dengan row details

### 🔒 Security

- Hanya admin yang berwenang
- Full audit trail
- Encrypted transmission

---

## 📊 Admin Dashboard

### Pages

1. **Dashboard** - Real-time stats, members status, alerts
2. **Members** - Member list, NRP, rank, unit, status
3. **Bulk Import** - CSV/XLSX upload, preview, execution
4. **Activity Logs** - Timestamp, status, detection, GPS, real-time
5. **Settings** - Config panel, feature toggles, radius adjustment

### Real-Time Features

- WebSocket integration for live updates
- Stats refresh every 10 seconds
- Alert notifications
- Member status tracking

---

## 🔌 API Endpoints (Rest + WebSocket)

### Core Endpoints

```
POST   /auth/login                    # NRP + PIN login
POST   /auth/verify-pin               # PIN verification

POST   /attendance/record             # Record attendance
GET    /attendance/user/:id           # User history
GET    /attendance/today              # Today's stats

POST   /qr-token/generate             # Generate QR token
GET    /qr-token/refresh              # Refresh token

GET    /config/system                 # Get system config
PUT    /config/system                 # Update config
GET    /config/features               # Get active features

POST   /import/users                  # Bulk import
GET    /import/logs                   # Import history

GET    /stats/attendance              # Attendance stats
GET    /stats/dashboard               # Dashboard stats

GET    /audit-logs                    # Audit logs
```

### WebSocket Events

```
stats:subscribe                       # Subscribe to stats
stats:update                          # Stats changed
activity:log                          # New attendance
alert                                 # Security alert
qr:refresh                            # QR token refresh
```

---

## 🗄️ Database Models

1. **User** - NRP, name, rank, unit, hashed PIN, active status
2. **Device** - User-to-device binding, device ID, model, OS
3. **ActivityLog** - Attendance records with GPS, detection results
4. **QRToken** - Dynamic tokens with expiry
5. **SystemConfig** - Centralized configuration
6. **ImportLog** - Bulk import history & results
7. **AuditLog** - Complete action history

---

## 🧼 Code Quality

```bash
pnpm lint                    # ESLint
pnpm format                  # Prettier (100 char line limit)
pnpm type-check             # TypeScript strict mode
```

**Standards:**
- Strict TypeScript
- ESLint configuration
- Consistent naming conventions
- Clean Architecture principles
- Separation of concerns

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 18.0.0
pnpm >= 8.0.0
PostgreSQL >= 14
Redis >= 7.0
```

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Create environment
cp .env.example .env.local

# 3. Configure database & Redis
DATABASE_URL="postgresql://user:pwd@localhost:5432/military_attendance"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"

# 4. Setup database
pnpm db:setup

# 5. Start development (both web + api)
pnpm dev
```

### Access

- **Dashboard**: http://localhost:3000
- **API**: http://localhost:3001
- **Docs**: See `/docs/` folder

---

## 📚 Documentation

- **[Architecture Guide](./docs/architecture.md)** - System design, layers, flows
- **[API Reference](./docs/api.md)** - Complete endpoint documentation

---

## 🤝 Contributing

1. Follow code standards (lint + format)
2. Test changes locally
3. Create descriptive commit messages
4. Submit pull request

---

## 🔐 Security Notes

- PIN stored with bcrypt hashing
- JWT tokens for session management
- Device ID validation mandatory
- All activities audited
- Location validation required
- Rate limiting on auth endpoints

---

## 📞 Support

For deployment, customization, or troubleshooting, refer to:
- Architecture documentation
- API reference
- Environment variables guide

---

**Status**: ✅ Production-Ready  
**Version**: 1.0.0  
**Last Updated**: 2024  
**License**: Military-Grade | Internal Use Only

---

Built with ❤️ for military operations | Designed for enterprise scale
- Setiap perubahan data anggota tersimpan

---

🖥️ Admin Dashboard (Pos Jaga)

Dashboard dirancang untuk kebutuhan operasional militer, cepat, jelas, dan minim distraksi.

---

📊 Statistik Operasional (Real-Time)

Dashboard menampilkan statistik berikut:

🪖 Status Anggota

- Total anggota aktif
- Jumlah anggota:
  - 🟢 Di dalam markas
  - 🔵 Sedang keluar
  - 🔴 Terlambat kembali

---

⏱️ Aktivitas Harian

- Total keluar hari ini
- Total kembali hari ini
- Peak hour aktivitas

---

⚠️ Keamanan & Anomali

- Jumlah aktivitas mencurigakan
- Fake GPS terdeteksi
- Device tidak dikenal
- Scan di luar radius

---

📍 Monitoring Lokasi

- Distribusi lokasi anggota (opsional map)
- Highlight anggota di luar zona

---

📈 Tren

- Grafik aktivitas harian / mingguan
- Pola keluar-masuk satuan

---

🔧 Security Control Panel

Petugas dapat mengatur:

- Tingkat keamanan
- Aktivasi modul
- Parameter sistem

---

🎯 Preset Mode

Mode| Deskripsi
🟢 LOW| Operasional ringan
🟡 MEDIUM| Standar
🔴 HIGH| Disiplin tinggi (direkomendasikan)

---

🧩 Modular Feature Toggle System

Module| Mode
Authentication| PIN / OTP / Face
Device Binding| OFF / SOFT / STRICT
Location| OFF / GPS / HYBRID
QR Security| Configurable
Presence| OFF / OPTIONAL / REQUIRED
Detection| LOW / MEDIUM / HIGH
Audit| ON / OFF

---

🔄 System Flow

📤 Keluar

1. Scan QR Keluar
2. Validasi token
3. Login anggota
4. Validasi device
5. Validasi lokasi
6. Capture bukti (jika aktif)
7. Analisis sistem
8. Submit → status keluar tercatat

---

📥 Kembali

Flow identik dengan update status kembali.

---

🔒 Security Features

Risiko| Mitigasi
Penyalahgunaan QR| Token dinamis
Fake GPS| Hybrid validation
PIN sharing| Device binding
Manipulasi waktu| Server timestamp
Aktivitas mencurigakan| Smart detection

---

🏗️ System Architecture

Backend

- Token engine
- Validation engine
- Smart detection
- Config system

Frontend

- PWA scan QR
- Dashboard admin (pos jaga)

Database

- Data anggota
- Log aktivitas
- Konfigurasi sistem

---

⚙️ Configuration Example

{
  "device_mode": "strict",
  "geo_mode": "hybrid",
  "qr_refresh": 10,
  "face_required": true,
  "detection_level": "high"
}

---

📦 Installation

1. Jalankan installer
2. Setup koordinat pos
3. Atur radius & token
4. Import data anggota (bulk)
5. Sistem siap digunakan

---

📝 Operational Notes (Militer)

- QR ditempatkan di pos jaga resmi
- Absensi wajib dilakukan secara langsung (tidak boleh diwakilkan)
- Setiap aktivitas tercatat untuk kebutuhan audit komando
- Data anggota harus diperbarui secara berkala

---

💡 Use Cases

- Satuan militer
- Pengamanan objek vital
- Operasi lapangan
- Latihan militer

---

🚀 Roadmap

- Integrasi biometrik lanjutan
- Offline mode (operasi lapangan)
- Integrasi sistem komando
- AI behavior analysis

---

🛡️ Value Proposition

- Disiplin & kontrol tinggi
- Transparansi operasional
- Konfigurasi fleksibel
- Siap deployment lapangan

---

📄 License

Custom Military / Enterprise License

---

👨‍💻 Author

Dirancang untuk mendukung operasional satuan dengan standar disiplin tinggi, keamanan, dan akuntabilitas penuh.
