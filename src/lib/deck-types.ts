import type { SimScene } from './sim-types';

export type Visual =
  | { kind: 'sim'; scene: SimScene }
  | { kind: 'flow'; steps: { icon: string; label: string }[] }
  | { kind: 'shot' }
  | { kind: 'zones'; label: string; chip: string; zones: { zone: string; time: string }[]; note: string }
  | { kind: 'cards'; cards: { icon: string; title: string; text: string }[] }
  /** server → category → channel → thread hierarchy */
  | { kind: 'concept'; levels: { icon: string; name: string; label: string }[] }
  | { kind: 'form'; title: string; fields: { label: string; value: string }[]; button: string }
  /** a message the participant receives (email or chat) */
  | { kind: 'note'; app: string; from: string; title: string; body: string; button?: string }
  | { kind: 'recap'; template?: string };

export interface Slide {
  id: string;
  title: string;
  /** Mini-markup: **bold**, `code` */
  body: string;
  bullets?: string[];
  tips?: { label: string; text: string }[];
  visual: Visual;
  /** autoplay duration for non-simulator slides (ms) */
  duration?: number;
}

export interface Deck {
  slug: string;
  slides: Slide[];
}
