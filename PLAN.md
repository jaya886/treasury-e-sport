# TEC Discord Guide — Project Plan

> Status: **Draft v1** — planning phase. Items marked **[OPEN]** need a decision before they are built.

## 1. Purpose

A guide website that teaches participants of the Treasury E-Sport Competition (TEC) how to use the
**Treasury E-Sport Community** Discord server for the competition:

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
- Likely mobile-heavy → design mobile-first, but cover desktop too.

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
| FC 27 | **Offline** | `#bola` (?) | **[OPEN]** Does FC 27 use Discord reporting at all? |
| Chess (lichess.org) | Online, solo | `#literally-catur` | Game URL acts as match ID |

## 2. Current Discord server (as of screenshots)

**Channels**

- `#admin-only` (private) — thread "List Kerjoan…"
- **Informasi**: `#rules`, `#pengumuman` (announcement), `#tec-competition`, `#support-dan-usulan`
- **yang kita mainkan**: `#mlbb`, `#literally-catur`, `#magic-chess-go-go`, `#dota2`, `#pubgm`, `#bola`
- **Topik Umum - General**: `#vvip`🔒, `#general`, `#rampage`🔒, `#tec-juga-olah-raga`🔒, `#mending-rakit-pc`🔒
- Community features on: Server Guide, Events, Channels & Roles.

**Roles**: Admin (3), VIP, Kapten Tim TEC (0), mlbb, pubgm, magic-chess, valorant, Dota2, Catur, Bola;
bots: Dyno, Tatsu.

**Observations**

- There is no dedicated place for match threads yet.
- No role marks someone as a *competition participant* or as *panitia/PIC*.
- `valorant` role has no matching channel / game in the competition.

## 3. Proposed Discord additions (for the competition)

The guide can only be as clear as the server, so we lock the server structure first.

### 3.1 Category `🏆 TEC` (new)

| Channel | Type | Who posts | Purpose |
|---|---|---|---|
| `#jadwal-tec` | Announcement | Panitia | Round schedules & time windows |
| `#laga-mlbb`, `#laga-dota2`, `#laga-mcgg`, `#laga-pubgm`, `#laga-catur`, `#laga-fc27` | **Forum** | Panitia creates posts; participants reply | **One forum post = one match thread** |
| `#support-dan-usulan` (existing) | Text | Everyone | Public help |
| `#pengumuman` (existing) | Announcement | Admin | General announcements |

**Why Forum channels for match threads**

- Each post *is* a thread → exactly the "one thread per match" idea.
- Discord separates *Create Posts* from *Send Messages in Posts* permissions → only panitia creates
  matches, participants can only reply. No clutter.
- **Tags** give each match a visible status: `Terjadwal` · `Menunggu Laporan` · `Selesai` · `Sengketa` · `WO`.
- Searchable and filterable by tag; participants can "Follow" their post to get notified.

**Match post template (created by panitia)**

```
Judul: [R1] Kanwil DJPb Sulsel vs Kanwil DJPb Jatim
Peserta: @kapten-a @kapten-b (+ anggota)
Jendela waktu: <t:START:F> s/d <t:END:F>
Format: Bo3
Batas lapor: <t:DEADLINE:R>
Cara lapor: (link ke panduan)
```

Discord timestamps (`<t:unix:F>`) render **in each viewer's own time zone**, which solves
WIB / WITA / WIT confusion automatically. The guide will teach participants to trust these.

**Report template (posted by both sides)**

```
HASIL LAGA
Tim/Pemain: Kanwil DJPb Sulsel
Skor: 2 - 1 (menang)
Match ID: 123456789   ← or lichess link for chess
[screenshot(s) attached]
```

### 3.2 Roles (proposed additions)

| Role | Purpose |
|---|---|
| `Peserta TEC` | Can see/reply in `#laga-*` forums |
| `Kapten Tim TEC` (exists) | Team contact person |
| `Panitia TEC` / `PIC <game>` | Create match posts, set tags, resolve disputes |
| Game roles (exist) | Mentions & per-game notifications |

### 3.3 Nickname convention (proposed)

`Nama Panggilan | Satker` — e.g. `Budi | Kanwil Sulsel`. Lets panitia and opponents identify people.

## 4. Site information architecture (Bahasa Indonesia)

The guide is framed as a **quest**: each page is a *Misi* along a path drawn with the HORI 80
supergraphic. Progress is saved in the browser.

| # | Route | Misi | Key content |
|---|---|---|---|
| — | `/` | Beranda | What TEC is, why Discord, "Mulai Misi" + "Gabung Discord" |
| 0 | `/misi/kenalan-discord` | Kenalan dengan Discord | What Discord is; install (HP/laptop); create & verify account |
| 1 | `/misi/masuk-server` | Masuk Server | Invite link, onboarding, roles, nickname format |
| 2 | `/misi/tur-server` | Tur Server | Interactive channel map: tap a channel → what it is for |
| 3 | `/misi/cari-jadwal` | Cari Jadwal Laga | `#jadwal-tec`, find your match post, read timestamps, follow post, notifications |
| 4 | `/misi/koordinasi` | Atur Waktu Main | Agree on a time with the opponent inside the match thread |
| 5 | `/misi/lapor-hasil` | Lapor Hasil | Screenshot → template → upload → wait for the other side |
| 6 | `/misi/sengketa-wo` | Sengketa & WO | What happens on disagreement / missed deadline |
| 7 | `/misi/bantuan` | Minta Bantuan | Using `#support-dan-usulan` |
| — | `/game/[slug]` | Cheat sheet per game | Where to find the Match ID & what the screenshot must show |
| — | `/faq` | FAQ | |

## 5. "Like watching a video" — the Discord Simulator

The core interactive piece. Instead of screen recordings, we render a **mock Discord UI in HTML/CSS**
and play scripted scenes on it.

- **Player controls**: play/pause, scrubber with chapter markers, speed, replay, captions.
- **Two modes**:
  - *Tonton* — autoplays like a video (cursor moves, taps, typing, messages appear, highlights).
  - *Coba Sendiri* — pauses at each step and waits for the user to tap the highlighted element.
- **Device toggle**: HP / Laptop layouts.
- **Scenes are data** (`src/scenes/*.ts`): a list of timed actions (`cursor`, `tap`, `type`, `post`,
  `highlight`, `caption`, `open`). Captions are i18n keys → localizable, unlike a video.
- Mirrors real channel names, so when the server changes we edit text, not re-record.
- No video files → fast on slow office networks.
- `prefers-reduced-motion` → falls back to a static step-by-step list.

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
- **Game touches**: mission numbers, XP bar (progress), achievement toast on completing a mission.
- **Accessibility**: yellow never used as text on white; AA contrast; full keyboard support.
- Wordmark: type-only "TEC" mark (no official logos).

## 7. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Astro** (static output) | Fast, content-first, islands for interactivity |
| Content | MDX content collections | Easy to edit; components inside prose |
| Interactivity | Preact islands (simulator, channel map, progress) | Small runtime |
| i18n | Astro i18n routing, `id` default (no prefix), UI strings in `src/i18n/` | English can be added later without restructuring |
| Styling | Plain CSS with design tokens (custom properties) | Full control of the custom look |
| Hosting | GitHub Pages via GitHub Actions | Free; `https://jaya886.github.io/treasury-e-sport/` |

## 8. Milestones

1. **Plan & server structure agreed** ← we are here
2. Scaffold + design system + homepage (visual direction review)
3. Simulator engine + **Lapor Hasil** scene (most important flow — review early)
4. Remaining missions + channel map
5. Per-game cheat sheets (needs real in-game screenshots)
6. Mobile QA, accessibility pass, deploy

## 9. Open decisions

See the chat thread; answers will be folded back into this document.
