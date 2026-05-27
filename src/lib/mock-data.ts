export const statusLabel = {
  not_started: 'Belum mulai',
  in_progress: 'Berjalan',
  completed: 'Selesai',
  paused: 'Ditunda',
} as const;

export const sourceLabel = {
  manual: 'Manual',
  voice: 'Suara',
  scan: 'Scan',
} as const;

export const weeklyIdeas = [
  { day: 'Sen', value: 30 },
  { day: 'Sel', value: 52 },
  { day: 'Rab', value: 22 },
  { day: 'Kam', value: 66, active: true },
  { day: 'Jum', value: 42 },
  { day: 'Sab', value: 18 },
  { day: 'Min', value: 8 },
];
