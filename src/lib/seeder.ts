import { supabase } from './supabase';

export async function seedDemoData(userId: string) {
  // 1. Fetch categories for this user to match names
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('user_id', userId);

  const getCategoryId = (name: string): string => {
    const matched = categories?.find((c: any) => c.name.toLowerCase() === name.toLowerCase());
    return matched ? matched.id : categories?.[0]?.id || '';
  };

  // 2. Define the 3 premium modern ideas
  const ideasToSeed = [
    {
      user_id: userId,
      category_id: getCategoryId('AI'),
      title: 'NutriScan AI - Personal Nutritionist via Smart Glass',
      description: 'Sistem pendeteksi kalori dan zat gizi makanan otomatis harian secara real-time menggunakan kacamata pintar AR atau kamera ponsel. Data terhubung langsung ke Apple Health dan Garmin smartwatch untuk sinkronisasi pembakaran kalori aktif secara presisi.',
      status: 'in_progress',
      source_type: 'manual',
      tasks: [
        'Riset integrasi API Apple HealthKit & Garmin Connect Developer portal',
        'Lakukan fine-tuning model visi komputer untuk klasifikasi makanan nusantara',
        'Desain antarmuka grafik dashboard nutrisi harian yang minimalis',
        'Rilis purwarupa Alpha tertutup untuk pengujian 10 pengguna awal'
      ]
    },
    {
      user_id: userId,
      category_id: getCategoryId('Startup'),
      title: 'EcoShare - Decentralized IoT Smart Composter & Reward Points',
      description: 'Mesin pembuat kompos organik pintar skala perumahan berbasis perangkat IoT ESP32. Sensor mendeteksi kadar gas, suhu, dan kelembapan kompos. Setiap kontribusi sampah organik rumah tangga diverifikasi dan diberikan poin reward digital belanja sembako.',
      status: 'not_started',
      source_type: 'manual',
      tasks: [
        'Desain sirkuit mikrokontroler ESP32 + sensor gas metana & suhu tanah',
        'Rancang arsitektur smart contract / database poin belanja ramah lingkungan',
        'Jalin kolaborasi awal dengan 3 minimarket / warung lokal untuk klaim poin',
        'Rakit casing composter luar berbahan dasar plastik daur ulang'
      ]
    },
    {
      user_id: userId,
      category_id: getCategoryId('Konten'),
      title: 'SyntheCut - AI Automated Editor for Faceless Content Creators',
      description: 'Aplikasi berbasis web untuk merubah naskah artikel menjadi video pendek (TikTok/Reels/Shorts) siap saji. Menggunakan klon suara AI natural, sinkronisasi subtitle animasi pop dinamis, dan penempatan video latar B-roll otomatis berbasis analisis semantik.',
      status: 'in_progress',
      source_type: 'manual',
      tasks: [
        'Integrasikan model Text-to-Speech ekspresif dengan intonasi natural',
        'Buat algoritma penempatan otomatis subtitle dengan transisi teks per kata',
        'Hubungkan portal API media stock komersial bebas hak cipta',
        'Desain alur otomatisasi posting jadwal unggah ke TikTok & Reels'
      ]
    }
  ];

  // 3. Insert each idea and its tasks sequentially
  for (const item of ideasToSeed) {
    const { data: newIdea, error: ideaErr } = await supabase
      .from('ideas')
      .insert({
        user_id: item.user_id,
        category_id: item.category_id,
        title: item.title,
        description: item.description,
        status: item.status,
        source_type: item.source_type
      })
      .select()
      .single();

    if (ideaErr) {
      console.error('Error seeding idea:', ideaErr);
      continue;
    }

    if (newIdea) {
      // Create checklist tasks
      const tasksToInsert = item.tasks.map((taskTitle, idx) => ({
        user_id: userId,
        idea_id: newIdea.id,
        title: taskTitle,
        is_done: false,
        sort_order: idx + 1
      }));

      const { error: taskErr } = await supabase
        .from('idea_tasks')
        .insert(tasksToInsert);

      if (taskErr) {
        console.error('Error seeding tasks for idea:', newIdea.id, taskErr);
      }
    }
  }
}
