// Mock of the real Treasury E-Sport Community server, used by the Discord simulator.
// Keep channel names in sync with the real server; people, teams and IDs are fictional.
import type { SimPost, SimServer } from '../lib/sim-types';

const pic = 'sari';

const otherPost = (id: string, title: string, tags: string[], replies: number): SimPost => ({
  id,
  title,
  tags,
  author: pic,
  time: 'Kemarin 09.00',
  text: '',
  replies: Array.from({ length: replies }, (_, i) => ({ id: `${id}-${i}`, author: 'raka', text: '' })),
});

export const server: SimServer = {
  name: 'Treasury E-Sport Community',
  me: 'budi',
  forum: 'tec-2026',
  stats: { online: 48, members: 212 },
  categories: [
    {
      name: 'Informasi',
      emoji: '📣',
      channels: [
        { id: 'rules', name: 'rules', emoji: '📝', kind: 'rules', topic: 'Peraturan server' },
        { id: 'pengumuman', name: 'pengumuman', emoji: '📣', kind: 'announce', topic: 'Pengumuman resmi & info kompetisi' },
        { id: 'tec-2026', name: 'tec-2026', emoji: '🏅', kind: 'forum', topic: 'Thread laga & pelaporan hasil TEC 2026' },
        { id: 'support-dan-usulan', name: 'support-dan-usulan', emoji: '❓', kind: 'text', topic: 'Tanya panitia di sini' },
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
      ],
    },
    {
      name: 'Voice Channels',
      emoji: '🔊',
      channels: [{ id: 'panggung-kdi', name: 'Panggung KDI', kind: 'stage' }],
    },
  ],
  users: {
    budi: { id: 'budi', name: 'Budi | KPPN Makassar I', color: '#2f8cff', online: true },
    raka: { id: 'raka', name: 'Raka | KPPN Ambon', color: '#e8590c' },
    sari: { id: 'sari', name: 'Sari | PIC', color: '#1abc9c', role: 'PIC TEC 2026', roleColor: '#1abc9c', online: true },
    admin: { id: 'admin', name: 'Admin TEC', color: '#9b5de5', role: 'Admin', roleColor: '#f0b232', online: true },
    dewi: { id: 'dewi', name: 'Dewi | Kanwil DJPb Sulsel', color: '#3ddc97', online: true },
  },
  tags: {
    MLBB: { emoji: '🎮', tone: 'neutral' },
    'Dota 2': { emoji: '🎮', tone: 'neutral' },
    Catur: { emoji: '♟️', tone: 'neutral' },
    MCGG: { emoji: '🎮', tone: 'neutral' },
    Terjadwal: { emoji: '🔵', tone: 'blue' },
    'Menunggu Laporan': { emoji: '🟡', tone: 'yellow' },
    Selesai: { emoji: '🟢', tone: 'green' },
    Sengketa: { emoji: '🔴', tone: 'red' },
    WO: { emoji: '⚪', tone: 'grey' },
  },
  channels: {
    pengumuman: [
      {
        id: 'ann-1',
        author: 'admin',
        time: 'Hari ini 08.00',
        text: '**Ronde 1 TEC 2026 dimulai!** 🎉\nThread laga setiap tim sudah dibuat di <#tec-2026>. Cek thread kalian, sepakati jam main, dan jangan lupa lapor hasil sebelum batas waktu.',
      },
      {
        id: 'ann-2',
        author: 'admin',
        time: 'Hari ini 08.05',
        text: '📅 **Jadwal Ronde 1**\nJendela main: [ts:Sabtu, 14 November 2026] s/d [ts:Minggu, 15 November 2026]\nJam main tiap laga disepakati di thread laga masing-masing di <#tec-2026>.',
      },
    ],
    rules: [
      {
        id: 'rule-1',
        author: 'admin',
        time: '01/10/2026',
        text: '**📝 Peraturan Server**\n1. Saling menghormati. Tidak ada SARA, hinaan, atau spam.\n2. Disarankan memakai nama panggilan sesuai nama asli/instansi, contoh `Budi | KPPN Makassar I`.\n3. Urusan laga dibahas di thread laga masing-masing di <#tec-2026>.\n4. Pertanyaan ke panitia lewat <#support-dan-usulan>.\n5. Keputusan PIC dan panitia bersifat final.',
      },
    ],
    'support-dan-usulan': [
      {
        id: 'sup-1',
        author: 'dewi',
        time: 'Kemarin 14.02',
        text: 'Halo panitia, untuk catur apakah boleh main di aplikasi lichess HP? 🙏',
      },
      { id: 'sup-2', author: 'admin', time: 'Kemarin 14.10', text: 'Boleh, <@dewi>. Pastikan akunnya sesuai yang didaftarkan ya.' },
    ],
  },
  forumPosts: [
    otherPost('f-2', '[MLBB] R1 · Garuda Perben vs Rajawali Papua', ['MLBB', 'Selesai'], 6),
    otherPost('f-3', '[Dota 2] R1 · Ancient Defenders vs KPPN Five', ['Dota 2', 'Terjadwal'], 3),
    otherPost('f-4', '[Catur] R1 · Dewi vs Andi', ['Catur', 'Menunggu Laporan'], 4),
    otherPost('f-5', '[MCGG] R1 · Hendra vs Yusuf', ['MCGG', 'Terjadwal'], 1),
    otherPost('f-6', '[MLBB] R1 · Anoa Squad vs Cendrawasih', ['MLBB', 'Terjadwal'], 2),
  ],
};
