// Short looping scene for the homepage hero.
import type { SimScene } from '../../lib/sim-types';
import { REPORT, atHome, post } from './fixtures';

export const heroDemo: SimScene = {
  setup: atHome(post({ mention: true })),
  steps: [
    { wait: 700 },
    { say: 'PIC menyebutmu di thread laga' },
    { highlight: 'thread:r1', ms: 1300 },
    { tap: 'thread:r1' },
    { view: 'thread' },
    { say: 'Lampirkan screenshot hasil' },
    { tap: 'plus' },
    { picker: 'gallery' },
    { tap: 'pick:result' },
    { attach: 'result' },
    { say: 'Tulis laporan, lalu kirim' },
    { tap: 'composer' },
    { type: REPORT },
    { send: true, id: 'rep-1' },
    { say: 'Lawan mengonfirmasi ✅' },
    { online: 'raka' },
    { typing: 'raka', ms: 1100 },
    { react: { msg: 'rep-1', emoji: '✅', by: 'raka' } },
    { tags: { post: 'r1', tags: ['MLBB', 'Selesai'] } },
    { say: 'Laga selesai · +100 XP 🏆' },
    { wait: 2600 },
  ],
};
