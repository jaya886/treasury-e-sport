import type { Deck } from '../../lib/deck-types';
import { atHome, post } from './fixtures';

export const turServer: Deck = {
  slug: 'tur-server',
  slides: [
    {
      id: 'peta',
      title: 'Empat channel penting',
      body: 'Server TEC punya banyak channel, tetapi untuk kompetisi kamu cukup mengenal **empat channel** di kategori **Informasi**.',
      visual: {
        kind: 'sim',
        scene: {
          setup: atHome(post()),
          steps: [
            { wait: 500 },
            { say: '#rules: peraturan server. Baca sekali di awal.' },
            { highlight: 'ch:rules', ms: 2400 },
            { say: '#pengumuman: info resmi panitia. Hanya panitia yang bisa menulis.' },
            { highlight: 'ch:pengumuman', ms: 2600 },
            { say: '#tec-competition: rumah semua thread laga.' },
            { highlight: 'ch:tec-competition', ms: 2600 },
            { say: '#support-dan-usulan: tempat bertanya ke panitia.' },
            { highlight: 'ch:support-dan-usulan', ms: 2600 },
            { say: 'Kategori lain untuk ngobrol santai per game.' },
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
          { icon: '🔒', title: 'Terkunci', text: 'Hanya untuk peran tertentu. Abaikan saja.' },
        ],
      },
      duration: 9000,
    },
    {
      id: 'pengumuman',
      title: 'Cek #pengumuman secara rutin',
      body: 'Jadwal ronde, perubahan aturan, dan info penting diumumkan di `#📣pengumuman`.',
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
      title: '#tec-competition: rumah semua laga',
      body: 'Channel ini berbentuk **forum**. Setiap kartu adalah satu laga, lengkap dengan label game dan status.',
      bullets: ['🔵 Terjadwal', '🟡 Menunggu Laporan', '🟢 Selesai', '🔴 Sengketa', '⚪ WO'],
      visual: {
        kind: 'sim',
        scene: {
          setup: atHome(post()),
          steps: [
            { wait: 500 },
            { say: 'Buka #tec-competition.' },
            { tap: 'ch:tec-competition', try: true, hint: 'Ketuk #tec-competition' },
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
        '`#📣pengumuman`: info resmi.',
        '`#🏅tec-competition`: thread laga.',
        '`#❓support-dan-usulan`: tanya panitia.',
      ],
      visual: { kind: 'recap' },
      duration: 10000,
    },
  ],
};
