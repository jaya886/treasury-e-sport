import type { Deck } from '../../lib/deck-types';
import { atHome, post } from './fixtures';

export const kenalanDiscord: Deck = {
  slug: 'kenalan-discord',
  slides: [
    {
      id: 'apa-itu',
      title: 'Apa itu Discord?',
      body: 'Discord adalah aplikasi obrolan **gratis**, mirip grup WhatsApp tetapi lebih rapi. Satu **server** berisi banyak **channel** sesuai topik, dan obrolan khusus bisa dibuat sebagai **thread**.',
      bullets: [
        '**Server**: rumah komunitas, yaitu Treasury E-Sport Community.',
        '**Channel**: ruang per topik, misalnya `#📣pengumuman`.',
        '**Thread**: obrolan khusus, misalnya satu thread untuk satu laga.',
      ],
      visual: {
        kind: 'concept',
        levels: [
          { icon: '🏠', label: 'Server', name: 'Treasury E-Sport Community' },
          { icon: '📁', label: 'Kategori', name: 'Informasi' },
          { icon: '💬', label: 'Channel', name: '#🏅tec-2026' },
          { icon: '🧵', label: 'Thread', name: '[MLBB] R1 · Elang Sulsel vs Laskar Maluku' },
        ],
      },
      duration: 10000,
    },
    {
      id: 'pasang',
      title: 'Pakai di HP atau laptop',
      body: 'Discord bisa dipakai di HP maupun laptop dengan **akun yang sama**. Pilih yang paling nyaman. Kamu bisa memakai keduanya sekaligus.',
      tips: [
        {
          label: 'Laptop kantor tidak bisa instal aplikasi?',
          text: 'Pakai versi browser: buka `discord.com/app` di Chrome atau Edge. Tidak perlu instal apa pun.',
        },
      ],
      visual: {
        kind: 'cards',
        cards: [
          { icon: '🤖', title: 'Android', text: 'Cari **Discord** di Google Play, lalu instal.' },
          { icon: '🍎', title: 'iPhone', text: 'Cari **Discord** di App Store, lalu instal.' },
          { icon: '💻', title: 'Laptop', text: 'Unduh dari `discord.com/download`.' },
          { icon: '🌐', title: 'Browser', text: 'Tanpa instal: `discord.com/app`.' },
        ],
      },
      duration: 9000,
    },
    {
      id: 'daftar',
      title: 'Buat akun',
      body: 'Buka Discord, pilih **Daftar**, lalu isi formulirnya.',
      bullets: [
        'Pakai **email aktif** yang bisa kamu buka sekarang.',
        '**Nama tampilan** boleh nama panggilanmu.',
        '**Nama pengguna** harus unik, huruf kecil tanpa spasi.',
        'Simpan kata sandimu baik-baik.',
      ],
      visual: {
        kind: 'form',
        title: 'Buat akun',
        fields: [
          { label: 'Email', value: 'budi.santoso@email.com' },
          { label: 'Nama tampilan', value: 'Budi' },
          { label: 'Nama pengguna', value: 'budi.makassar' },
          { label: 'Kata sandi', value: '••••••••••' },
          { label: 'Tanggal lahir', value: '12 / 05 / 1990' },
        ],
        button: 'Lanjutkan',
      },
      duration: 9000,
    },
    {
      id: 'verifikasi',
      title: 'Verifikasi email',
      body: 'Discord mengirim email verifikasi. Buka email itu lalu tekan **Verifikasi Email**. Tanpa langkah ini, kamu belum bisa bergabung ke server.',
      tips: [
        { label: 'Email tidak masuk?', text: 'Cek folder **Spam** atau **Promosi**. Masih tidak ada? Kirim ulang dari pengaturan akun Discord.' },
        { label: 'Diminta nomor HP?', text: 'Beberapa server meminta verifikasi nomor HP. Ikuti langkahnya; kode dikirim lewat SMS.' },
      ],
      visual: {
        kind: 'note',
        app: '✉ Kotak masuk',
        from: 'Discord',
        title: 'Verifikasi alamat email Discord kamu',
        body: 'Hai **Budi**, terima kasih sudah mendaftar! Tekan tombol di bawah untuk memverifikasi alamat email kamu.',
        button: 'Verifikasi Email',
      },
      duration: 8000,
    },
    {
      id: 'tampilan',
      title: 'Kenali tampilan Discord',
      body: 'Begini tampilan Discord setelah kamu bergabung ke server. Tiga bagian penting: **daftar server**, **daftar channel**, dan **ruang obrolan**.',
      bullets: [
        'Ikon server ada di kolom paling kiri.',
        'Channel dikelompokkan dalam **kategori**.',
        'Channel yang punya pesan baru tampil **lebih terang**.',
      ],
      visual: {
        kind: 'sim',
        scene: {
          setup: atHome(post()),
          steps: [
            { wait: 500 },
            { say: 'Kolom kiri: daftar server yang kamu ikuti.' },
            { highlight: 'rail:tec', ms: 1800 },
            { say: 'Daftar channel, dikelompokkan per kategori.' },
            { highlight: 'cat:Informasi', ms: 2000 },
            { say: 'Channel yang lebih terang berarti ada pesan baru.' },
            { highlight: 'cat:yang kita mainkan', ms: 2200 },
            { say: 'Ruang obrolan ada di tengah.', only: 'desktop' },
            { highlight: 'msg:ann-1', ms: 2000, only: 'desktop' },
            { say: 'Menu bawah: pindah ke pesan, notifikasi, dan profil.', only: 'mobile' },
            { highlight: 'tab:notif', ms: 2000, only: 'mobile' },
            { say: 'Ketuk channel untuk membukanya.' },
            { tap: 'ch:pengumuman', try: true, hint: 'Ketuk #pengumuman' },
            { view: 'channel', channel: 'pengumuman' },
            { say: 'Ini #pengumuman: info resmi dari panitia.' },
            { wait: 2200 },
          ],
        },
      },
    },
    {
      id: 'rangkuman',
      title: 'Siap ke misi berikutnya!',
      body: 'Kamu sudah mengenal Discord. Selanjutnya: masuk ke server TEC.',
      bullets: ['Discord terpasang atau terbuka di browser.', 'Akun dibuat dan email terverifikasi.', 'Kamu paham server, channel, dan thread.'],
      visual: { kind: 'recap' },
      duration: 10000,
    },
  ],
};
