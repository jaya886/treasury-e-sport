import type { Locale } from '../i18n/ui';

export interface Mission {
  slug: string;
  no: number;
  title: string;
  blurb: string;
  minutes: number;
  xp: number;
  badge: string;
  /** false → page shows "coming soon" */
  ready: boolean;
}

export const missions: Record<Locale, Mission[]> = {
  id: [
    {
      slug: 'kenalan-discord',
      no: 0,
      title: 'Kenalan dengan Discord',
      blurb: 'Apa itu Discord, pasang aplikasinya, dan buat akun.',
      minutes: 3,
      xp: 100,
      badge: 'Pendatang Baru',
      ready: false,
    },
    {
      slug: 'masuk-server',
      no: 1,
      title: 'Masuk Server TEC',
      blurb: 'Buka undangan pribadimu dan atur nama panggilan.',
      minutes: 2,
      xp: 100,
      badge: 'Warga TEC',
      ready: false,
    },
    {
      slug: 'tur-server',
      no: 2,
      title: 'Tur Server',
      blurb: 'Kenali channel penting: pengumuman, laga, dan bantuan.',
      minutes: 3,
      xp: 100,
      badge: 'Penjelajah',
      ready: false,
    },
    {
      slug: 'cari-jadwal',
      no: 3,
      title: 'Cari Jadwal Laga',
      blurb: 'Temukan thread laga kamu dan baca jam main sesuai zona waktumu.',
      minutes: 3,
      xp: 100,
      badge: 'Tepat Waktu',
      ready: false,
    },
    {
      slug: 'atur-waktu',
      no: 4,
      title: 'Atur Waktu Main',
      blurb: 'Sepakati jam main dengan lawan di dalam thread laga.',
      minutes: 2,
      xp: 100,
      badge: 'Diplomat',
      ready: false,
    },
    {
      slug: 'lapor-hasil',
      no: 5,
      title: 'Lapor Hasil',
      blurb: 'Kirim screenshot dan skor, lalu tunggu konfirmasi lawan.',
      minutes: 4,
      xp: 100,
      badge: 'Pelapor Andal',
      ready: true,
    },
    {
      slug: 'sengketa-wo',
      no: 6,
      title: 'Sengketa & WO',
      blurb: 'Apa yang terjadi jika hasil tidak disepakati atau lewat batas waktu.',
      minutes: 2,
      xp: 100,
      badge: 'Sportif',
      ready: false,
    },
    {
      slug: 'minta-bantuan',
      no: 7,
      title: 'Minta Bantuan',
      blurb: 'Cara bertanya ke panitia di #support-dan-usulan.',
      minutes: 2,
      xp: 100,
      badge: 'Pemberani',
      ready: false,
    },
  ],
};

export const games = [
  { key: 'mlbb', name: 'MLBB', full: 'Mobile Legends: Bang Bang', report: 'Thread laga', idHint: 'Match ID' },
  { key: 'pubgm', name: 'PUBGM', full: 'PUBG Mobile', report: 'Menunggu PIC', idHint: '—' },
  { key: 'mcgg', name: 'MCGG', full: 'Magic Chess: Go Go', report: 'Thread laga', idHint: 'Match ID' },
  { key: 'dota2', name: 'Dota 2', full: 'Dota 2', report: 'Thread laga', idHint: 'Match ID' },
  { key: 'catur', name: 'Catur', full: 'Catur (lichess.org)', report: 'Thread laga', idHint: 'Tautan partai' },
  { key: 'fc27', name: 'FC 27', full: 'EA Sports FC 27', report: 'Luring', idHint: '—' },
] as const;
