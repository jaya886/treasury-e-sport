// Mock of the real Treasury E-Sport Community server, used by the Discord simulator.
// Keep channel names in sync with the real server; people, teams and IDs are fictional.
import type { SimServer } from '../lib/sim-types';

export const server: SimServer = {
  name: 'Treasury E-Sport Community',
  me: 'budi',
  forum: 'tec-competition',
  categories: [
    {
      name: 'Informasi',
      emoji: '📣',
      channels: [
        { id: 'rules', name: 'rules', emoji: '📝', kind: 'rules' },
        { id: 'pengumuman', name: 'pengumuman', emoji: '📣', kind: 'announce' },
        { id: 'tec-competition', name: 'tec-competition', emoji: '🏅', kind: 'forum' },
        { id: 'support-dan-usulan', name: 'support-dan-usulan', emoji: '❓', kind: 'text' },
      ],
    },
    {
      name: 'yang kita mainkan',
      emoji: '🎮',
      channels: [
        { id: 'mlbb', name: 'mlbb', emoji: '🧙', kind: 'text' },
        { id: 'literally-catur', name: 'literally-catur', emoji: '♟️', kind: 'text' },
        { id: 'magic-chess-go-go', name: 'magic-chess-go-go', emoji: '🪄', kind: 'text' },
        { id: 'dota2', name: 'dota2', emoji: '🏙️', kind: 'text' },
        { id: 'pubgm', name: 'pubgm', emoji: '🪖', kind: 'text' },
        { id: 'bola', name: 'bola', emoji: '⚽', kind: 'text' },
      ],
    },
    {
      name: 'Topik Umum - General',
      emoji: '🌏',
      channels: [
        { id: 'general', name: 'general', kind: 'text' },
        { id: 'mending-rakit-pc', name: 'mending-rakit-pc', kind: 'text', locked: true },
      ],
    },
  ],
  users: {
    budi: { id: 'budi', name: 'Budi | KPPN Makassar I', color: '#2f8cff', online: true },
    raka: { id: 'raka', name: 'Raka | KPPN Ambon', color: '#e8590c' },
    sari: { id: 'sari', name: 'Sari | PIC', color: '#ffbc00', role: 'PIC', roleColor: '#ffbc00', online: true },
    admin: { id: 'admin', name: 'Admin TEC', color: '#9b5de5', role: 'Admin', roleColor: '#f0b232', online: true },
  },
  tags: {
    MLBB: { emoji: '🎮', tone: 'neutral' },
    Terjadwal: { emoji: '🔵', tone: 'blue' },
    'Menunggu Laporan': { emoji: '🟡', tone: 'yellow' },
    Selesai: { emoji: '🟢', tone: 'green' },
    Sengketa: { emoji: '🔴', tone: 'red' },
    WO: { emoji: '⚪', tone: 'grey' },
  },
  announcement: {
    id: 'ann-1',
    author: 'admin',
    time: 'Hari ini 08.00',
    text: '**Ronde 1 TEC 2026 dimulai!** 🎉\nThread laga setiap tim sudah dibuat di <#tec-competition>. Cek thread kalian, sepakati jam main, dan jangan lupa lapor hasil sebelum batas waktu.',
  },
};
