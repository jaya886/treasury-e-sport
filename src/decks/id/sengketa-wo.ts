import type { Deck } from '../../lib/deck-types';
import { CHATTED, inThread, myReport, post } from './fixtures';

const disputed = () =>
  post({
    tags: ['MLBB', 'Sengketa'],
    replies: [
      ...structuredClone(CHATTED),
      myReport,
      {
        id: 's-1',
        author: 'raka',
        time: 'Hari ini 20.17',
        text: '❌ Tidak setuju. Skor akhir 1 - 2 untuk kami, game ketiga dimenangkan Laskar Maluku.',
      },
      {
        id: 's-2',
        author: 'sari',
        time: 'Hari ini 20.22',
        text: 'Laga ini masuk **Sengketa**. <@budi> <@raka> mohon kirim bukti lengkap di thread ini.',
      },
    ],
  });

export const sengketaWo: Deck = {
  slug: 'sengketa-wo',
  slides: [
    {
      id: 'alur',
      title: 'Alur sengketa',
      body: 'Sengketa terjadi jika kedua pihak melaporkan hasil yang **berbeda**. Tenang, ada alurnya:',
      visual: {
        kind: 'flow',
        steps: [
          { icon: '❌', label: 'Lawan tidak setuju' },
          { icon: '🔴', label: 'PIC: status Sengketa' },
          { icon: '📎', label: 'Kedua pihak kirim bukti' },
          { icon: '⚖️', label: 'PIC memutuskan' },
          { icon: '🟢', label: 'Hasil final' },
        ],
      },
      duration: 9000,
    },
    {
      id: 'bukti',
      title: 'Kirim bukti di thread',
      body: 'Saat status **🔴 Sengketa**, kirim bukti selengkap mungkin **di thread laga**. PIC memutuskan berdasarkan bukti yang ada di thread.',
      visual: {
        kind: 'sim',
        scene: {
          setup: inThread(disputed()),
          steps: [
            { wait: 500 },
            { say: 'PIC meminta bukti. Lampirkan screenshot.' },
            { tap: 'plus', try: true, hint: 'Ketuk tombol +' },
            { picker: 'menu', only: 'desktop' },
            { tap: 'upload', only: 'desktop' },
            { picker: 'gallery' },
            { tap: 'pick:result', try: true, hint: 'Pilih screenshot' },
            { attach: 'result' },
            { tap: 'composer' },
            { type: 'Bukti kami: layar hasil game 3, Match ID 7491263508. Skor akhir 2 - 1.' },
            { send: true, try: true, hint: 'Kirim bukti' },
            { say: 'PIC memeriksa bukti dari kedua pihak.' },
            { typing: 'sari', ms: 2000 },
            {
              msg: {
                id: 's-3',
                author: 'sari',
                time: 'Hari ini 20.40',
                text: 'Keputusan PIC: sesuai Match ID, **Elang Sulsel menang 2 - 1**. Status diubah ke Selesai.',
              },
            },
            { tags: { post: 'r1', tags: ['MLBB', 'Selesai'] } },
            { say: 'Keputusan PIC bersifat final.' },
            { wait: 2000 },
          ],
        },
      },
    },
    {
      id: 'bukti-kuat',
      title: 'Bukti yang kuat',
      body: 'Semakin lengkap buktimu, semakin cepat PIC memutuskan.',
      visual: {
        kind: 'cards',
        cards: [
          { icon: '📸', title: 'Screenshot layar hasil', text: 'Skor, pemenang, dan Match ID terlihat jelas.' },
          { icon: '🔢', title: 'Match ID', text: 'PIC bisa mencocokkannya di riwayat game. Untuk catur: tautan partai lichess.' },
          { icon: '🎥', title: 'Rekaman layar', text: 'Opsional, tetapi sangat membantu.' },
          { icon: '🧵', title: 'Riwayat thread', text: 'Kesepakatan jam dan laporan yang tertulis di thread.' },
        ],
      },
      duration: 9000,
    },
    {
      id: 'wo',
      title: 'Apa itu WO?',
      body: '**WO** (walk out) berarti kalah tanpa bertanding. Konsekuensinya mengikuti format kompetisi dan akan diumumkan panitia.',
      visual: {
        kind: 'cards',
        cards: [
          { icon: '🚫', title: 'Tidak hadir', text: 'Satu tim tidak muncul pada jam yang sudah disepakati.' },
          { icon: '⏰', title: 'Tidak ada laporan', text: 'Lewat batas lapor dan hasil tidak bisa dicek PIC: **kedua pihak WO**.' },
          { icon: '⚪', title: 'Status WO', text: 'PIC memberi label ⚪ WO pada laga tersebut.' },
        ],
      },
      duration: 10000,
    },
    {
      id: 'sportif',
      title: 'Tetap sportif',
      body: 'Kompetisi ini untuk mempererat keluarga besar Perbendaharaan. 🤝',
      bullets: [
        'Bahas di thread, **bukan lewat DM**.',
        '**Jangan mengedit** screenshot.',
        'Gunakan bahasa yang sopan.',
        '**Hormati keputusan** PIC dan panitia.',
      ],
      visual: { kind: 'flow', steps: [{ icon: '🧵', label: 'Terbuka' }, { icon: '🧾', label: 'Jujur' }, { icon: '🙏', label: 'Sopan' }, { icon: '🤝', label: 'Sportif' }] },
      duration: 9000,
    },
    {
      id: 'rangkuman',
      title: 'Siap menghadapi sengketa',
      body: 'Semoga tidak perlu, tapi sekarang kamu tahu caranya.',
      bullets: ['Sengketa diselesaikan **di thread laga**.', 'Kirim **bukti lengkap**.', 'Lapor sebelum batas waktu agar tidak **WO**.', 'Keputusan PIC bersifat **final**.'],
      visual: { kind: 'recap' },
      duration: 10000,
    },
  ],
};
