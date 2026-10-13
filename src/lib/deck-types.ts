import type { SimScene } from './sim-types';

export type Visual =
  | { kind: 'sim'; scene: SimScene }
  | { kind: 'flow'; steps: { icon: string; label: string }[] }
  | { kind: 'shot' }
  | { kind: 'deadline'; zones: { zone: string; time: string }[]; label: string }
  | { kind: 'recap'; template: string };

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
