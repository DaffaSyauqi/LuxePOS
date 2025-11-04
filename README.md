# 💼 LuxePOS — Aplikasi Web Point of Sales (Quasar SSR)

**LuxePOS** adalah aplikasi web Point of Sales (POS) modern yang dibangun menggunakan **Quasar Framework (mode SSR)** dengan dukungan **Node.js**, **Express**, dan **PostgreSQL**.  
Aplikasi ini dirancang untuk memberikan antarmuka yang cepat, responsif, dan mudah digunakan dalam mengelola penjualan, produk, kategori, serta sistem role dan permission di lingkungan toko.

---

## 🚀 Fitur Utama
- 🧾 Sistem POS lengkap menggunakan **Quasar SSR**
- 📦 Manajemen produk & kategori (tambah, edit, hapus)
- 🖼️ Upload dan manajemen gambar produk
- 🏪 Registrasi toko untuk admin baru
- 👤 Autentikasi pengguna dengan sistem role (admin, kasir)
- 🖨️ Fitur cetak faktur / struk penjualan
- 🗃️ Backend menggunakan **Express.js** dan **Sequelize ORM**
- 🗄️ Dukungan database **PostgreSQL**

---

## 🧩 Teknologi yang Digunakan
### Frontend:
- [Quasar Framework (SSR Mode)](https://quasar.dev/)
- [Vue 3](https://vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Axios](https://axios-http.com/)

### Backend:
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Sequelize ORM](https://sequelize.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT Authentication](https://jwt.io/)

---

### 1️⃣ Clone Repository
```bash
git clone https://github.com/DaffaSyauqi/luxepos.git
cd luxepos
```

### 2️⃣ Instal Dependensi
```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

### 3️⃣ Konfigurasi Environment Variable
Buat file .env di direktori utama proyek dan isi variabel berikut sesuai kebutuhan:
```bash
DATABASE_URL=postgres://user:password@localhost:5432/luxepos
JWT_SECRET=jwt_secret_kamu
```

### 4️⃣ Jalankan Server Development
```bash
quasar dev
```
---

## 🧱 Struktur Folder
```bash
luxepos/
├── src/
│   ├── components/       # Komponen Vue yang dapat digunakan ulang
│   ├── layouts/          # Layout halaman utama
│   ├── pages/            # Halaman aplikasi
│   ├── composables/      # Logic reusable 
│   ├── boot/             # File inisialisasi Quasar 
│   ├── stores/           # State management menggunakan Pinia
│   └── assets/           # File statis
├── server/
│   ├── models/           # Model Sequelize
│   ├── routes/           # Route Express
│   ├── controllers/      # Logika bisnis untuk tiap route
│   ├── middlewares/      # Middleware
│   └── app.js            # Entry point server Express
├── public/               # Aset publik
├── quasar.config.js      # Konfigurasi utama Quasar
└── package.json
```


