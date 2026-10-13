import type { Deck } from '../../lib/deck-types';
import { laporHasil } from './lapor-hasil';

/** Decks by mission slug. A mission without a deck renders as "coming soon". */
export const decks: Record<string, Deck> = {
  [laporHasil.slug]: laporHasil,
};
