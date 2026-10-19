// Tournament facts shown on the homepage. Update here when the committee announces details.
import type { Locale } from '../i18n/ui';

export const tournamentFacts: Record<Locale, { icon: string; label: string; value: string }[]> = {
  id: [
    { icon: '🎮', label: 'Cabang', value: 'MLBB · PUBGM · MCGG · Dota 2 · Catur · FC 27' },
    { icon: '👥', label: 'Peserta', value: 'Pegawai DJPb dari seluruh Indonesia' },
    { icon: '🌐', label: 'Pelaksanaan', value: 'Daring, kecuali FC 27 (luring)' },
    { icon: '🗓️', label: 'Jadwal & format', value: 'Segera diumumkan di #📣pengumuman' },
  ],
};
