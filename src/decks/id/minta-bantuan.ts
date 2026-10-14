import type { Deck } from '../../lib/deck-types';
import { atHome, post } from './fixtures';

const QUESTION = `**Nama:** Budi | KPPN Makassar I
**Tim / Game:** Elang Sulsel · MLBB
**Masalah:** Thread laga Ronde 2 kami belum muncul.`;

export const mintaBantuan: Deck = {
  slug: 'minta-bantuan',
  slides: [
    {
      id: 'kemana',
      title: 'Tanya ke mana?',
      body: 'Pilih tempat bertanya sesuai masalahnya.',
      visual: {
        kind: 'cards',
        cards: [
          { icon: '🧵', title: 'Urusan satu laga', text: 'Jadwal, lawan tidak merespons, sengketa: tulis **di thread laga** dan sebut PIC.' },
          { icon: '❓', title: 'Pertanyaan umum', text: 'Aturan, akun, thread belum muncul: tanya di `#support-dan-usulan`.' },
          { icon: '📣', title: 'Cek dulu', text: 'Mungkin jawabannya sudah ada di `#pengumuman`.' },
          { icon: '🚪', title: 'Belum bisa masuk server?', text: 'Hubungi panitia TEC lewat kontak pendaftaran untuk meminta tautan undangan.' },
        ],
      },
      duration: 10000,
    },
    {
      id: 'tanya',
      title: 'Bertanya di #support-dan-usulan',
      body: 'Tulis pertanyaanmu dalam **satu pesan lengkap**: siapa kamu, tim dan game apa, serta masalahnya.',
      tips: [{ label: 'Lampirkan screenshot', text: 'Kalau masalahnya terlihat di layar, lampirkan screenshot-nya agar panitia cepat paham.' }],
      visual: {
        kind: 'sim',
        scene: {
          setup: atHome(post()),
          steps: [
            { wait: 400 },
            { say: 'Buka #support-dan-usulan.' },
            { tap: 'ch:support-dan-usulan', try: true, hint: 'Ketuk #support-dan-usulan' },
            { view: 'channel', channel: 'support-dan-usulan' },
            { say: 'Tulis pertanyaan dengan format.' },
            { tap: 'composer' },
            { type: QUESTION },
            { send: true, try: true, hint: 'Kirim pertanyaan' },
            { say: 'Panitia akan menjawab di channel ini.' },
            { typing: 'admin', ms: 1800 },
            {
              msg: {
                id: 'h-1',
                author: 'admin',
                time: 'Hari ini 09.40',
                text: 'Halo <@budi>, thread Ronde 2 sudah dibuat. Silakan cek lagi di <#tec-competition> ya 🙏',
              },
            },
            { react: { msg: 'h-1', emoji: '🙏', by: 'budi' } },
            { wait: 1800 },
          ],
        },
      },
    },
    {
      id: 'tips',
      title: 'Tips agar cepat dibantu',
      body: 'Panitia melayani banyak peserta. Bantu mereka membantumu.',
      visual: {
        kind: 'cards',
        cards: [
          { icon: '📝', title: 'Satu pesan lengkap', text: 'Hindari pesan "halo" lalu menunggu. Langsung tulis masalahnya.' },
          { icon: '📸', title: 'Sertakan bukti', text: 'Screenshot pesan error atau tampilan yang membingungkan.' },
          { icon: '🙅', title: 'Jangan DM satu per satu', text: 'Pertanyaan di channel bisa dijawab panitia mana pun dan membantu peserta lain.' },
          { icon: '🙏', title: 'Tetap sopan', text: 'Ucapkan terima kasih atau beri reaksi saat sudah terbantu.' },
        ],
      },
      duration: 10000,
    },
    {
      id: 'rangkuman',
      title: 'Bantuan selalu ada',
      body: 'Kamu sudah menyelesaikan panduan ini. Sampai jumpa di arena! 🏆',
      bullets: ['Urusan laga: **thread laga** + sebut PIC.', 'Pertanyaan umum: `#support-dan-usulan`.', 'Tulis **satu pesan lengkap**.'],
      visual: { kind: 'recap', template: '**Nama:** \n**Tim / Game:** \n**Masalah:** ' },
      duration: 12000,
    },
  ],
};
