Tentu! Berikut versi README yang lebih modern, rapi, dan dengan gaya kekinian, yang tetap informatif dan mudah dipahami:

---

# 🌐 Frontend Developer Test — Sistem Ekspor-Impor Pelabuhan Pelindo

![Anime berjalan](https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif)

Aplikasi frontend interaktif untuk memudahkan manajemen produk ekspor-impor di Pelabuhan Pelindo, dibangun dengan ReactJS, Zustand, TailwindCSS (Shadcn UI), dan Vite. Data berasal dari REST API LoopBack.

---

## 🚀 Fitur Utama

* **Seleksi Bertahap:** Pilih Negara → Pelabuhan → Produk secara berurutan
* **Auto Select:** Otomatis memilih pelabuhan atau produk jika hanya ada satu opsi
* **Detail Produk:** Menampilkan detail produk secara real-time saat dipilih
* **Perhitungan Harga:** Hitung total harga dan diskon secara dinamis
* **Step Indicator:** Panduan langkah interaktif yang memudahkan pengguna
* **State Management:** Zustand untuk state global yang ringan & efisien

---

## 🛠 Teknologi yang Digunakan

| Teknologi   | Fungsi                      |
| ----------- | --------------------------- |
| ReactJS     | UI Library                  |
| Zustand     | Global State Management     |
| Shadcn UI   | Komponen UI modern (Radix)  |
| TailwindCSS | Utility-first CSS Framework |
| Vite        | Build tool & dev server     |

---

## 📂 Struktur Proyek

```
src/
├── components/
│   ├── common/       # Komponen seperti StepIndicator, dll
│   ├── selectors/    # Komponen pemilih Negara, Pelabuhan, Produk
│   └── details/      # Komponen detail produk
├── stores/           # Zustand global store
├── service/          # API configuration
├── App.jsx           # Root component aplikasi
├── main.jsx          # Entry point aplikasi
└── index.css         # Styling global Tailwind
```

---

## ⚙️ Konfigurasi Environment

Buat file `.env` di root project dan isi dengan:

```
VITE_API_BASE_URL=http://202.157.176.100:3001
```

---

## 🚀 Cara Instal & Menjalankan

```bash
# Clone repository
git clone https://github.com/preedok/frontend-muhamad-iqbal-aprido
cd frontend-muhamad-iqbal-aprido

# Install dependencies
npm install
# atau
yarn install

# Jalankan aplikasi dalam mode development
npm run dev
# atau
yarn dev
```

---

## 🌐 Akses Aplikasi

Buka di browser:

```
http://localhost:5173
```

---

## 📌 Catatan

* Pastikan API backend sudah berjalan di alamat yang terkonfigurasi di `.env`
* Gunakan browser modern untuk pengalaman terbaik

---