import type { Deck } from '../../lib/deck-types';
import { atHome, post } from './fixtures';

export const turServer: Deck = {
  slug: 'tur-server',
  slides: [
    {
      id: 'peta',
      title: 'Empat channel penting',
      body: 'Server TEC punya banyak channel, tetapi untuk kompetisi kamu cukup mengenal **empat channel** di kategori **Informasi**.',
      tips: [
        {
          label: 'Melihat #pic-tec di tangkapan layar panitia?',
          text: 'Itu ruang kerja khusus panitia dan PIC, jadi tidak muncul di daftar channel peserta.',
        },
      ],
      visual: {
        kind: 'sim',
        scene: {
          setup: atHome(post()),
          steps: [
            { wait: 500 },
            { say: '#rules: peraturan server. Baca sekali di awal.' },
            { highlight: 'ch:rules', ms: 2400 },
            { say: '#pengumuman: semua pengumuman kompetisi. Hanya panitia yang menulis.' },
            { highlight: 'ch:pengumuman', ms: 2600 },
            { say: '#tec-2026: thread setiap laga & tempat lapor hasil.' },
            { highlight: 'ch:tec-2026', ms: 2600 },
            { say: '#support-dan-usulan: tempat bertanya ke panitia.' },
            { highlight: 'ch:support-dan-usulan', ms: 2600 },
            { say: 'Kategori lain untuk ngobrol santai per game dan voice.' },
            { highlight: 'cat:yang kita mainkan', ms: 2400 },
            { say: '' },
          ],
        },
      },
    },
    {
      id: 'ikon',
      title: 'Arti ikon channel',
      body: 'Ikon di depan nama channel menunjukkan jenisnya.',
      visual: {
        kind: 'cards',
        cards: [
          { icon: '＃', title: 'Channel teks', text: 'Semua anggota bisa mengobrol, contoh `#general`.' },
          { icon: '📣', title: 'Pengumuman', text: 'Hanya panitia yang menulis. Kamu cukup membaca.' },
          { icon: '💬', title: 'Forum', text: 'Berisi kumpulan postingan. Di TEC: **satu postingan = satu laga**.' },
          { icon: '🎙️', title: 'Panggung / voice', text: 'Untuk ngobrol pakai suara atau acara langsung, misalnya `Panggung KDI`.' },
        ],
      },
      duration: 9000,
    },
    {
      id: 'pengumuman',
      title: 'Cek #pengumuman secara rutin',
      body: '**Semua pengumuman kompetisi** ada di `#📣pengumuman`: jadwal ronde, format, perubahan aturan, dan info hadiah.',
      tips: [
        {
          label: 'Biar tidak ketinggalan',
          text: 'Buka `#📣pengumuman`, ketuk ikon 🔔 lalu pilih **Semua Pesan** supaya setiap pengumuman masuk sebagai notifikasi.',
        },
      ],
      visual: {
        kind: 'sim',
        scene: {
          setup: atHome(post()),
          steps: [
            { wait: 500 },
            { say: 'Buka #pengumuman.' },
            { tap: 'ch:pengumuman', try: true, hint: 'Ketuk #pengumuman' },
            { view: 'channel', channel: 'pengumuman' },
            { say: 'Pengumuman Ronde 1 dari panitia.' },
            { highlight: 'msg:ann-1', ms: 2600 },
            { say: 'Kolom pesan terkunci: channel ini hanya untuk dibaca.' },
            { wait: 2400 },
          ],
        },
      },
    },
    {
      id: 'forum',
      title: '#tec-2026: tempat laga & lapor hasil',
      body: 'Channel ini berbentuk **forum**. Setiap kartu adalah satu laga, lengkap dengan label game dan status. Di thread laga itulah kamu **mengatur jadwal dan melapor hasil**.',
      bullets: ['🔵 Terjadwal', '🟡 Menunggu Laporan', '🟢 Selesai', '🔴 Sengketa', '⚪ WO'],
      visual: {
        kind: 'sim',
        scene: {
          setup: atHome(post()),
          steps: [
            { wait: 500 },
            { say: 'Buka #tec-2026.' },
            { tap: 'ch:tec-2026', try: true, hint: 'Ketuk #tec-2026' },
            { view: 'forum' },
            { say: 'Setiap kartu adalah satu laga.' },
            { highlight: 'post:r1', ms: 2200 },
            { say: 'Label menunjukkan game dan status laga.' },
            { highlight: 'post:f-2', ms: 2200 },
            { say: 'Cara mencari laga kamu ada di Misi 03.' },
            { wait: 1800 },
          ],
        },
      },
    },
    {
      id: 'rangkuman',
      title: 'Tur selesai!',
      body: 'Kamu sudah tahu letak semua hal penting di server.',
      bullets: [
        '`#📝rules`: peraturan.',
        '`#📣pengumuman`: semua pengumuman kompetisi.',
        '`#🏅tec-2026`: thread laga & lapor hasil.',
        '`#❓support-dan-usulan`: tanya panitia.',
      ],
      visual: { kind: 'recap' },
      duration: 10000,
    },
  ],
};
