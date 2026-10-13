# TEC 2026 — Panduan Discord

Interactive guide that teaches participants of the **Treasury E-Sport Community** 2026 competition how to
use the community Discord server: find their match schedule, coordinate with opponents and report results.

See [`PLAN.md`](PLAN.md) for scope, decisions and open questions.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321/treasury-e-sport/
npm run check    # type-check
npm run build    # static output in dist/
```

Requires Node 22.12+.

## How it is organised

| Path | What |
|---|---|
| `src/data/missions.ts` | Mission list (title, XP, badge, ready/coming soon) |
| `src/data/server.ts` | Mock of the real Discord server used by the simulator — keep channel names in sync |
| `src/decks/id/*.ts` | Mission slide decks (Bahasa Indonesia). One file per mission, registered in `index.ts` |
| `src/scripts/sim.ts` | Discord simulator: renders the mock UI and plays scripted steps |
| `src/scripts/deck.ts` | Slide player: autoplay, Tonton / Coba Sendiri modes, HP / Laptop toggle |
| `src/i18n/ui.ts` | UI strings per locale |
| `src/styles/` | Design tokens (HORI 80 palette, Figtree) and simulator styles |

### Writing a mission deck

Each slide has text (`title`, `body`, `bullets`, `tips`) and a `visual`. A `sim` visual is a scene:
a `setup` (what the Discord screen shows first) and `steps`, for example:

```ts
{ say: 'Ketuk tombol +' },                        // caption under the screen
{ tap: 'plus', try: true, hint: 'Ketuk tombol +' }, // in "Coba Sendiri" the user must tap it
{ picker: 'menu', only: 'desktop' },               // device-specific step
{ type: 'HASIL LAGA ...' },                        // typing animation in the message box
{ msg: { id: 'x', author: 'raka', text: '✅ Setuju' } },
{ tags: { post: 'r1', tags: ['MLBB', 'Selesai'] } },
```

Targets (`plus`, `send`, `composer`, `thread:<id>`, `ch:<id>`, `pick:result`, `upload`, `starter`) are the
`data-t` attributes rendered by the simulator.

### Adding a language

Add the locale to `astro.config.mjs` and `src/i18n/ui.ts`, then add `missions[locale]` and a
`src/decks/<locale>/` folder.

## Deploy

`.github/workflows/deploy.yml` builds on every push and publishes the default branch to GitHub Pages.
One-time setup: **Settings → Pages → Source: GitHub Actions**.
Site URL: https://jaya886.github.io/treasury-e-sport/
