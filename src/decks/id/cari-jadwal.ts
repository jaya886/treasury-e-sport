import type { Deck } from '../../lib/deck-types';
import { atHome, inThread, post } from './fixtures';

const fresh = () => post({ replies: [], tags: ['MLBB', 'SCHEDULED'] });

export const cariJadwal: Deck = {
  slug: 'cari-jadwal',
  slides: [
    {
      id: 'dua-tempat',
      title: 'Jadwal ada di dua tempat',
      body: '**Jadwal ronde** diumumkan panitia di `#📣pengumuman`. **Detail laga kamu** (lawan, jendela main, batas lapor) ada di **thread laga** di `#🏅tec-2026`.',
      bullets: ['`#📣pengumuman`: jadwal umum setiap ronde.', '`#🏅tec-2026`: satu thread untuk setiap laga.'],
      visual: {
        kind: 'sim',
        scene: {
          setup: atHome(fresh()),
          steps: [
            { wait: 400 },
            { say: 'Jadwal ronde diumumkan di #pengumuman.' },
            { tap: 'ch:pengumuman', try: true, hint: 'Ketuk #pengumuman' },
            { view: 'channel', channel: 'pengumuman' },
            { highlight: 'msg:ann-2', ms: 2600 },
            { say: 'Detail laga kamu ada di thread di #tec-2026.' },
            { tap: 'back', only: 'mobile' },
            { view: 'home', only: 'mobile' },
            { highlight: 'ch:tec-2026', ms: 2200 },
            { say: '' },
            { wait: 400 },
          ],
        },
      },
    },
    {
      id: 'notifikasi',
      title: 'PIC akan memanggilmu',
      body: 'Saat laga dibuat, PIC **menyebut namamu** (mention) di thread laga. Kamu otomatis bergabung ke thread itu, dan thread-nya muncul **di bawah** `#🏅tec-2026`.',
      tips: [{ label: 'Tanda merah', text: 'Angka merah di samping thread artinya ada yang menyebut namamu di sana.' }],
      visual: {
        kind: 'sim',
        scene: {
          setup: atHome(fresh(), { posts: [{ ...fresh(), mention: true }] }),
          steps: [
            { wait: 400 },
            { notify: { title: 'Sari | PIC menyebutmu', body: '[MLBB] R1 · Elang Sulsel vs Laskar Maluku' } },
            { say: 'Notifikasi: PIC menyebut namamu.' },
            { highlight: 'thread:r1', ms: 1800 },
            { say: 'Thread laga kamu ada di bawah #tec-2026.' },
            { tap: 'thread:r1', try: true, hint: 'Ketuk thread laga kamu' },
            { view: 'thread' },
            { say: 'Ini thread laga kamu.' },
            { wait: 1800 },
          ],
        },
      },
    },
    {
      id: 'cari',
      title: 'Tidak ada di sidebar? Cari di forum',
      body: 'Buka `#🏅tec-2026`, pilih **label game**, lalu ketik **nama timmu** di kolom pencarian.',
      visual: {
        kind: 'sim',
        scene: {
          setup: atHome(fresh(), { posts: [{ ...fresh(), joined: false }] }),
          steps: [
            { wait: 400 },
            { say: 'Buka #tec-2026.' },
            { tap: 'ch:tec-2026', try: true, hint: 'Ketuk #tec-2026' },
            { view: 'forum' },
            { say: 'Pilih label game kamu.' },
            { tap: 'filter:MLBB', try: true, hint: 'Pilih label MLBB' },
            { filter: 'MLBB' },
            { say: 'Ketik nama timmu.' },
            { tap: 'search' },
            { type: 'Elang', into: 'search' },
            { say: 'Ketemu! Buka laganya.' },
            { tap: 'post:r1', try: true, hint: 'Buka laga kamu' },
            { view: 'thread' },
            { wait: 1600 },
          ],
        },
      },
    },
    {
      id: 'baca',
      title: 'Baca pesan pembuka',
      body: 'Pesan pembuka dari PIC berisi semua yang kamu perlukan.',
      bullets: ['**Peserta**: kamu dan lawanmu.', '**Jendela main**: rentang waktu untuk bertanding.', '**Format**: misalnya Bo3.', '**Batas lapor**: kapan hasil harus dilaporkan.'],
      visual: {
        kind: 'sim',
        scene: {
          setup: inThread(fresh()),
          steps: [
            { wait: 400 },
            { say: 'Pesan pembuka dari PIC.' },
            { highlight: 'starter', ms: 2600 },
            { say: 'Jendela main: kalian bebas memilih jam di rentang ini.' },
            { wait: 2400 },
            { say: 'Batas lapor ditulis sebagai hitung mundur.' },
            { wait: 2200 },
          ],
        },
      },
    },
    {
      id: 'zona',
      title: 'Jamnya sudah sesuai zonamu',
      body: 'Jam di pesan PIC adalah **stempel waktu Discord**. Jam ini otomatis tampil sesuai zona waktu di perangkatmu.',
      bullets: ['Peserta di Makassar melihat jam WITA, di Jakarta WIB, di Jayapura WIT.', 'Pastikan jam HP atau laptopmu **diatur otomatis**.'],
      tips: [{ label: 'Menulis jam sendiri?', text: 'Kalau kamu mengetik jam di pesan biasa, **selalu sebut zonanya**, misalnya `19.30 WITA`.' }],
      visual: {
        kind: 'zones',
        label: 'Jendela main',
        chip: 'Sabtu, 14 November 2026',
        zones: [
          { zone: 'WIB', time: '18.00' },
          { zone: 'WITA', time: '19.00' },
          { zone: 'WIT', time: '20.00' },
        ],
        note: 'Satu jadwal, tampil sesuai jam di perangkat masing-masing.',
      },
      duration: 10000,
    },
    {
      id: 'ikuti',
      title: 'Ikuti thread laga',
      body: 'Tekan **Ikuti** di thread laga supaya setiap balasan baru masuk sebagai notifikasi.',
      tips: [{ label: 'Notifikasi HP', text: 'Pastikan notifikasi Discord diizinkan di pengaturan HP.' }],
      visual: {
        kind: 'sim',
        scene: {
          setup: inThread(fresh()),
          steps: [
            { wait: 400 },
            { say: 'Tekan Ikuti di bagian atas thread.' },
            { tap: 'follow', try: true, hint: 'Tekan Ikuti' },
            { follow: true },
            { say: 'Sekarang setiap balasan baru akan memberi notifikasi.' },
            { online: 'raka' },
            { typing: 'raka', ms: 1400 },
            { msg: { id: 'n-1', author: 'raka', time: 'Hari ini 09.12', text: 'Halo Elang Sulsel! 👋' } },
            { wait: 1800 },
          ],
        },
      },
    },
    {
      id: 'rangkuman',
      title: 'Jadwal ketemu!',
      body: 'Kamu tahu cara menemukan laga dan membaca jadwalnya.',
      bullets: [
        'Jadwal ronde diumumkan di `#📣pengumuman`.',
        'Thread laga muncul di bawah `#🏅tec-2026`.',
        'Kalau tidak muncul, cari di forum dengan label game dan nama tim.',
        'Jam di pesan PIC sudah sesuai zona waktumu.',
        'Tekan **Ikuti** agar dapat notifikasi.',
      ],
      visual: { kind: 'recap' },
      duration: 10000,
    },
  ],
};
