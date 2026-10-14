import type { Deck } from '../../lib/deck-types';
import { atHome, post } from './fixtures';

const before = { meName: 'budi.makassar' };

export const masukServer: Deck = {
  slug: 'masuk-server',
  slides: [
    {
      id: 'undangan',
      title: 'Dapatkan tautan undangan',
      body: 'Tautan undangan server Discord didapat saat kamu mengisi **formulir pendaftaran peserta** (Microsoft Forms) dari panitia. Setelah menekan **Kirim**, halaman konfirmasi menampilkan **tautan undangan Discord**.',
      bullets: [
        'Buat akun Discord **sebelum** membuka tautannya (lihat Misi 00).',
        'Tekan tautan undangan di halaman konfirmasi.',
        '**Salin dan simpan** tautannya, supaya bisa dibuka lagi dari HP atau laptop lain.',
      ],
      tips: [
        {
          label: 'Halaman konfirmasi sudah tertutup?',
          text: 'Tanyakan tautan undangan ke panitia TEC. Tautannya sama untuk semua peserta.',
        },
      ],
      visual: {
        kind: 'formdone',
        app: '📋 Microsoft Forms',
        form: 'Formulir Pendaftaran Peserta TEC 2026',
        message: 'Terima kasih sudah mendaftar! Langkah berikutnya: bergabung ke server Discord **Treasury E-Sport Community** lewat tautan berikut.',
        link: 'discord.gg/AbC123xy',
        linkLabel: 'Contoh tautan. Gunakan tautan yang muncul di formulirmu.',
      },
      duration: 10000,
    },
    {
      id: 'terima',
      title: 'Terima undangan',
      body: 'Saat tautan dibuka, Discord menampilkan nama server. Pastikan namanya **Treasury E-Sport Community**, lalu tekan **Terima Undangan**.',
      tips: [{ label: 'Belum masuk akun?', text: 'Discord akan meminta kamu masuk atau mendaftar dulu. Lihat Misi 00.' }],
      visual: {
        kind: 'sim',
        scene: {
          setup: atHome(post(), { ...before, view: 'invite', joined: false }),
          steps: [
            { wait: 600 },
            { say: 'Cek nama server-nya dulu.' },
            { wait: 1600 },
            { say: 'Lalu tekan Terima Undangan.' },
            { tap: 'accept', try: true, hint: 'Tekan Terima Undangan' },
            { view: 'home' },
            { say: 'Berhasil! Server TEC muncul di daftar server.' },
            { highlight: 'rail:tec', ms: 1800 },
            { say: '' },
            { wait: 600 },
          ],
        },
      },
    },
    {
      id: 'peraturan',
      title: 'Baca peraturan',
      body: 'Mulailah dari `#📝rules`. Isinya singkat dan berlaku untuk semua anggota.',
      tips: [
        {
          label: 'Muncul layar peraturan?',
          text: 'Beberapa server meminta kamu menyetujui peraturan sebelum bisa mengobrol. Baca, lalu centang dan tekan **Kirim**.',
        },
      ],
      visual: {
        kind: 'sim',
        scene: {
          setup: atHome(post(), before),
          steps: [
            { wait: 500 },
            { say: 'Buka channel #rules.' },
            { tap: 'ch:rules', try: true, hint: 'Ketuk #rules' },
            { view: 'channel', channel: 'rules' },
            { say: 'Baca sampai selesai.' },
            { highlight: 'msg:rule-1', ms: 3500 },
            { say: 'Perhatikan poin 2: format nama panggilan.' },
            { wait: 2000 },
          ],
        },
      },
    },
    {
      id: 'nama',
      title: 'Atur nama panggilan',
      body: 'Supaya lawan dan PIC tahu siapa kamu, ganti **nama panggilan server** dengan format `Nama | Satker`.',
      bullets: ['Ketuk **nama server** di bagian atas.', 'Pilih **Edit Profil Server**.', 'Isi nama panggilan lalu **Simpan**.'],
      tips: [{ label: 'Hanya di server ini', text: 'Nama panggilan server tidak mengubah nama akunmu di server lain.' }],
      visual: {
        kind: 'sim',
        scene: {
          setup: atHome(post(), before),
          steps: [
            { wait: 500 },
            { say: 'Ketuk nama server di bagian atas.' },
            { tap: 'server-menu', try: true, hint: 'Ketuk nama server' },
            { menu: 'server' },
            { say: 'Pilih Edit Profil Server.' },
            { tap: 'edit-profile', try: true, hint: 'Pilih Edit Profil Server' },
            { view: 'nickname' },
            { say: 'Tulis nama dengan format Nama | Satker.' },
            { tap: 'nick' },
            { type: 'Budi | KPPN Makassar I', into: 'nick' },
            { say: 'Simpan perubahan.' },
            { tap: 'save', try: true, hint: 'Tekan Simpan' },
            { view: 'home' },
            { say: 'Selesai! Namamu kini tampil dengan satker.' },
            { highlight: 'me', ms: 1800, only: 'desktop' },
            { highlight: 'tab:kamu', ms: 1800, only: 'mobile' },
            { wait: 600 },
          ],
        },
      },
    },
    {
      id: 'format-nama',
      title: 'Contoh nama yang benar',
      body: 'Formatnya: **nama panggilan**, garis tegak `|`, lalu **satker**. Maksimal 32 karakter.',
      visual: {
        kind: 'cards',
        cards: [
          { icon: '✅', title: '`Budi | KPPN Makassar I`', text: 'Nama dan satker jelas.' },
          { icon: '✅', title: '`Dewi | Kanwil DJPb Sulsel`', text: 'Singkatan resmi satker boleh dipakai.' },
          { icon: '❌', title: '`xX_ProGamer_Xx`', text: 'PIC dan lawan tidak tahu ini siapa.' },
          { icon: '❌', title: '`Budi`', text: 'Satkernya tidak terlihat.' },
        ],
      },
      duration: 9000,
    },
    {
      id: 'rangkuman',
      title: 'Selamat datang di server!',
      body: 'Kamu resmi jadi warga Treasury E-Sport Community.',
      bullets: ['Bergabung lewat tautan dari formulir pendaftaran.', 'Peraturan sudah dibaca.', 'Nama panggilan memakai format `Nama | Satker`.'],
      visual: { kind: 'recap' },
      duration: 10000,
    },
  ],
};
