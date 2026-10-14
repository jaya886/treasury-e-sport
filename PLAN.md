# TEC Discord Guide — Project Plan

> Status: **v4** — all 8 missions built; homepage leads with the interactive-guide explanation and mission map. Items marked **[OPEN]** need a decision before they are built.

## 1. Purpose

A guide website that teaches participants of the Treasury E-Sport Community's 2026 competition how to use the
**Treasury E-Sport Community** (TEC) Discord server for the competition. Site name: **TEC 2026**.

1. **Finding their match schedule** (primary)
2. **Self match-reporting** in per-match threads (primary)
3. Reading announcements
4. Asking for support (public help channel)
5. Coordinating with opponents

Long-term, the Discord server becomes the permanent home of the community, so the site doubles as the
on-ramp: get Treasury employees into Discord and comfortable there.

### Audience

- Treasury (DJPb) employees only, from offices all over Indonesia (WIB / WITA / WIT).
- Many have **never used Discord** (especially the chess community) → assume zero knowledge.
- Participants have both phone and laptop → every walkthrough has an **HP / Laptop** toggle; layouts mobile-first.
- Discord invite: a **regular invite link** shown on the confirmation page after submitting the participant registration form (Microsoft Forms).

### Scope

| In scope | Out of scope (for now) |
|---|---|
| Discord how-to for the competition | Live brackets / standings |
| Match-reporting walkthrough per game | Registration |
| How to find your schedule | Full rulebook (link out instead) |
| Interactive "video-like" walkthroughs | English content (framework ready, content later) |

### Games

| Game | Mode | Discord channel today | Notes |
|---|---|---|---|
| Mobile Legends: Bang Bang | Online, team | `#mlbb` | Match ID available in-game |
| PUBG Mobile | Online, team | `#pubgm` | **[OPEN]** Reporting flow pending PIC (battle-royale lobbies ≠ 1v1) |
| Magic Chess: Go Go | Online, solo | `#magic-chess-go-go` | |
| Dota 2 | Online, team | `#dota2` | Match ID available in-game |
| FC 27 | **Offline** | — | Played offline; Discord reporting not expected. Guide covers announcements/support only |
| Chess (lichess.org) | Online, solo | `#literally-catur` | Individual lichess games; the **game link is the Match ID** + screenshot of the final board. (Swiss tournament remains an option for the chess PIC.) |

## 2. Current Discord server (as of screenshots)

**Channels**

- `#admin-only` (private) — thread "List Kerjoan…"
- **Informasi**: `#rules`, `#pengumuman` (announcement), `#tec-2026`, `#support-dan-usulan`
- **yang kita mainkan**: `#mlbb`, `#literally-catur`, `#magic-chess-go-go`, `#dota2`, `#pubgm`, `#bola`
- **Topik Umum - General**: `#vvip`🔒, `#general`, `#rampage`🔒, `#tec-juga-olah-raga`🔒, `#mending-rakit-pc`🔒
- Community features on: Server Guide, Events, Channels & Roles.

**Roles**: Admin (3), VIP, Kapten Tim TEC (0), mlbb, pubgm, magic-chess, valorant, Dota2, Catur, Bola;
bots: Dyno, Tatsu.

**Observations**

- There is no dedicated place for match threads yet.
- No role marks someone as a *competition participant* or as *panitia/PIC*.
- `valorant` role has no matching channel / game in the competition.

## 3. Competition setup on Discord (agreed)

### 3.1 `#tec-2026` becomes a single **Forum channel** — the home of every match thread

Done on the server: `#🏅tec-2026` is a Forum channel under **Informasi** (the old `#tec-competition`
text channel was replaced). `#🏅pic-tec` is a private working channel for panitia/PIC and is not
visible to participants, so the guide does not show it.

- **One forum post = one match thread**, created by PIC/Admin only.
- **Public**: everyone can read every match (transparency).
- Permissions: `@everyone` → *Send Messages in Posts* ✅, *Create Posts* ❌; `PIC TEC 2026` & `Admin` → *Create Posts*, *Manage Threads*.
- **Tags** (as set up on the real forum, in this order):
  - Game: `MLBB` · `PUBGM` · `MCGG` · `DOTA2` · `CATUR` · `FC27`
  - Status: `⏰ SCHEDULED` · `🟡 PENDING RESULTS` · `🟢 FINISHED` · `🔴 DISPUTED`
  - No WO tag: a walkover is written in the thread by PIC and the match is tagged `FINISHED`.
- **Pinned post** at the top: "📌 Mulai di sini — cara lapor & jadwal ronde" (links to this site).
- Title convention: `[MLBB] R1 · Nama Tim A vs Nama Tim B` → searchable by team name.
- PIC **@mentions** the players in the opening message → they are added to the thread automatically,
  so the match appears in **their own sidebar** and they get notifications. This is the main answer to
  "how do I find my schedule?".

### 3.2 Match post template (written by PIC)

```
[MLBB] R1 · Garuda Perbendaharaan vs Kanwil Sulsel Squad
Peserta: @kapten-a @kapten-b (+ anggota)
Jendela main: <t:START:F> s/d <t:END:F>
Format: Bo3
Batas lapor: <t:DEADLINE:R>
Cara lapor: https://jaya886.github.io/treasury-e-sport/misi/lapor-hasil
```

Discord timestamps (`<t:unix:F>`) render **in each viewer's own time zone** → no WIB / WITA / WIT
conversion needed. The guide teaches participants to trust these.

### 3.3 Reporting inside the match thread

Both sides are responsible. Either way is accepted:

- **A. Report + confirm (taught as the default, easiest):** one side posts the report; the other side
  reacts ✅ to agree (or replies "❌ tidak setuju" → dispute).
- **B. Both report:** each side posts its own report.

```
HASIL LAGA
Tim/Pemain: Garuda Perbendaharaan
Skor: 2 - 1 (menang)
Match ID: 123456789        ← lichess link for chess
[screenshot: skor + pemenang + match ID]
```

- **Dispute**: discussed in the same thread; PIC sets tag `Sengketa` and decides.
- **No report by the deadline**: PIC checks the result themselves where the game allows it;
  otherwise both sides are counted as WO (consequence depends on format — **[OPEN]**).
- **PUBGM**: multi-team lobbies → flow **[OPEN]**, pending PIC.

### 3.4 Other channels used by the guide

| Purpose | Channel |
|---|---|
| All competition announcements (incl. round schedules) | `#📣pengumuman` |
| Help (public) | `#❓support-dan-usulan` |
| Rules | `#📝rules` |
| Match threads, per-match schedule & result reporting | `#🏅tec-2026` (forum) |
| Panitia/PIC workspace (private, not in guide) | `#🏅pic-tec` |

### 3.5 Roles & names

- **No participant role** — everyone can reply in match threads.
- **`PIC TEC 2026`** — one universal role for all game PICs.
- Other game roles are placeholders for the future community; not used by the guide.
- Server nickname is **optional**. The guide suggests real name/office, e.g. `Budi | KPPN Makassar I`
  (max 32 chars), because teams choose their own names and one office may have several teams.

## 4. Site information architecture (Bahasa Indonesia)

The guide is framed as a **quest**: each page is a *Misi* along a path drawn with the HORI 80
supergraphic. Progress is saved in the browser.

| # | Route | Misi | Key content |
|---|---|---|---|
| — | `/` | Beranda | What TEC is, why Discord, "Mulai Misi" + "Gabung Discord" |
| 0 | `/misi/kenalan-discord` | Kenalan dengan Discord | What Discord is; install (HP/laptop); create & verify account |
| 1 | `/misi/masuk-server` | Masuk Server | Invite link from the registration form, accept, rules, nickname format |
| 2 | `/misi/tur-server` | Tur Server | Interactive channel map: tap a channel → what it is for |
| 3 | `/misi/cari-jadwal` | Cari Jadwal Laga | Your match in the sidebar, `#tec-2026` tags & search, reading timestamps, notifications |
| 4 | `/misi/koordinasi` | Atur Waktu Main | Agree on a time with the opponent inside the match thread |
| 5 | `/misi/lapor-hasil` | Lapor Hasil | Screenshot → template → upload → wait for the other side |
| 6 | `/misi/sengketa-wo` | Sengketa & WO | What happens on disagreement / missed deadline |
| 7 | `/misi/bantuan` | Minta Bantuan | Using `#support-dan-usulan` |
| — | `/game/[slug]` | Cheat sheet per game | Where to find the Match ID & what the screenshot must show |
| — | `/faq` | FAQ | |

## 5. "Like watching a video" — interactive slides with a live Discord view

Each mission is an **interactive slide deck**, not a recording.

- **Slides**: one idea per slide, a short caption, next / previous, chapter dots, optional autoplay.
- **Live Discord stage**: a mock Discord UI (HTML/CSS) that *feels alive* — messages type in,
  members come online, unread badges pulse, notifications pop, the cursor/finger moves and taps,
  threads open, reactions get added.
- **Not limited to Discord**: a slide can also show in-game screenshots (where the Match ID is),
  diagrams (report → confirm → selesai flow), checklists, or a time-zone illustration.
- **Coba Sendiri**: on action slides the deck waits until the user taps the highlighted element.
- **HP / Laptop toggle** on every Discord stage.
- **Scenes are data** (`src/scenes/*.ts`): timed actions (`cursor`, `tap`, `type`, `post`, `react`,
  `highlight`, `toast`, `open`). Captions are i18n keys → localizable.
- Mirrors real channel names; when the server changes we edit text, not re-record.
- No video files → fast on slow office networks.
- `prefers-reduced-motion` → static frames with captions.

## 6. Visual direction

Base: **HORI 80 visual guideline** colours, typeface and supergraphic — **without** the HORI 80 or
Kemenkeu logos — pushed toward a game-like, Astro-style "stipple gradient + frosted glass" look.

| Token | Value | Use |
|---|---|---|
| Biru Oeang | `#0061AF` | Primary, supergraphic strokes |
| Kuning | `#FFBC00` | Accent, player markers, CTAs, XP |
| Putih | `#FFFFFF` | Text on dark, strokes on blue |
| Navy | ≈ `#1E1F4B` (sampled from guideline, to confirm) | Dark "game" background |

- **Typeface**: Figtree (Google Fonts) for everything; a monospace for small HUD labels.
- **Supergraphic → quest path**: the 5-stroke striped ribbon becomes the path linking missions; the
  yellow dots become checkpoints / the player token. Strokes "draw" in on scroll.
- **Stipple gradient**: blue/yellow radial glows on navy with a dithered grain overlay.
- **Frosted glass**: translucent panels with backdrop blur and a thin light border.
- **Game touches** (agreed: *medium*): gamer look (dark arena, chamfered buttons, HUD labels, neon glow), mission numbers, XP bar + ranks, achievement toast with badge per mission. No final quiz.
- **Accessibility**: yellow never used as text on white; AA contrast; full keyboard support.
- Wordmark: type-only "TEC" mark (no official logos).

## 7. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Astro** (static output) | Fast, content-first, islands for interactivity |
| Content | MDX content collections | Easy to edit; components inside prose |
| Interactivity | Vanilla TypeScript islands (simulator, deck player, progress) | No UI framework runtime; fewer dependencies |
| i18n | Astro i18n routing, `id` default (no prefix), UI strings in `src/i18n/` | English can be added later without restructuring |
| Styling | Plain CSS with design tokens (custom properties) | Full control of the custom look |
| Hosting | GitHub Pages via GitHub Actions | Free; `https://jaya886.github.io/treasury-e-sport/` |

## 8. Milestones

1. ✅ Plan & server structure agreed
2. ✅ Scaffold + design system + homepage
3. ✅ Simulator engine + **Lapor Hasil** deck
4. ✅ Remaining missions (00–04, 06, 07) + homepage restructure ← review this
5. Per-game cheat sheets (needs real in-game screenshots)
6. Mobile QA, accessibility pass, deploy

## 9. Open decisions

| # | Decision | Owner | Blocks |
|---|---|---|---|
| 2 | PUBGM reporting flow | PUBGM PIC | PUBGM cheat sheet |
| 3 | WO consequences & reschedule rules | Panitia | Misi 6 text |
| 5 | Competition format & dates | Panitia | Example dates in scenes only |
