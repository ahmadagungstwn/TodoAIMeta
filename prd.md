# PRD - Ideaku AI Simplified

## 1. Ringkasan Produk

Ideaku AI adalah aplikasi web/mobile-first sederhana untuk mencatat, mengelola, dan mengembangkan ide. Pengguna dapat menyimpan ide, mengelompokkan ide berdasarkan kategori, memberi status progress, membuat checklist, dan menggunakan chat AI umum untuk bertanya tentang ide atau rencana aplikasi.

Aplikasi ini dibuat sederhana agar cepat selesai dan mudah dikembangkan.

---

## 2. Stack

Stack yang digunakan:

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase

Backend:

- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- Supabase Storage tidak dipakai dulu

AI:

- OpenRouter nanti
- Chat AI bersifat umum, bukan per ide
- Untuk tahap awal, AI Chat boleh pakai mock UI dulu

---

## 3. Fitur Utama

### Fitur Wajib MVP

1. Register dan login user
2. Dashboard sederhana
3. Tambah ide
4. Lihat daftar ide
5. Detail ide
6. Edit ide
7. Hapus ide
8. Kategori ide
9. Checklist per ide
10. Chat AI umum
11. Profile sederhana

### Fitur Tidak Dibuat Dulu

- Subscription
- Dark mode
- AI ringkas
- AI usage limit
- Payment
- Upload file
- Simpan file audio
- Simpan file gambar scan
- Chat AI per ide
- Catatan AI per ide
- Reminder
- Kolaborasi user

---

## 4. Alur Penggunaan

### Register/Login

User membuka aplikasi, lalu login atau membuat akun baru.

### Menambah Ide

User menekan tombol tambah ide, lalu mengisi:

- Judul ide
- Deskripsi ide
- Kategori
- Status
- Source type

Source type digunakan untuk menandai asal input:

- manual
- voice
- scan

Untuk voice dan scan, aplikasi hanya menyimpan teks akhirnya, bukan file audio/gambar.

### Mengelola Ide

User dapat melihat semua ide, membuka detail ide, mengubah status, dan mengelola checklist.

### Chat AI Umum

User dapat membuka halaman AI Chat umum untuk bertanya tentang ide, stack teknologi, MVP, atau saran pengembangan.

Chat ini tidak terikat pada satu ide tertentu.

---

## 5. Struktur Halaman

| Halaman | Path | Fungsi |
|---|---|---|
| Login | /login | Login dan register |
| Dashboard | /dashboard | Ringkasan ide |
| Ideas List | /ideas | Daftar semua ide |
| Add Idea | /ideas/new | Tambah ide baru |
| Idea Detail | /ideas/:id | Detail ide dan checklist |
| AI Chat | /chat | Chat AI umum |
| Profile | /profile | Profil user sederhana |

---

# 6. Database

## 6.1 profiles

Menyimpan data profil pengguna.

| Kolom | Arti |
|---|---|
| id | ID pengguna, sama dengan auth.users.id dari Supabase Auth |
| full_name | Nama lengkap pengguna |
| email | Email pengguna |
| avatar_url | Link foto profil pengguna |
| created_at | Waktu data dibuat |
| updated_at | Waktu data terakhir diperbarui |

---

## 6.2 user_settings

Menyimpan pengaturan user sederhana.

| Kolom | Arti |
|---|---|
| id | ID unik pengaturan |
| user_id | ID pengguna pemilik pengaturan |
| created_at | Waktu dibuat |
| updated_at | Waktu diperbarui |

Catatan:

Untuk MVP, tabel ini hanya disiapkan. Jangan tambahkan dark mode, subscription, atau setting kompleks dulu.

---

## 6.3 categories

Menyimpan kategori ide.

| Kolom | Arti |
|---|---|
| id | ID unik kategori |
| user_id | ID pengguna pemilik kategori |
| name | Nama kategori, contoh: Kuliah, Startup, Konten |
| color | Warna badge kategori |
| created_at | Waktu dibuat |
| updated_at | Waktu diperbarui |

Default kategori saat user register:

- Kuliah
- Startup
- Konten
- AI
- Personal

---

## 6.4 ideas

Menyimpan data utama ide.

| Kolom | Arti |
|---|---|
| id | ID unik ide |
| user_id | ID pengguna pemilik ide |
| category_id | ID kategori dari tabel categories |
| title | Judul ide |
| description | Deskripsi ide |
| status | Status ide: not_started, in_progress, completed, paused |
| source_type | Sumber input ide: manual, voice, scan |
| created_at | Waktu dibuat |
| updated_at | Waktu diperbarui |

Catatan:

- Tidak ada priority.
- Tidak ada is_archived.
- Tidak ada last_opened_at.
- Untuk voice dan scan, simpan teks akhirnya di description.
- Tidak menyimpan file audio/gambar.

---

## 6.5 idea_tasks

Menyimpan checklist dari setiap ide.

| Kolom | Arti |
|---|---|
| id | ID unik checklist |
| user_id | ID pengguna |
| idea_id | ID ide yang punya checklist ini |
| title | Nama task/checklist |
| is_done | Apakah checklist sudah selesai |
| sort_order | Urutan checklist |
| created_at | Waktu dibuat |
| updated_at | Waktu diperbarui |

---

## 6.6 ai_chats

Menyimpan sesi chat AI umum.

| Kolom | Arti |
|---|---|
| id | ID unik sesi chat |
| user_id | ID pengguna pemilik chat |
| title | Judul sesi chat |
| created_at | Waktu dibuat |
| updated_at | Waktu diperbarui |

Catatan:

- Chat bersifat umum.
- Tidak ada idea_id.
- Tidak terhubung langsung ke ide tertentu.

---

## 6.7 ai_messages

Menyimpan pesan chat AI.

| Kolom | Arti |
|---|---|
| id | ID unik pesan |
| chat_id | ID sesi chat dari tabel ai_chats |
| user_id | ID pengguna |
| role | Pengirim pesan: user, assistant, atau system |
| content | Isi pesan |
| created_at | Waktu pesan dibuat |

---

# 7. Relasi Database

Relasi utama:

auth.users
→ profiles

profiles
→ user_settings

profiles
→ categories

profiles
→ ideas

categories
→ ideas

ideas
→ idea_tasks

profiles
→ ai_chats

ai_chats
→ ai_messages

---

# 8. Status Ide

Value status:

- not_started
- in_progress
- completed
- paused

Tampilan di UI:

| Database | Label UI |
|---|---|
| not_started | Belum mulai |
| in_progress | Berjalan |
| completed | Selesai |
| paused | Ditunda |

---

# 9. Source Type

Value source_type:

- manual
- voice
- scan

Tampilan di UI:

| Database | Label UI |
|---|---|
| manual | Manual |
| voice | Suara |
| scan | Scan |

---

# 10. Backend Requirement

Gunakan Supabase untuk:

1. Register/login/logout
2. Menyimpan profile user
3. Membuat kategori default saat user register
4. CRUD categories
5. CRUD ideas
6. CRUD checklist
7. Menyimpan chat AI umum
8. Menyimpan pesan chat AI
9. RLS agar user hanya bisa akses data miliknya

---

# 11. RLS Requirement

Semua tabel wajib menggunakan Row Level Security.

Aturan:

- User hanya bisa melihat data miliknya sendiri.
- User hanya bisa membuat data untuk dirinya sendiri.
- User hanya bisa mengubah data miliknya sendiri.
- User hanya bisa menghapus data miliknya sendiri.

Untuk tabel yang punya user_id:

auth.uid() = user_id

Untuk profiles:

auth.uid() = id

---

# 12. Fitur Voice dan Scan

Voice dan scan tidak menyimpan file.

Alur voice:

User bicara
→ suara jadi teks
→ teks masuk form ide
→ user edit
→ simpan ke ideas.description
→ source_type = voice

Alur scan:

User scan catatan
→ gambar jadi teks
→ teks masuk form ide
→ user edit
→ simpan ke ideas.description
→ source_type = scan

---

# 13. AI Chat

AI Chat dibuat umum.

Path:

/chat

Fungsi:

- User bertanya bebas tentang ide
- User minta saran stack
- User minta MVP
- User minta langkah pengerjaan
- User minta user flow

Untuk MVP awal:

- UI chat dibuat dulu
- Database ai_chats dan ai_messages disiapkan
- Integrasi OpenRouter dikerjakan setelah CRUD ide selesai

---

# 14. Acceptance Criteria

MVP dianggap selesai jika:

1. User bisa register.
2. User bisa login.
3. User bisa logout.
4. User bisa melihat dashboard.
5. User bisa membuat ide.
6. User bisa melihat daftar ide.
7. User bisa membuka detail ide.
8. User bisa edit ide.
9. User bisa hapus ide.
10. User bisa memilih kategori.
11. User bisa membuat checklist.
12. User bisa mencentang checklist.
13. User bisa membuka halaman chat AI umum.
14. User bisa menyimpan pesan chat.
15. Data setiap user aman dengan RLS.

---

# 15. Kesimpulan

Versi sederhana Ideaku AI hanya fokus pada:

- Auth
- Profile
- Categories
- Ideas
- Checklist
- Chat AI umum

Tidak ada fitur tambahan yang belum dibutuhkan.

Stack:

React + TypeScript + Supabase

Fokus utama:

Catat ide
→ Kelola kategori
→ Kelola checklist
→ Chat AI umum