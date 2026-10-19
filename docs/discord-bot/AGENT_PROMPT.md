# Prompt for a coding agent

Copy everything below the line into a new Claude Code session (in an empty repository for the bot,
or a `bot/` folder), and attach or paste the files in this folder.

---

Build a Discord bot for the **TEC 2026** e-sport competition in the "Treasury E-Sport Community"
server. It creates and maintains **one forum post per match** in the forum channel `🏅tec-2026`.

The complete specification is in `docs/discord-bot/` of
https://github.com/jaya886/treasury-e-sport:

- `README.md`: the spec (title/message format, tags, status lifecycle, permissions, API calls, acceptance checklist)
- `server.json`: exact channel, role and tag names, and the post template
- `teams.example.csv`, `matches.example.csv`: example input (roster + matches)

Requirements:

1. Follow the spec exactly. Post titles, the opening message (Bahasa Indonesia, Discord `<t:…>`
   timestamps) and tags must match §4, because participants are taught this exact format by a guide website.
2. Build **phase 1** first: a TypeScript (Node 22, discord.js v14) CLI `npm run sync -- <matches.csv> <teams.csv>`
   that validates the CSV, resolves Discord usernames to members, and creates or updates posts idempotently
   (state file mapping `match_id → thread_id`). Support `DRY_RUN=true`.
3. Read all IDs and the token from environment variables (§8.1). Provide `.env.example`; never commit secrets.
4. Support lobbies of 3+ teams (PUBGM) and the captains-only mention fallback (§4.1, §4.2). FC27 works like any 1v1 game.
5. Never change a post whose status tag a PIC set to `FINISHED` or `DISPUTED`.
6. Write unit tests for: CSV validation, title building/shortening, message rendering (timestamps,
   mentions, `allowed_mentions`), and the tag-replacement logic. Mock the Discord API.
7. Add a README with setup steps: creating the bot in the Discord Developer Portal, the permissions
   in §8.2, inviting it, enabling Developer Mode to copy IDs, giving it access to `🏅pic-tec`, and
   running against a test server first.
8. After phase 1 works, propose (don't build yet) the phase 2 design: scheduler for status changes and
   reminders (§6) and slash commands (§7), including where to host it.

Ask me about anything in §11 (open questions) that blocks you, instead of guessing.
