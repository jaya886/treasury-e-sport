import type { Deck } from '../../lib/deck-types';
import { REPORT, inThread, post, withReport } from './fixtures';

// ---------------------------------------------------------------------------

export const laporHasil: Deck = {
  slug: 'lapor-hasil',
  slides: [
    {
      id: 'alur',
      title: 'Lapor Hasil Laga',
      body: 'Setelah laga selesai, **kedua pihak** bertanggung jawab melaporkan hasil di **thread laga** masing-masing, di dalam `#🏅tec-2026`. Begini alurnya:',
      bullets: [
        'Ambil screenshot hasil laga.',
        'Kirim laporan di thread laga.',
        'Lawan mengonfirmasi dengan ✅.',
        'PIC mencatat hasil dan mengubah status laga.',
      ],
      visual: {
        kind: 'flow',
        steps: [
          { icon: '🎮', label: 'Main' },
          { icon: '📸', label: 'Screenshot' },
          { icon: '💬', label: 'Lapor di thread' },
          { icon: '✅', label: 'Lawan konfirmasi' },
          { icon: '🏆', label: 'PIC catat' },
        ],
      },
      duration: 9000,
    },
    {
      id: 'screenshot',
      title: 'Ambil screenshot yang tepat',
      body: 'Begitu laga selesai, **jangan langsung keluar** dari layar hasil. Pastikan screenshot memperlihatkan:',
      bullets: ['① **Skor akhir**', '② **Pemenang** laga', '③ **Match ID**, jika game menampilkannya'],
      tips: [
        {
          label: 'Catur (lichess.org)',
          text: 'Salin **tautan partai** (contoh: `lichess.org/AbCd1234`) dan tempel sebagai Match ID. Sertakan juga screenshot papan akhir.',
        },
        { label: 'PUBG Mobile', text: 'Format laporan PUBGM akan diumumkan oleh PIC.' },
      ],
      visual: { kind: 'shot' },
      duration: 10000,
    },
    {
      id: 'buka-thread',
      title: 'Buka thread laga kamu',
      body: 'Thread laga muncul di daftar channel, **di bawah** `#🏅tec-2026`. Tanda merah berarti PIC menyebut namamu di thread itu.',
      tips: [{ label: 'Tidak muncul?', text: 'Buka `#🏅tec-2026` lalu cari nama timmu di kolom pencarian.' }],
      visual: {
        kind: 'sim',
        scene: {
          setup: { view: 'home', post: 'r1', posts: [post({ mention: true })] },
          steps: [
            { wait: 600 },
            { say: 'Thread laga ada di bawah #tec-2026.' },
            { highlight: 'ch:tec-2026', ms: 1300 },
            { say: 'Tanda merah: PIC menyebut namamu.' },
            { tap: 'thread:r1', try: true, hint: 'Ketuk thread laga kamu' },
            { view: 'thread' },
            { say: 'Di sini ada jadwal, format, dan batas lapor.' },
            { highlight: 'starter', ms: 2200 },
            { say: '' },
            { wait: 600 },
          ],
        },
      },
    },
    {
      id: 'lampirkan',
      title: 'Lampirkan screenshot',
      body: 'Di thread laga, ketuk tombol **+** di samping kolom pesan, lalu pilih screenshot hasil laga dari galeri atau folder.',
      visual: {
        kind: 'sim',
        scene: {
          setup: inThread(),
          steps: [
            { wait: 500 },
            { say: 'Ketuk tombol + untuk melampirkan.' },
            { tap: 'plus', try: true, hint: 'Ketuk tombol +' },
            { picker: 'menu', only: 'desktop' },
            { tap: 'upload', try: true, hint: 'Pilih "Unggah File"', only: 'desktop' },
            { picker: 'gallery' },
            { say: 'Pilih screenshot hasil laga.' },
            { tap: 'pick:result', try: true, hint: 'Pilih screenshot hasil' },
            { attach: 'result' },
            { say: 'Screenshot siap dikirim.' },
            { wait: 1600 },
          ],
        },
      },
    },
    {
      id: 'kirim',
      title: 'Tulis laporan, lalu kirim',
      body: 'Tulis laporan dengan **format** di bawah ini, lalu kirim. Screenshot dan teks terkirim dalam satu pesan.',
      tips: [{ label: 'Format', text: '`HASIL LAGA` · `Tim` · `Skor` · `Match ID`. Salin formatnya di langkah terakhir misi ini.' }],
      visual: {
        kind: 'sim',
        scene: {
          setup: inThread(post(), { attachment: 'result' }),
          steps: [
            { wait: 400 },
            { say: 'Tulis laporan sesuai format.' },
            { tap: 'composer' },
            { type: REPORT },
            { say: 'Ketuk tombol kirim.', only: 'mobile' },
            { say: 'Tekan Enter untuk mengirim.', only: 'desktop' },
            { send: true, try: true, hint: 'Kirim laporan' },
            { say: 'Laporan terkirim! 🎉' },
            { wait: 1800 },
          ],
        },
      },
    },
    {
      id: 'konfirmasi',
      title: 'Lawan mengonfirmasi',
      body: 'Lawan cukup memberi reaksi **✅** pada laporanmu, atau membalas "Setuju". Setelah itu **PIC** mencatat hasil dan mengubah label laga menjadi **🟢 FINISHED**.',
      tips: [
        {
          label: 'Cara lain yang juga sah',
          text: 'Kedua pihak sama-sama mengirim laporan lengkap dengan format yang sama.',
        },
      ],
      visual: {
        kind: 'sim',
        scene: {
          setup: inThread(withReport()),
          steps: [
            { wait: 500 },
            { say: 'Sekarang tunggu konfirmasi dari lawan.' },
            { wait: 900 },
            { online: 'raka' },
            { typing: 'raka', ms: 1500 },
            { react: { msg: 'rep-1', emoji: '✅', by: 'raka' } },
            { msg: { id: 'k-1', author: 'raka', time: 'Hari ini 20.16', text: '✅ Setuju. GG!' } },
            { say: 'Lawan setuju. PIC mencatat hasilnya.' },
            { typing: 'sari', ms: 1400 },
            {
              msg: {
                id: 'k-2',
                author: 'sari',
                time: 'Hari ini 20.20',
                text: 'Hasil dicatat: **Elang Sulsel 2 - 1 Laskar Maluku**. Label diubah ke FINISHED. Terima kasih! 🏆',
              },
            },
            { tags: { post: 'r1', tags: ['MLBB', 'FINISHED'] } },
            { say: 'Laga resmi tercatat. 🟢 FINISHED' },
            { wait: 2000 },
          ],
        },
      },
    },
    {
      id: 'sengketa',
      title: 'Kalau lawan tidak setuju',
      body: 'Jika ada perbedaan hasil, lawan membalas dengan ❌ dan buktinya. PIC mengubah label menjadi **🔴 DISPUTED** lalu memutuskan.',
      bullets: [
        'Bahas **di thread yang sama**, bukan lewat DM, supaya PIC bisa melihat semuanya.',
        'Kirim bukti selengkap mungkin: screenshot, Match ID, rekaman layar.',
        'Tetap sopan dan sportif. 🤝',
      ],
      visual: {
        kind: 'sim',
        scene: {
          setup: inThread(withReport()),
          steps: [
            { wait: 500 },
            { online: 'raka' },
            { typing: 'raka', ms: 1600 },
            {
              msg: {
                id: 's-1',
                author: 'raka',
                time: 'Hari ini 20.17',
                text: '❌ Tidak setuju. Skor akhir 1 - 2 untuk kami, game ketiga dimenangkan Laskar Maluku.',
              },
            },
            { say: 'Lawan tidak setuju → label menjadi DISPUTED.' },
            { typing: 'sari', ms: 1400 },
            {
              msg: {
                id: 's-2',
                author: 'sari',
                time: 'Hari ini 20.22',
                text: 'Hasil laga ini **disengketakan**. <@budi> <@raka> mohon kirim bukti lengkap di thread ini. PIC akan memutuskan.',
              },
            },
            { tags: { post: 'r1', tags: ['MLBB', 'DISPUTED'] } },
            { say: 'Selesaikan di thread ini, bukan lewat DM.' },
            { wait: 2200 },
          ],
        },
      },
    },
    {
      id: 'batas-waktu',
      title: 'Lapor sebelum batas waktu',
      body: 'Batas lapor ada di pesan pembuka thread. Jamnya **otomatis menyesuaikan zona waktu** di HP atau laptopmu, jadi tidak perlu menghitung selisih WIB, WITA, dan WIT.',
      bullets: [
        'Jika tidak ada yang melapor, PIC akan mencoba memeriksa hasilnya sendiri.',
        'Jika hasil tidak bisa diperiksa, **kedua pihak dianggap WO**.',
      ],
      visual: {
        kind: 'zones',
        label: 'Batas lapor',
        chip: 'dalam 2 jam',
        note: 'Satu batas waktu, tampil sesuai jam di perangkatmu.',
        zones: [
          { zone: 'WIB', time: '21.00' },
          { zone: 'WITA', time: '22.00' },
          { zone: 'WIT', time: '23.00' },
        ],
      },
      duration: 10000,
    },
    {
      id: 'rangkuman',
      title: 'Siap melapor!',
      body: 'Ringkasan misi ini. Salin format laporan supaya mudah dipakai setelah laga.',
      bullets: [
        'Screenshot memperlihatkan **skor, pemenang, dan Match ID**.',
        'Lapor di **thread laga**, bukan di DM atau channel lain.',
        'Pakai **format** laporan.',
        'Pastikan lawan memberi **✅**.',
        'Lapor **sebelum batas waktu**.',
      ],
      visual: {
        kind: 'recap',
        template: '**HASIL LAGA**\nTim: \nSkor: \nMatch ID: ',
      },
      duration: 12000,
    },
  ],
};
