# TEC 2026 Match-Thread Bot — Build Spec

This folder is the **single source of truth** for a Discord bot that creates and maintains one
forum post ("thread") per match in the Treasury E-Sport Community server. It is written so a
coding agent (e.g. Claude) can build the bot without access to the server or to the people who
set it up.

The participant guide at <https://jaya886.github.io/treasury-e-sport/> teaches people exactly what
these threads look like. **The bot's output must match this spec**, or the guide will be wrong.
If you change the format here, also update the guide (see [§10](#10-keeping-the-guide-in-sync)).
The bot is implemented in [jaya886/Tanding-bot](https://github.com/jaya886/Tanding-bot); change it together with this spec.

| File | What it is |
|---|---|
| `README.md` | This spec |
| `server.json` | Server layout: channels, roles, forum tags (names are exact; IDs are filled in at setup) |
| `teams.example.csv` | Example roster: one row per team (or player, for solo games) |
| `matches.example.csv` | Example input: one row per match, naming its teams |
| `AGENT_PROMPT.md` | Ready-to-paste prompt that starts a coding agent on this task |

---

## 1. Goal and scope

**Must do (phase 1)**

1. Read the team roster and the list of matches (CSV, §5).
2. For each match, create **one post** in the forum channel `#🏅tec-2026` with the exact title,
   tags and opening message from §4, mentioning the players so they are added to the thread.
3. Be **idempotent**: running it again never creates duplicates; it updates the existing post.
4. Report what it did (created / updated / skipped / errors) to the console and to `#🏅pic-tec`.

**Should do (phase 2)**

5. Move status tags automatically (§6) and send reminders before the reporting deadline.
6. Slash commands for PICs (§7).
7. (Stage 3) Keep results: a PIC records them with `/tec result` or in the committee website; the bot then
   tags the post `FINISHED` (or `DISPUTED`) and writes the result line in the thread (§6.1).

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
| Phase 1 shape | One-shot CLI: `npm run sync -- matches.csv teams.csv` | Uses the REST API only; no always-on hosting needed |
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

- There is **no WO tag**. A walkover is written in the thread (by a PIC, or by the bot when the PIC records it with
  `/tec result outcome:WO`, §6.1) and the post is tagged `FINISHED`.
- A post can hold max 5 tags. The bot always applies exactly **2**: one game + one status.
- Status tags may be marked "moderated" (only Manage Threads can apply them), so the bot needs that permission.

---

## 4. The match post (must match the guide)

### 4.1 Title

```
[{GAME}] {ROUND} · {SIDE_A} vs {SIDE_B}                  two sides
[{GAME}] {ROUND} · {LABEL} · {SIDE_1}, {SIDE_2}, … +N    three or more sides (a lobby)
```

- `{GAME}` = the game tag name: `MLBB`, `PUBGM`, `MCGG`, `DOTA2`, `CATUR`, `FC27`.
- `{ROUND}` = short round code from the input, e.g. `R1`, `R2`, `QF`, `SF`, `F`. Until stages are
  modelled, the stage goes in the code too: `SW-R3`, `GRP-A R2`, `UB-QF`, `LB-R2`, `GF`.
- `{LABEL}` = optional, from the input (e.g. `Lobby A`); when given, it follows the round in either form.
- Separator is ` · ` (space, U+00B7 middle dot, space).
- `{SIDE_…}` = team names for team games, player names for solo games, in input order.
- Max 100 characters (Discord limit). Never shorten the prefix.
  - Two sides: shorten the side names with `…`.
  - Lobby: list as many whole team names as fit, then ` +N` for the rest (all teams are in the body).

Examples:

```
[MLBB] R1 · Elang Sulsel vs Laskar Maluku
[CATUR] R1 · Dewi vs Andi
[DOTA2] QF · Ancient Defenders vs KPPN Five
[PUBGM] R1 · Lobby A · Elang Sulsel, Laskar Maluku, KPPN Five, Ancient Defenders, Pinisi Squad +11
```

Participants are taught to **search the forum by team name**, so team names must appear in the title.

### 4.2 Opening message (the post body)

Plain text (no embed), Bahasa Indonesia, exactly these lines in this order. Two sides:

```
Peserta: {MENTIONS_A} ({SIDE_A}) vs {MENTIONS_B} ({SIDE_B})
Jendela main: <t:{START}:F> s/d <t:{END}:{END_STYLE}>
Format: {FORMAT}
Batas lapor: <t:{DEADLINE}:R>
Cara lapor: https://jaya886.github.io/treasury-e-sport/misi/lapor-hasil/
```

Three or more sides (a lobby): the `Peserta` line becomes a numbered list, one team per line, in input order;
the other four lines are the same.

```
Peserta:
1. {MENTIONS_1} ({SIDE_1})
2. {MENTIONS_2} ({SIDE_2})
…
Jendela main: <t:{START}:F> s/d <t:{END}:{END_STYLE}>
Format: {FORMAT}
Batas lapor: <t:{DEADLINE}:R>
Cara lapor: https://jaya886.github.io/treasury-e-sport/misi/lapor-hasil/
```

- `{MENTIONS_…}` = space-separated user mentions `<@USER_ID>` of every player on that side (captain first).
  If a player could not be resolved (§5.4), write their plain name instead and log it.
  **Real names:** when a player's real name is known (the committee website's roster, or the `names` column of
  `teams.csv`), write it after the mention, and separate that side's players with `, `:
  `<@111> Budi Santoso, <@222> Andi Wijaya`. Leave it out in solo games where the side is already named after the
  player.
  **Members without a Discord username** (known only by name) are listed by name after the mentioned players:
  `<@111> Budi Santoso, <@222> Andi Wijaya, Rina Kartika`. They can't be mentioned, so they aren't pinged or added.
- **Too big to mention everyone:** if the message would exceed 2000 characters or 100 mentioned users
  (about 17+ squads of 4), mention only each side's captain followed by the number of teammates, e.g.
  `<@CAPTAIN_ID> +3`, and add the teammates to the post **without a ping**
  (`PUT /channels/{THREAD_ID}/thread-members/{USER_ID}`) so it still appears in their sidebar.
- `{START}`, `{END}`, `{DEADLINE}` = **Unix seconds**. Discord renders `<t:…>` in each viewer's
  own time zone (WIB/WITA/WIT), which the guide relies on. Never write times as plain text.
  - `:F` → "Sabtu, 14 November 2026 19.00" (full date + time)
  - `:t` → "21.00" (time only)
  - `{END_STYLE}` = `t` when the window ends on the day it starts in WIB, WITA and WIT; otherwise `F`, so a window
    over several days reads e.g. "Sabtu, 14 November 2026 19.00 s/d Senin, 16 November 2026 21.00".
  - `:R` → "dalam 2 jam" (relative countdown)
- `{FORMAT}` = from input, e.g. `Bo1`, `Bo3`, `Bo5`. For CATUR use the time control too if given, e.g. `Bo1 · 10+5`.
- `allowed_mentions` must be `{ "parse": [], "users": [the mentioned player IDs] }` so only the
  players get pinged (never `@everyone`, never roles). **Mentioning a user in the opening message
  adds them to the thread**, which makes it appear in their sidebar. The guide depends on this.

Rendered example (what a participant in Makassar sees):

```
Peserta: @Budi | KPPN Makassar I Budi Santoso (Elang Sulsel) vs @Raka | KPPN Ambon Raka Pratama (Laskar Maluku)
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
| PUBGM | **Multi-team lobby** | One post per lobby listing every squad (§4.1, §4.2). `format` says how many games the lobby plays, e.g. `3 match`. How placements are reported is announced by the PICs |
| FC27 | Player vs player, offline | Posts work like any 1v1 game; the committee may simply not list FC27 matches |

---

## 5. Input: `teams.csv` and `matches.csv`

UTF-8 CSV files with a header row (comma- or semicolon-separated). Teams are entered once, in the roster;
each match only names its teams. See `teams.example.csv` and `matches.example.csv`.

### 5.1 `teams.csv` columns

One row per team. For solo games (CATUR, MCGG, FC27) a "team" is one player.

| Column | Required | Example | Notes |
|---|---|---|---|
| `game` | yes | `MLBB` | One of the game tag names |
| `name` | yes | `Elang Sulsel` | Team name (or player name for solo games). Unique per game, case-insensitive |
| `players` | yes | `budi.makassar;andi_ppk` | Discord **usernames**, `;`-separated, **captain first** |
| `names` | no | `Budi Santoso;Andi Wijaya` | Real names in the same order as `players` (blank = none), written after each mention (§4.2) |
| `others` | no | `Rina Kartika;Fajar` | Members without a Discord username, by name, `;`-separated; listed after the players (§4.2) |

### 5.2 `matches.csv` columns

| Column | Required | Example | Notes |
|---|---|---|---|
| `match_id` | yes | `MLBB-R1-01` | Unique, stable. Key for idempotency |
| `game` | yes | `MLBB` | One of the game tag names |
| `round` | yes | `R1` | Used in the title |
| `label` | no | `Lobby A` | Shown in the title after the round |
| `sides` | yes | `Elang Sulsel;Laskar Maluku` | Team names from `teams.csv` (same game), `;`-separated. 2 for a normal match, more for a lobby |
| `window_start` | yes | `2026-11-14T19:00:00+08:00` | ISO 8601 **with offset**. Committee's zone; any offset is fine |
| `window_end` | yes | `2026-11-14T21:00:00+08:00` | Must be after start |
| `report_deadline` | yes | `2026-11-14T23:00:00+08:00` | Must be at or after `window_end` |
| `format` | yes | `Bo3` | Free text, shown as-is |
| `pic` | no | `sari.pic` | Discord username of the responsible PIC (for alerts only) |
| `notes` | no | `Final ronde grup` | Not posted. For humans |

The original single-file layout stays accepted, without a roster: instead of `sides`, the columns
`side_a_name`, `side_a_players`, `side_b_name`, `side_b_players` (players `;`-separated, captain first).

### 5.3 Validation (reject the row, log it, continue with the rest)

Roster:

- Missing value, unknown `game`, something that is not a Discord username (e.g. a display name with spaces).
- The same team name twice for one game (every copy is rejected), or a player on two teams of the same game.

Matches:

- Missing required value, unknown `game`, duplicate `match_id` (every copy is rejected).
- `sides`: fewer than 2 teams, a team listed twice, a team not in the roster for that game, or one the roster rejected.
- Times without an offset, `window_end <= window_start`, `report_deadline < window_end`.
- Title longer than 100 characters after shortening, or an opening message over 2000 characters even with
  captains only.

### 5.4 Resolving players to Discord users

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
SCHEDULED ──(window_start reached)──▶ PENDING RESULTS ──(PIC)──▶ FINISHED
                                          │
                                          └──(PIC)──▶ DISPUTED ──(PIC)──▶ FINISHED
```

| Transition | Who | When |
|---|---|---|
| create → `SCHEDULED` | bot | On creation |
| `SCHEDULED` → `PENDING RESULTS` | bot (phase 2) | When `window_start` is reached (play begins) |
| → `FINISHED` / `DISPUTED` | **PIC** (manually in Discord, via `/tec status`, or by recording the result, §6.1) | After reviewing reports |

Rules:

- When changing status, **replace** the status tag and keep the game tag. Exactly one status tag at a time.
- **Never override a PIC's choice.** If the current status tag is `FINISHED` or `DISPUTED`, the bot
  does not change it automatically.
- Re-running sync must not reset a post to `SCHEDULED` (status is not part of the "content" that gets re-synced).

**Reminders (phase 2)**

- `report_deadline − 1 hour`, status still `PENDING RESULTS`: reply in the thread
  `⏰ Batas lapor <t:{DEADLINE}:R>. Jangan lupa kirim hasil laga di thread ini ya.`
  mentioning the players the opening message mentions (captains only in a captains-only lobby post).
- `report_deadline` passed, still `PENDING RESULTS`: post in `#🏅pic-tec`:
  `⚠️ Belum ada laporan: {title} → {thread link}` (mention the match's `pic` if given).
- Each reminder is sent once per match (store a flag in state).

### 6.1 Recording a result (stage 3)

A PIC (or Admin) records the result with `/tec result` (§7) or in the committee website. The bot then, in this order:
replaces the status tag with `FINISHED` (`DISPUTED` for a held result), keeping the game tag; unarchives the post if
needed; writes one line in the thread; and logs it in `#🏅pic-tec`. The line is what the guide shows a PIC writing
(Misi 05, `lapor-hasil.ts`):

| Result | Line in the thread |
|---|---|
| Played, two sides | `Hasil dicatat: **{A} {a} - {b} {B}**. Label diubah ke FINISHED. Terima kasih! 🏆` (½ for a chess draw) |
| WO | `Hasil dicatat: **{winner} menang WO ({absent} tidak hadir)**. Label diubah ke FINISHED. Terima kasih! 🏆` |
| Double WO | `Hasil dicatat: **WO ganda, kedua pihak dianggap kalah**. Label diubah ke FINISHED. Terima kasih! 🏆` |
| Lobby (3+ sides) | `Hasil dicatat: **{n} game**. Label diubah ke FINISHED. Terima kasih! 🏆` (placements are kept in the website) |
| Disputed | `Hasil laga ini **disengketakan**. {mentions} mohon kirim bukti lengkap di thread ini. PIC akan memutuskan.` (pings the players the opening message mentions) |

A corrected result writes `Hasil diperbarui: **…**. Label: FINISHED.` instead. Removing a result changes nothing in
Discord. If Discord can't be updated, the result is still kept and the PIC can send it again from the website.

---

## 7. Slash commands (phase 2)

Register as guild commands. Allow only members with `PIC TEC 2026` or `Admin`.
All replies ephemeral, except the log line also written to `#🏅pic-tec`.

| Command | Does |
|---|---|
| `/tec sync` with the CSV attachments (`matches`, `teams`) | Same as the CLI: create/update posts, then reply with a summary |
| `/tec status match_id:<id> status:<SCHEDULED\|PENDING RESULTS\|FINISHED\|DISPUTED>` | Set the status tag |
| `/tec result score:<a-b> [outcome:<Played\|WO\|Double WO\|Disputed>] [winner:<side>] [report:<message link>] [match_id:<id>]` | (Stage 3) Record a two-sided match's result: kept in the website, then tag and thread line as in §6.1. `score` is in the order of the title; a WO needs `winner`. Running it again corrects the result. |
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
  gateway cache. The REST member search in §5.4 does not need it.
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
| Add a player to a post without a ping | `PUT /channels/{THREAD_ID}/thread-members/{USER_ID}` | (thread must not be archived) |
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
2. ~~**Who is mentioned**~~ Decided: every player; captains only (others added without a ping) when a post is too big (§4.2).
3. **Discord usernames:** does the registration form collect each player's Discord username?
4. ~~**PUBGM** lobby format~~ Decided: one post per lobby with every squad (§4.1, §4.2). Still open: how placements are reported.
5. ~~**FC27** (offline)~~ Decided: posts work like any 1v1 game; listing FC27 matches is optional.
9. **Stages and brackets** (Swiss, round robin, single/double elimination, combinations): today the stage goes
   in the round code and the committee makes the pairings. A bracket engine that tracks results and generates
   next rounds is planned as a later phase, after phase 2.
6. **Reporting deadline rule:** fixed per round, or `window_end + N hours`?
7. ~~**Auto `PENDING RESULTS`**~~ Decided: at `window_start`, when play begins.
8. ~~**WO handling**~~ Decided: no WO tag; the WO is written in the thread and the post tagged `FINISHED` (§6.1).

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
- [ ] A lobby of 3+ teams gives one post with a numbered team list; with ~20 squads of 4 only captains are pinged and every player still sees the post in their sidebar.
- [ ] Changing a player in `teams.csv` and re-syncing updates every post of that team and adds the new player.
- [ ] (Phase 2) Status moves to `PENDING RESULTS` at `window_start`; reminders fire once.
- [ ] (Phase 2) Slash commands are refused for members without `PIC TEC 2026` or `Admin`.
- [ ] (Stage 3) `/tec result score:2-1` inside a post tags it `FINISHED` (game tag kept) and writes the §6.1 line once.
- [ ] The bot token is not in the repository.
