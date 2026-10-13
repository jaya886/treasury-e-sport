import type { Deck } from '../../lib/deck-types';
import { kenalanDiscord } from './kenalan-discord';
import { masukServer } from './masuk-server';
import { turServer } from './tur-server';
import { cariJadwal } from './cari-jadwal';
import { aturWaktu } from './atur-waktu';
import { laporHasil } from './lapor-hasil';
import { sengketaWo } from './sengketa-wo';
import { mintaBantuan } from './minta-bantuan';

/** Decks by mission slug. A mission without a deck renders as "coming soon". */
export const decks: Record<string, Deck> = Object.fromEntries(
  [kenalanDiscord, masukServer, turServer, cariJadwal, aturWaktu, laporHasil, sengketaWo, mintaBantuan].map((d) => [d.slug, d]),
);
