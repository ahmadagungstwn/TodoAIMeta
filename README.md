# Ideaku AI

Ideaku AI adalah aplikasi mobile-first untuk mencatat ide, mengelola kategori, membuat checklist ide, dan menggunakan chat AI umum. UI dibuat clean, modern, dan simpel agar nyaman dipakai di layar HP.

## Fitur

- Login dan register dengan Supabase Auth
- Dashboard ide dengan ringkasan sederhana
- Daftar ide dengan pencarian dan filter
- Tambah ide manual
- Detail ide dengan checklist
- Voice input untuk mengubah suara menjadi teks ide
- Scan teks dari kamera/foto dengan OCR
- Chat AI umum
- Profile sederhana

## Stack

- React
- TypeScript
- Vite
- Supabase
- Tesseract.js untuk OCR gratis di browser
- OpenRouter untuk chat AI

## Database

Aplikasi mengikuti tabel berikut:

- `profiles`
- `user_settings`
- `categories`
- `ideas`
- `idea_tasks`
- `ai_chats`
- `ai_messages`

Voice dan scan hanya dipakai untuk menghasilkan teks sementara di browser. Audio, foto, dan file scan tidak disimpan ke database atau storage. Yang disimpan ke Supabase hanya data teks di tabel `ideas`.

## Setup

Install dependency:

```bash
npm install
```

Buat file `.env` dari contoh:

```bash
cp .env.example .env
```

Isi environment:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
VITE_OPENROUTER_MODEL=your_openrouter_model
```

Jalankan development server:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

## Catatan Security

File `.env` tidak boleh dipush ke GitHub dan sudah masuk `.gitignore`.

`VITE_SUPABASE_ANON_KEY` boleh dipakai di frontend jika RLS Supabase sudah benar. Jangan pernah memakai Supabase service role key di frontend.

`VITE_OPENROUTER_API_KEY` akan ikut terbaca di bundle frontend saat deploy karena memakai prefix `VITE_`. Untuk production yang lebih aman, pindahkan pemanggilan OpenRouter ke backend atau Supabase Edge Function.

## Migration

Schema awal tersedia di folder:

```bash
supabase/migrations
```

Pastikan migration diterapkan ke project Supabase sebelum menjalankan app dengan data asli.
