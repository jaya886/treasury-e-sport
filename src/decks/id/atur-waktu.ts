import type { Deck } from '../../lib/deck-types';
import { inThread, post } from './fixtures';

const fresh = () => post({ replies: [], tags: ['MLBB', 'SCHEDULED'] });

const PROPOSAL = 'Halo Laskar Maluku! 👋 Kami usul main Sabtu 19.30 WITA (18.30 WIB / 20.30 WIT). Bisa?';

export const aturWaktu: Deck = {
  slug: 'atur-waktu',
  slides: [
    {
      id: 'aturan',
      title: 'Kalian yang menentukan jam',
      body: 'PIC memberi **jendela main**. Di dalam rentang itu, kedua tim **bebas menyepakati jam** sendiri.',
      visual: {
        kind: 'cards',
        cards: [
          { icon: '🗓️', title: 'Jendela dari PIC', text: 'Contoh: Sabtu 19.00–21.00. Laga harus selesai di rentang ini.' },
          { icon: '🤝', title: 'Sepakati bersama', text: 'Kapten kedua tim mengusulkan dan menyetujui jam.' },
          { icon: '🧵', title: 'Di thread laga', text: 'Bukan lewat DM, supaya PIC bisa melihat kesepakatannya.' },
          { icon: '🕐', title: 'Sebut zona waktu', text: 'Tulis `WIB`, `WITA`, atau `WIT` setiap menyebut jam.' },
        ],
      },
      duration: 10000,
    },
    {
      id: 'usul',
      title: 'Usulkan jam main',
      body: 'Sapa lawanmu di thread laga dan usulkan jam. Sebut juga jam di zona lawan agar tidak salah paham.',
      visual: {
        kind: 'sim',
        scene: {
          setup: inThread(fresh()),
          steps: [
            { wait: 400 },
            { say: 'Tulis usulan jam di thread laga.' },
            { tap: 'composer' },
            { type: PROPOSAL },
            { say: 'Kirim.' },
            { send: true, try: true, hint: 'Kirim usulan' },
            { say: 'Usulan terkirim. Tunggu jawaban lawan.' },
            { wait: 1800 },
          ],
        },
      },
    },
    {
      id: 'sepakat',
      title: 'Sepakat!',
      body: 'Begitu lawan setuju, tegaskan kesepakatannya. Pesan di thread menjadi **bukti** jika nanti ada masalah.',
      visual: {
        kind: 'sim',
        scene: {
          setup: inThread(post({ replies: [{ id: 'u-1', author: 'budi', time: 'Hari ini 09.20', text: PROPOSAL }], tags: ['MLBB', 'SCHEDULED'] })),
          steps: [
            { wait: 500 },
            { online: 'raka' },
            { typing: 'raka', ms: 1600 },
            { msg: { id: 'u-2', author: 'raka', time: 'Hari ini 09.31', text: 'Bisa! Sabtu 19.30 WITA ya. 👍' } },
            { say: 'Lawan setuju. Tegaskan kesepakatannya.' },
            { react: { msg: 'u-2', emoji: '👍', by: 'budi' } },
            { tap: 'composer' },
            { type: 'Sepakat ✅ Sabtu 19.30 WITA. Sampai ketemu di lobby!' },
            { send: true },
            { say: 'Jadwal disepakati dan tercatat di thread.' },
            { wait: 1800 },
          ],
        },
      },
    },
    {
      id: 'tidak-respons',
      title: 'Lawan belum merespons?',
      body: 'Tunggu wajar, lalu **sebut PIC** di thread laga dengan mengetik `@` dan nama PIC.',
      tips: [{ label: 'Kenapa di thread?', text: 'PIC bisa melihat riwayat usulanmu, jadi keputusan bisa cepat dan adil.' }],
      visual: {
        kind: 'sim',
        scene: {
          setup: inThread(post({ replies: [{ id: 'u-1', author: 'budi', time: 'Kemarin 09.20', text: PROPOSAL }], tags: ['MLBB', 'SCHEDULED'] })),
          steps: [
            { wait: 400 },
            { say: 'Belum ada jawaban sejak kemarin…' },
            { wait: 1400 },
            { say: 'Sebut PIC di thread laga.' },
            { tap: 'composer' },
            { type: '@Sari | PIC lawan belum merespons sejak kemarin, mohon bantuan 🙏' },
            { send: true, try: true, hint: 'Kirim pesan', as: '<@sari> lawan belum merespons sejak kemarin, mohon bantuan 🙏' },
            { typing: 'sari', ms: 1500 },
            { msg: { id: 'u-3', author: 'sari', time: 'Hari ini 10.05', text: 'Baik, saya hubungi kapten Laskar Maluku. <@raka> mohon segera respons ya.' } },
            { say: 'PIC membantu menghubungi lawan.' },
            { wait: 1800 },
          ],
        },
      },
    },
    {
      id: 'jadwal-ulang',
      title: 'Perlu jadwal ulang?',
      body: 'Aturan jadwal ulang akan diumumkan panitia di `#📣pengumuman`. Sementara itu, ikuti prinsip berikut:',
      bullets: ['Ajukan **sedini mungkin**.', 'Ajukan **di thread laga** dan sebut PIC.', 'Jadwal baru berlaku setelah **lawan dan PIC setuju**.'],
      visual: {
        kind: 'flow',
        steps: [
          { icon: '✋', label: 'Ajukan di thread' },
          { icon: '🤝', label: 'Lawan setuju' },
          { icon: '✅', label: 'PIC menyetujui' },
          { icon: '🗓️', label: 'Jadwal baru berlaku' },
        ],
      },
      duration: 9000,
    },
    {
      id: 'rangkuman',
      title: 'Jam main beres!',
      body: 'Kamu siap mengatur jadwal dengan lawan.',
      bullets: ['Pilih jam di dalam **jendela main**.', 'Sepakati **di thread laga**.', 'Selalu sebut **zona waktu**.', 'Lawan diam? **Sebut PIC**.'],
      visual: { kind: 'recap', template: 'Halo [nama tim lawan]! Kami usul main [hari] [jam] [WIB/WITA/WIT]. Bisa?' },
      duration: 12000,
    },
  ],
};
