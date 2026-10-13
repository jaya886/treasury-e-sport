// UI strings per locale. Add a new locale by adding a key here (and to astro.config.mjs).
export const defaultLocale = 'id';

export const ui = {
  id: {
    'site.name': 'TEC 2026',
    'site.community': 'Treasury E-Sport Community',
    'site.tagline': 'Panduan Discord untuk peserta kompetisi',
    'site.description':
      'Panduan interaktif memakai Discord Treasury E-Sport Community untuk TEC 2026: cari jadwal, atur waktu main, dan lapor hasil laga.',
    'nav.home': 'Beranda',
    'nav.missions': 'Peta Misi',
    'nav.help': 'Bantuan',
    'xp.label': 'XP',
    'xp.rank': 'Pangkat',
    'footer.help': 'Masih bingung? Tanya di',
    'footer.note': 'Situs panduan komunitas. Tampilan Discord di situs ini adalah ilustrasi dan bisa sedikit berbeda dengan aplikasimu.',
    'mission.label': 'Misi',
    'mission.start': 'Mulai',
    'mission.replay': 'Ulangi',
    'mission.done': 'Selesai',
    'mission.soon': 'Segera',
    'mission.minutes': 'mnt',
    'mission.back': 'Kembali ke Peta Misi',
    'mission.soonTitle': 'Misi ini sedang disiapkan',
    'mission.soonBody': 'Konten misi ini sedang dibuat. Sementara itu, coba misi yang sudah tersedia.',
    'deck.prev': 'Sebelumnya',
    'deck.next': 'Berikutnya',
    'deck.play': 'Putar',
    'deck.pause': 'Jeda',
    'deck.replay': 'Putar ulang adegan',
    'deck.modeWatch': 'Tonton',
    'deck.modeTry': 'Coba Sendiri',
    'deck.device': 'Perangkat',
    'deck.mobile': 'HP',
    'deck.desktop': 'Laptop',
    'deck.step': 'Langkah',
    'deck.skip': 'Lewati',
    'deck.tapHere': 'Ketuk di sini',
    'deck.finish': 'Selesaikan Misi',
    'deck.nextMission': 'Misi berikutnya',
    'toast.missionDone': 'Misi Selesai!',
    'toast.badge': 'Lencana baru',
    'copy.copy': 'Salin format',
    'copy.copied': 'Tersalin!',
  },
} as const;

export type Locale = keyof typeof ui;
export type UIKey = keyof (typeof ui)[typeof defaultLocale];

export function useTranslations(locale: Locale = defaultLocale) {
  return (key: UIKey): string => ui[locale][key] ?? ui[defaultLocale][key];
}

/** Ranks unlocked by XP (100 XP per finished mission). */
export const ranks: Record<Locale, { min: number; name: string }[]> = {
  id: [
    { min: 0, name: 'Rekrut' },
    { min: 100, name: 'Penantang' },
    { min: 300, name: 'Petarung' },
    { min: 500, name: 'Andalan' },
    { min: 800, name: 'Legenda TEC' },
  ],
};
