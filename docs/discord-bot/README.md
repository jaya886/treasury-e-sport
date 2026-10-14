# TEC 2026 Match-Thread Bot — Build Spec

This folder is the **single source of truth** for a Discord bot that creates and maintains one
forum post ("thread") per match in the Treasury E-Sport Community server. It is written so a
coding agent (e.g. Claude) can build the bot without access to the server or to the people who
set it up.

The participant guide at <https://jaya886.github.io/treasury-e-sport/> teaches people exactly what
these threads look like. **The bot's output must match this spec**, or the guide will be wrong.
If you change the format here, also update the guide (see [§10](#10-keeping-the-guide-in-sync)).

| File | What it is |
|---|---|
| `README.md` | This spec |
| `server.json` | Server layout: channels, roles, forum tags (names are exact; IDs are filled in at setup) |
| `matches.example.csv` | Example input: one row per match |
| `AGENT_PROMPT.md` | Ready-to-paste prompt that starts a coding agent on this task |

---

## 1. Goal and scope

**Must do (phase 1)**

1. Read a list of matches (CSV, §5).
2. For each match, create **one post** in the forum channel `#🏅tec-2026` with the exact title,
   tags and opening message from §4, mentioning the players so they are added to the thread.
3. Be **idempotent**: running it again never creates duplicates; it updates the existing post.
4. Report what it did (created / updated / skipped / errors) to the console and to `#🏅pic-tec`.

**Should do (phase 2)**

5. Move status tags automatically (§6) and send reminders before the reporting deadline.
6. Slash commands for PICs (§7).

**Out of scope**

- Generating brackets or pairings (matches come from the committee).
- Reading result screenshots or deciding winners. PICs do that.
- Creating channels, roles or tags. They already exist (§3).

---

## 2. Recommended stack

| Concern | Recommendation | Notes |
|---|---|---|
| Language | TypeScript on Node 22 | Same stack as the guide repo |
| Library | `discord.js` v14 | Python + `discord.py` 2.x is fine too if preferred |
| Phase 1 shape | One-shot CLI: `npm run sync -- matches.csv` | Uses the REST API only; no always-on hosting needed |
| Phase 2 shape | Long-running bot (gateway) with a scheduler | Needs hosting that stays on (VPS, Railway, Fly.io, etc.) |
| State | SQLite file or a JSON file `state.json` | Maps `match_id → thread_id`, last applied status, reminder flags |
| Config | Environment variables (§8) | Never commit the bot token |

---

## 3. Server facts

Exact names, as they appear in the server (emoji are part of the channel name).
**Always look things up by ID from config, never by name**: names can be edited.
`server.json` holds the same data in machine-readable form.

### 3.1 Channels the bot uses

| Channel | Type | Who can see it | Bot uses it for |
|---|---|---|---|
| `🏅tec-2026` | **Forum** | Everyone | One post per match (create, edit, change tags) |
| `🏅pic-tec` | Text, private | Panitia/PIC only | Logs, errors, unresolved players, deadline alerts |
| `📣pengumuman` | Announcement | Everyone (read-only) | Not used by the bot. Round schedules are posted here by panitia |

Other channels (`📝rules`, `❓support-dan-usulan`, game chat channels, voice) are not used by the bot.

### 3.2 Roles

| Role | Meaning for the bot |
|---|---|
| `PIC TEC 2026` | Match officials. May run bot commands; may be mentioned in alerts |
| `Admin` | Server admins. May run bot commands |
| `Kapten Tim TEC` | Team captains (currently unused, 0 members) |
| Game roles `mlbb`, `pubgm`, `magic-chess`, `Dota2`, `Catur`, `Bola`, `valorant` | Community interest roles. **Do not** use them to find match players |
| `Dyno`, `Tatsu` | Other bots already in the server. Do not interfere |

### 3.3 Forum tags in `#🏅tec-2026`

Exact names, in the server's order. Resolve each tag's **ID** at startup with
`GET /channels/{forum_id}` → `available_tags` and match by `name` (case-sensitive).
Fail loudly if any is missing.

| Kind | Tag names |
|---|---|
| Game (exactly one per post) | `MLBB`, `PUBGM`, `MCGG`, `DOTA2`, `CATUR`, `FC27` |
| Status (exactly one per post) | `SCHEDULED` (⏰), `PENDING RESULTS` (🟡), `FINISHED` (🟢), `DISPUTED` (🔴) |

- There is **no WO tag**. A walkover is written in the thread by a PIC and the post is tagged `FINISHED`.
- A post can hold max 5 tags. The bot always applies exactly **2**: one game + one status.
- Status tags may be marked "moderated" (only Manage Threads can apply them), so the bot needs that permission.

---

## 4. The match post (must match the guide)

### 4.1 Title

```
[{GAME}] {ROUND} · {SIDE_A} vs {SIDE_B}
```

- `{GAME}` = the game tag name: `MLBB`, `PUBGM`, `MCGG`, `DOTA2`, `CATUR`, `FC27`.
- `{ROUND}` = short round code from the input, e.g. `R1`, `R2`, `QF`, `SF`, `F`.
- Separator is ` · ` (space, U+00B7 middle dot, space).
- `{SIDE_A}` / `{SIDE_B}` = team names for team games, player display names for solo games.
- Max 100 characters (Discord limit). If longer, shorten the side names with `…`, never the prefix.

Examples:

```
[MLBB] R1 · Elang Sulsel vs Laskar Maluku
[CATUR] R1 · Dewi vs Andi
[DOTA2] QF · Ancient Defenders vs KPPN Five
```

Participants are taught to **search the forum by team name**, so team names must appear in the title.

### 4.2 Opening message (the post body)

Plain text (no embed), Bahasa Indonesia, exactly these lines in this order:

```
Peserta: {MENTIONS_A} ({SIDE_A}) vs {MENTIONS_B} ({SIDE_B})
Jendela main: <t:{START}:F> s/d <t:{END}:t>
Format: {FORMAT}
Batas lapor: <t:{DEADLINE}:R>
Cara lapor: https://jaya886.github.io/treasury-e-sport/misi/lapor-hasil/
```

- `{MENTIONS_A}` = space-separated user mentions `<@USER_ID>` of every player on side A (captain first).
  If a player could not be resolved (§5.3), write their plain name instead and log it.
- `{START}`, `{END}`, `{DEADLINE}` = **Unix seconds**. Discord renders `<t:…>` in each viewer's
  own time zone (WIB/WITA/WIT), which the guide relies on. Never write times as plain text.
  - `:F` → "Sabtu, 14 November 2026 19.00" (full date + time)
  - `:t` → "21.00" (time only)
  - `:R` → "dalam 2 jam" (relative countdown)
- `{FORMAT}` = from input, e.g. `Bo1`, `Bo3`, `Bo5`. For CATUR use the time control too if given, e.g. `Bo1 · 10+5`.
- `allowed_mentions` must be `{ "parse": [], "users": [all resolved player IDs] }` so only the
  players get pinged (never `@everyone`, never roles). **Mentioning a user in the opening message
  adds them to the thread**, which makes it appear in their sidebar. The guide depends on this.

Rendered example (what a participant in Makassar sees):

```
Peserta: @Budi | KPPN Makassar I (Elang Sulsel) vs @Raka | KPPN Ambon (Laskar Maluku)
Jendela main: Sabtu, 14 November 2026 19.00 s/d 21.00
Format: Bo3
Batas lapor: dalam 2 jam
Cara lapor: https://jaya886.github.io/treasury-e-sport/misi/lapor-hasil/
```

### 4.3 Tags on creation

`[ {game tag}, SCHEDULED ]`

### 4.4 Other post settings

- `auto_archive_duration`: `10080` (7 days). Unarchive before editing an archived post.
- Do not lock the post. Participants must be able to reply (they agree on a time and report results there).
- The post author will be the bot. That is fine; the guide only says "PIC creates the thread".

### 4.5 Game-specific rules

| Game | Sides | Notes |
|---|---|---|
| MLBB, DOTA2 | Team vs team | Mention all players listed for each team |
| MCGG | Player vs player | Usually 1 player per side |
| CATUR | Player vs player | Matches are played on lichess.org. The game link is the "Match ID" |
| PUBGM | **Multi-team lobby** | Format **not decided** (open question). Do not create PUBGM posts until §11 is answered |
| FC27 | Offline | Whether FC27 gets threads is **not decided**. Skip unless the input explicitly includes it |

---

## 5. Input: `matches.csv`

### 5.1 Columns

UTF-8 CSV with a header row. See `matches.example.csv`.

| Column | Required | Example | Notes |
|---|---|---|---|
| `match_id` | yes | `MLBB-R1-01` | Unique, stable. Key for idempotency |
| `game` | yes | `MLBB` | One of the game tag names |
| `round` | yes | `R1` | Used in the title |
| `side_a_name` | yes | `Elang Sulsel` | Team name (team games) or player name (solo) |
| `side_a_players` | yes | `budi.makassar;andi_ppk` | Discord **usernames**, `;`-separated, captain first |
| `side_b_name` | yes | `Laskar Maluku` | |
| `side_b_players` | yes | `raka.ambon` | |
| `window_start` | yes | `2026-11-14T19:00:00+08:00` | ISO 8601 **with offset**. Committee's zone; any offset is fine |
| `window_end` | yes | `2026-11-14T21:00:00+08:00` | Must be after start |
| `report_deadline` | yes | `2026-11-14T23:00:00+08:00` | Must be at or after `window_end` |
| `format` | yes | `Bo3` | Free text, shown as-is |
| `pic` | no | `sari.pic` | Discord username of the responsible PIC (for alerts only) |
| `notes` | no | `Final ronde grup` | Not posted. For humans |

### 5.2 Validation (reject the row, log it, continue with the rest)

- Missing required value, unknown `game`, duplicate `match_id`.
- Times without an offset, `window_end <= window_start`, `report_deadline < window_end`.
- Title longer than 100 characters after shortening.
- `game` is `PUBGM` or `FC27` while those formats are undecided (§4.5).

### 5.3 Resolving players to Discord users

The registration form (Microsoft Forms) should collect each player's **Discord username**
(the unique handle, e.g. `budi.makassar`, not the display name).

1. Look up the username among guild members: `GET /guilds/{guild_id}/members/search?query={username}&limit=5`
   and pick the member whose `user.username` equals it exactly (case-insensitive).
2. Not found → the player probably has not joined the server yet. Use the plain username in the
   post, report it in `#🏅pic-tec`, and retry on the next sync. When the player is found later,
   edit the opening message to mention them.
3. Never DM players.

---

## 6. Status lifecycle

```
SCHEDULED ──(window_end reached)──▶ PENDING RESULTS ──(PIC)──▶ FINISHED
                                          │
                                          └──(PIC)──▶ DISPUTED ──(PIC)──▶ FINISHED
```

| Transition | Who | When |
|---|---|---|
| create → `SCHEDULED` | bot | On creation |
| `SCHEDULED` → `PENDING RESULTS` | bot (phase 2) | When `window_end` passes |
| → `FINISHED` / `DISPUTED` | **PIC** (manually in Discord, or via `/tec status`) | After reviewing reports |

Rules:

- When changing status, **replace** the status tag and keep the game tag. Exactly one status tag at a time.
- **Never override a PIC's choice.** If the current status tag is `FINISHED` or `DISPUTED`, the bot
  does not change it automatically.
- Re-running sync must not reset a post to `SCHEDULED` (status is not part of the "content" that gets re-synced).

**Reminders (phase 2)**

- `report_deadline − 1 hour`, status still `PENDING RESULTS`: reply in the thread
  `⏰ Batas lapor <t:{DEADLINE}:R>. Jangan lupa kirim hasil laga di thread ini ya.`
  mentioning both sides' players.
- `report_deadline` passed, still `PENDING RESULTS`: post in `#🏅pic-tec`:
  `⚠️ Belum ada laporan: {title} → {thread link}` (mention the match's `pic` if given).
- Each reminder is sent once per match (store a flag in state).

---

## 7. Slash commands (phase 2)

Register as guild commands. Allow only members with `PIC TEC 2026` or `Admin`.
All replies ephemeral, except the log line also written to `#🏅pic-tec`.

| Command | Does |
|---|---|
| `/tec sync` with a CSV attachment | Same as the CLI: create/update posts, then reply with a summary |
| `/tec status match_id:<id> status:<SCHEDULED\|PENDING RESULTS\|FINISHED\|DISPUTED>` | Set the status tag |
| `/tec link match_id:<id>` | Reply with the post link |
| `/tec check` | List matches past deadline still `PENDING RESULTS`, and unresolved players |

Running inside a match thread, `match_id` may be omitted (look it up from state by thread ID).

---

## 8. Configuration and permissions

### 8.1 Environment variables

```
DISCORD_TOKEN=            # bot token (secret)
DISCORD_APP_ID=           # application ID (for slash commands)
GUILD_ID=                 # Treasury E-Sport Community
FORUM_CHANNEL_ID=         # 🏅tec-2026
LOG_CHANNEL_ID=           # 🏅pic-tec
PIC_ROLE_ID=              # PIC TEC 2026
ADMIN_ROLE_ID=            # Admin
GUIDE_REPORT_URL=https://jaya886.github.io/treasury-e-sport/misi/lapor-hasil/
DRY_RUN=false             # true → print payloads, call no write endpoints
```

To get IDs: Discord → User Settings → Advanced → **Developer Mode** on, then right-click a
channel/role/server → **Copy ID**.

### 8.2 Bot permissions

Invite the bot with these permissions (scopes `bot` + `applications.commands`):

| Permission | Why |
|---|---|
| View Channels | See `🏅tec-2026` and `🏅pic-tec` (add the bot to `🏅pic-tec`'s private access) |
| Send Messages | Create forum posts, write logs |
| Send Messages in Threads | Reminders inside match posts |
| Manage Threads | Apply moderated status tags, unarchive posts, edit tags |
| Embed Links | Thread links in log messages |
| Read Message History | Edit its own opening messages |

Do **not** request Administrator.

### 8.3 Gateway intents

- `Guilds`: required.
- `GuildMembers` (privileged, enable in the Developer Portal): only if you resolve members from the
  gateway cache. The REST member search in §5.3 does not need it.
- `MessageContent`: **not needed**. The bot does not read participants' messages.

---

## 9. Discord API reference (REST v10)

| Action | Endpoint | Body (key fields) |
|---|---|---|
| Read forum + tag IDs | `GET /channels/{FORUM_CHANNEL_ID}` | → `available_tags[] { id, name, emoji_name, moderated }` |
| Create match post | `POST /channels/{FORUM_CHANNEL_ID}/threads` | `name`, `auto_archive_duration`, `applied_tags: [gameTagId, statusTagId]`, `message: { content, allowed_mentions }` |
| Change tags / unarchive | `PATCH /channels/{THREAD_ID}` | `applied_tags`, `archived: false` |
| Edit opening message | `PATCH /channels/{THREAD_ID}/messages/{THREAD_ID}` | `content`, `allowed_mentions` (the starter message ID equals the thread ID) |
| Reply in post | `POST /channels/{THREAD_ID}/messages` | `content`, `allowed_mentions` |
| Find member | `GET /guilds/{GUILD_ID}/members/search?query=…&limit=5` | |

- Respect rate limits (discord.js handles this). Space post creation ≈1 per second when bulk-creating.
- Message content max 2000 characters.

---

## 10. Keeping the guide in sync

The guide renders a fake Discord from these files in the guide repo:

| Guide file | Mirrors |
|---|---|
| `src/decks/id/fixtures.ts` → `post()` | Title (§4.1) and opening message (§4.2) |
| `src/data/server.ts` → `tags`, `categories` | Forum tags (§3.3) and channels (§3.1) |
| Misi 03 (`cari-jadwal.ts`) and Misi 05 (`lapor-hasil.ts`) | Status lifecycle (§6) |

If the bot's format changes, update those files in the same change so participants are taught
what they will actually see.

---

## 11. Open questions (ask the committee before building these parts)

1. **Input source:** CSV export from Excel/MS Forms is assumed. Will the bracket live in a spreadsheet the bot should read directly instead?
2. **Who is mentioned:** all registered players of a team, or only the captain?
3. **Discord usernames:** does the registration form collect each player's Discord username?
4. **PUBGM** lobby format (one post per lobby? how are placements reported?).
5. **FC27** (offline): threads or not?
6. **Reporting deadline rule:** fixed per round, or `window_end + N hours`?
7. **Auto `PENDING RESULTS`:** at `window_end` (assumed) or at `window_start`?
8. **WO handling:** confirm there will be no WO tag (assumed: PIC writes it in the thread and tags `FINISHED`).

---

## 12. Acceptance checklist

Test on a **separate test server** with the same channel/tag setup before touching the real one.

- [ ] Startup fails with a clear error if any tag in §3.3 is missing from the forum.
- [ ] `DRY_RUN=true` prints every title, tag pair and message, and writes nothing.
- [ ] Each valid CSV row produces exactly one post titled per §4.1 with tags `[game, SCHEDULED]`.
- [ ] Opening message matches §4.2 line by line, and timestamps render correctly in clients set to WIB, WITA and WIT.
- [ ] Mentioned players are pinged once, see the post in their sidebar, and nobody else is pinged.
- [ ] Running sync twice creates no duplicates; editing a row's time and re-running edits the existing message.
- [ ] Re-running sync does not change a post a PIC has set to `FINISHED` or `DISPUTED`.
- [ ] Invalid rows are reported (console + `#🏅pic-tec`) and the rest still succeed.
- [ ] Unresolved usernames appear as plain text, are reported, and become mentions on a later sync once the player joins.
- [ ] (Phase 2) Status moves to `PENDING RESULTS` after `window_end`; reminders fire once.
- [ ] (Phase 2) Slash commands are refused for members without `PIC TEC 2026` or `Admin`.
- [ ] The bot token is not in the repository.
