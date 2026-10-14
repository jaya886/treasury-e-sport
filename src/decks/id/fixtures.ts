// Shared scene fixtures for the Bahasa Indonesia decks (fictional teams and people).
import type { SimMessage, SimPost, SimSetup } from '../../lib/sim-types';

export const REPORT = `**HASIL LAGA**
Tim: Elang Sulsel
Skor: 2 - 1 (menang)
Match ID: 7491263508`;

export const myReport: SimMessage = {
  id: 'rep-1',
  author: 'budi',
  time: 'Hari ini 20.14',
  text: REPORT,
  attachment: 'result',
};

export const CHATTED: SimMessage[] = [
  { id: 'c-1', author: 'raka', time: 'Kemarin 10.12', text: 'Halo! Kita main jam 19.30 WITA ya? 👍' },
  { id: 'c-2', author: 'budi', time: 'Kemarin 10.20', text: 'Siap, sampai ketemu di lobby!' },
];

/** The participant's own match post. Title and body mirror the bot spec: docs/discord-bot/README.md §4. */
export function post(overrides: Partial<SimPost> = {}): SimPost {
  return {
    id: 'r1',
    title: '[MLBB] R1 · Elang Sulsel vs Laskar Maluku',
    tags: ['MLBB', 'PENDING RESULTS'],
    author: 'sari',
    time: 'Kemarin 09.00',
    text: [
      'Peserta: <@budi> (Elang Sulsel) vs <@raka> (Laskar Maluku)',
      'Jendela main: [ts:Sabtu, 14 November 2026 19.00] s/d [ts:21.00]',
      'Format: Bo3',
      'Batas lapor: [ts:dalam 2 jam]',
      'Cara lapor: https://jaya886.github.io/treasury-e-sport/misi/lapor-hasil/',
    ].join('\n'),
    mention: false,
    replies: structuredClone(CHATTED),
    ...overrides,
  };
}

export const inThread = (p: SimPost = post(), extra: Partial<SimSetup> = {}): SimSetup => ({
  view: 'thread',
  post: p.id,
  posts: [p],
  ...extra,
});

export const atHome = (p: SimPost = post(), extra: Partial<SimSetup> = {}): SimSetup => ({
  view: 'home',
  post: p.id,
  posts: [p],
  ...extra,
});

export const withReport = () => post({ replies: [...structuredClone(CHATTED), myReport] });
