// Discord simulator: renders a mock Discord UI (desktop or phone) and plays scripted steps on it.
import type { Device, Mode, SimMessage, SimPost, SimServer, SimSetup, SimStep } from '../lib/sim-types';
import { resultShotMarkup } from '../lib/shot';

const SIZE: Record<Device, { w: number; h: number }> = {
  desktop: { w: 900, h: 580 },
  mobile: { w: 380, h: 760 },
};

export interface RunControl {
  cancelled: boolean;
  paused: boolean;
  speed: number;
  mode: Mode;
  onProgress?: (fraction: number) => void;
  labels: { tapHere: string; skip: string };
}

interface State extends SimSetup {
  picker: 'none' | 'menu' | 'gallery';
  typing: string | null;
  fresh: Set<string>;
}

/* ------------------------------------------------------------------------ */
/* small helpers                                                             */
/* ------------------------------------------------------------------------ */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ICONS: Record<string, string> = {
  hash: '<path d="M9 3 7 21M17 3l-2 18M4 8.5h17M3 15.5h17" />',
  announce: '<path d="M4 10v4h3l6 4V6L7 10H4Z" /><path d="M16 9.5a4 4 0 0 1 0 5" />',
  rules: '<rect x="4" y="4" width="16" height="16" rx="3" /><path d="m8 12 3 3 5-6" />',
  forum: '<path d="M4 5h11v8H8l-4 3V5Z" /><path d="M15 9h5v10l-3-2.5h-6V13" />',
  lock: '<rect x="6" y="11" width="12" height="9" rx="2" /><path d="M9 11V8a3 3 0 0 1 6 0v3" />',
  plus: '<path d="M12 6v12M6 12h12" />',
  send: '<path d="M5 12h12M12 6l6 6-6 6" />',
  back: '<path d="M15 5l-7 7 7 7" />',
  chevron: '<path d="m7 10 5 5 5-5" />',
  search: '<circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" />',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2Z" /><path d="M10 20a2 2 0 0 0 4 0" />',
  emoji: '<circle cx="12" cy="12" r="8" /><path d="M9 14a4 4 0 0 0 6 0" /><path d="M9.5 10h.01M14.5 10h.01" />',
  gift: '<rect x="4" y="9" width="16" height="11" rx="1" /><path d="M12 9v11M4 13h16" />',
  file: '<path d="M7 3h7l5 5v13H7V3Z" /><path d="M14 3v5h5" />',
  thread: '<path d="M5 5h14v10H9l-4 4V5Z" /><path d="M9 9h6M9 12h4" />',
  home: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4v-9Z" />',
  chat: '<path d="M4 5h16v11H9l-5 4V5Z" />',
  user: '<circle cx="12" cy="9" r="4" /><path d="M5 20a7 7 0 0 1 14 0" />',
  pin: '<path d="M9 4h6l-1 6 3 3H7l3-3-1-6ZM12 13v7" />',
  members: '<circle cx="9" cy="9" r="3.5" /><path d="M3 19a6 6 0 0 1 12 0" /><circle cx="17" cy="8" r="2.5" /><path d="M16 13.5a5 5 0 0 1 5 5" />',
};

const icon = (name: string, cls = '') =>
  `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] ?? ''}</svg>`;

const channelIcon = (kind: string) =>
  icon(kind === 'announce' ? 'announce' : kind === 'rules' ? 'rules' : kind === 'forum' ? 'forum' : 'hash');

function initials(name: string) {
  const first = name.split('|')[0].trim();
  return first.slice(0, 1).toUpperCase();
}

/* ------------------------------------------------------------------------ */

export class DiscordSim {
  readonly el: HTMLElement;
  readonly server: SimServer;
  device: Device = 'desktop';
  private canvas: HTMLElement;
  private screen: HTMLElement;
  private cursor: HTMLElement;
  private subtitle: HTMLElement;
  private overlay: HTMLElement;
  private state!: State;
  private scale = 1;
  private ambientTimer: number | undefined;
  private cursorPos = { x: 0, y: 0 };
  private baseUsers: SimServer['users'];

  private caption: HTMLElement | null;

  constructor(el: HTMLElement, server: SimServer, caption: HTMLElement | null = null) {
    this.caption = caption;
    this.el = el;
    this.server = structuredClone(server);
    this.baseUsers = structuredClone(server.users);
    el.innerHTML = `
      <div class="sim-canvas">
        <div class="sim-screen"></div>
        <div class="sim-overlay"></div>
        <div class="sim-cursor" aria-hidden="true"><span class="sim-cursor__ripple"></span>
          <svg class="sim-cursor__arrow" viewBox="0 0 24 24"><path d="M4 2l15 11-6.5 1.2L16 21l-3 1.4-3.6-7L4 19V2Z"/></svg>
          <span class="sim-cursor__finger"></span>
        </div>
        <div class="sim-subtitle" aria-live="polite"></div>
      </div>`;
    this.canvas = el.querySelector('.sim-canvas')!;
    this.screen = el.querySelector('.sim-screen')!;
    this.overlay = el.querySelector('.sim-overlay')!;
    this.cursor = el.querySelector('.sim-cursor')!;
    this.subtitle = el.querySelector('.sim-subtitle')!;
    new ResizeObserver(() => this.fit()).observe(el);
  }

  /* ---------------------------- layout ---------------------------------- */

  setDevice(device: Device) {
    this.device = device;
    if (this.state) this.render();
  }

  private fit() {
    const { w, h } = SIZE[this.device];
    const box = this.el.getBoundingClientRect();
    if (!box.width || !box.height) return;
    this.scale = Math.min(box.width / w, box.height / h);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.canvas.style.transform = `translate(-50%, -50%) scale(${this.scale})`;
  }

  load(setup: SimSetup) {
    this.server.users = structuredClone(this.baseUsers);
    this.state = {
      ...structuredClone(setup),
      composer: setup.composer ?? '',
      attachment: setup.attachment ?? null,
      picker: 'none',
      typing: null,
      fresh: new Set(),
    };
    this.overlay.innerHTML = '';
    this.say('');
    this.cursor.classList.remove('is-on');
    this.render();
    this.startAmbient();
  }

  private render() {
    const { w, h } = SIZE[this.device];
    this.canvas.dataset.device = this.device;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.screen.innerHTML = this.device === 'desktop' ? this.desktopHTML() : this.mobileHTML();
    this.fit();
    const list = this.screen.querySelector<HTMLElement>('.dc-messages');
    if (list) list.scrollTop = list.scrollHeight;
    this.state.fresh.clear();
  }

  /* ---------------------------- markup ---------------------------------- */

  private fmt(text: string) {
    const meId = this.server.me;
    return esc(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/&lt;@(\w+)&gt;/g, (_, id) => {
        const u = this.server.users[id];
        return `<span class="dc-mention${id === meId ? ' is-me' : ''}">@${esc(u ? u.name : id)}</span>`;
      })
      .replace(/&lt;#([\w-]+)&gt;/g, (_, id) => `<span class="dc-mention">#${esc(id)}</span>`)
      .replace(/\[ts:(.+?)\]/g, '<span class="dc-ts">$1</span>');
  }

  private avatar(userId: string, size = 40) {
    const u = this.server.users[userId];
    return `<span class="dc-avatar" style="--c:${u?.color ?? '#5865f2'};--s:${size}px">${esc(initials(u?.name ?? '?'))}${
      u?.online ? '<i class="dc-presence"></i>' : ''
    }</span>`;
  }

  private nameTag(userId: string) {
    const u = this.server.users[userId];
    if (!u) return '';
    const role = u.role ? `<span class="dc-role" style="--rc:${u.roleColor}">${esc(u.role)}</span>` : '';
    return `<span class="dc-name" style="color:${u.roleColor ?? '#f2f3f5'}">${esc(u.name)}</span>${role}`;
  }

  private messageHTML(m: SimMessage) {
    const mentionsMe = m.text.includes(`<@${this.server.me}>`);
    const reactions = (m.reactions ?? [])
      .map(
        (r) =>
          `<span class="dc-reaction${r.mine ? ' is-mine' : ''}" data-t="react:${m.id}:${r.emoji}">${r.emoji}<b>${r.count}</b></span>`,
      )
      .join('');
    return `
      <div class="dc-msg${mentionsMe ? ' is-mention' : ''}${this.state.fresh.has(m.id) ? ' is-new' : ''}" data-t="msg:${m.id}">
        ${this.avatar(m.author)}
        <div class="dc-msg__body">
          <div class="dc-msg__head">${this.nameTag(m.author)}<span class="dc-time">${esc(m.time ?? 'Hari ini')}</span></div>
          <div class="dc-msg__text">${this.fmt(m.text)}</div>
          ${m.attachment === 'result' ? `<div class="dc-attach">${resultShotMarkup()}</div>` : ''}
          ${reactions ? `<div class="dc-reactions">${reactions}</div>` : ''}
        </div>
      </div>`;
  }

  private tagsHTML(tags: string[]) {
    return tags
      .map((t) => {
        const def = this.server.tags[t];
        return `<span class="dc-tag dc-tag--${def?.tone ?? 'neutral'}">${def?.emoji ?? ''} ${esc(t)}</span>`;
      })
      .join('');
  }

  private currentPost(): SimPost {
    return this.state.posts.find((p) => p.id === this.state.post) ?? this.state.posts[0];
  }

  private channelListHTML() {
    const s = this.server;
    return s.categories
      .map((cat) => {
        const items = cat.channels
          .map((ch) => {
            const threads =
              ch.id === s.forum
                ? this.state.posts
                    .map((p) => {
                      const active = this.state.view === 'thread' && p.id === this.state.post;
                      return `<div class="dc-thread${active ? ' is-active' : ''}${p.mention ? ' is-unread' : ''}" data-t="thread:${p.id}">
                        <span class="dc-thread__branch"></span><span class="dc-thread__name">${esc(p.title)}</span>${
                          p.mention ? '<span class="dc-badge">1</span>' : ''
                        }</div>`;
                    })
                    .join('')
                : '';
            const active = this.state.view === 'home' && ch.id === 'pengumuman' && this.device === 'desktop';
            return `<div class="dc-ch${active ? ' is-active' : ''}${ch.unread ? ' is-unread' : ''}" data-t="ch:${ch.id}" data-ch="${ch.id}">
                ${channelIcon(ch.kind)}<span class="dc-ch__name">${ch.emoji ? `${ch.emoji}` : ''}${esc(ch.name)}</span>${
                  ch.locked ? icon('lock', 'dc-ch__lock') : ''
                }
              </div>${threads}`;
          })
          .join('');
        return `<div class="dc-cat"><div class="dc-cat__name">${icon('chevron')}${cat.emoji ?? ''} ${esc(cat.name)}</div>${items}</div>`;
      })
      .join('');
  }

  private railHTML() {
    return `
      <div class="dc-rail">
        <div class="dc-rail__item dc-rail__dm">${icon('chat')}</div>
        <div class="dc-rail__sep"></div>
        <div class="dc-rail__item is-active dc-rail__tec"><span>TEC</span></div>
        <div class="dc-rail__item">FC</div>
        <div class="dc-rail__item dc-rail__add">${icon('plus')}</div>
      </div>`;
  }

  private composerHTML() {
    const post = this.currentPost();
    const { composer, attachment, picker } = this.state;
    const hasContent = Boolean(composer || attachment);
    const sendBtn =
      this.device === 'mobile'
        ? `<button class="dc-send${hasContent ? ' is-ready' : ''}" data-t="send" tabindex="-1">${icon('send')}</button>`
        : `<span class="dc-enter${hasContent ? ' is-ready' : ''}" data-t="send">Enter ↵</span>`;
    const menu =
      picker === 'menu'
        ? `<div class="dc-menu"><div class="dc-menu__item" data-t="upload">${icon('file')} Unggah File</div><div class="dc-menu__item">${icon('thread')} Buat Thread</div></div>`
        : '';
    return `
      <div class="dc-composer-wrap">
        ${menu}
        <div class="dc-composer">
          ${
            attachment
              ? `<div class="dc-composer__attach"><div class="dc-composer__thumb">${resultShotMarkup()}</div><span>hasil_laga.png</span></div>`
              : ''
          }
          <div class="dc-composer__row">
            <button class="dc-plus" data-t="plus" tabindex="-1">${icon('plus')}</button>
            <div class="dc-input" data-t="composer">${
              composer ? `<span class="dc-input__text">${esc(composer)}</span><span class="dc-caret"></span>` : `<span class="dc-input__ph">Kirim pesan ke ${esc(this.shortTitle(post.title))}</span>`
            }</div>
            ${this.device === 'desktop' ? `<span class="dc-composer__icons">${icon('gift')}${icon('emoji')}</span>` : ''}
            ${sendBtn}
          </div>
        </div>
        ${this.typingHTML()}
      </div>`;
  }

  private typingHTML() {
    const u = this.state.typing ? this.server.users[this.state.typing] : null;
    return `<div class="dc-typing${u ? ' is-on' : ''}">${
      u ? `<span class="dc-typing__dots"><i></i><i></i><i></i></span><b>${esc(u.name)}</b> sedang mengetik…` : ''
    }</div>`;
  }

  private shortTitle(title: string) {
    return title.length > 28 ? `${title.slice(0, 27)}…` : title;
  }

  private threadHTML() {
    const post = this.currentPost();
    const starter = `
      <div class="dc-starter">
        <h3 class="dc-starter__title">${esc(post.title)}</h3>
        <div class="dc-starter__tags">${this.tagsHTML(post.tags)}</div>
        <div class="dc-msg dc-msg--starter" data-t="starter">
          ${this.avatar(post.author)}
          <div class="dc-msg__body">
            <div class="dc-msg__head">${this.nameTag(post.author)}<span class="dc-time">${esc(post.time)}</span></div>
            <div class="dc-msg__text">${this.fmt(post.text)}</div>
          </div>
        </div>
        <div class="dc-divider"><span>${post.replies.length} balasan</span></div>
      </div>`;
    return `<div class="dc-messages">${starter}${post.replies.map((m) => this.messageHTML(m)).join('')}</div>`;
  }

  private pickerHTML() {
    if (this.state.picker !== 'gallery') return '';
    const thumbs = `
      <div class="dc-gallery__item is-pick" data-t="pick:result">${resultShotMarkup()}<span>hasil_laga.png</span></div>
      <div class="dc-gallery__item dc-gallery__item--blank"><span>IMG_2031.jpg</span></div>
      <div class="dc-gallery__item dc-gallery__item--blank"><span>IMG_2030.jpg</span></div>`;
    return this.device === 'mobile'
      ? `<div class="dc-sheet"><div class="dc-sheet__handle"></div><div class="dc-sheet__title">Galeri</div><div class="dc-gallery">${thumbs}</div></div>`
      : `<div class="dc-dialog"><div class="dc-dialog__box"><div class="dc-dialog__title">Pilih file untuk diunggah</div><div class="dc-gallery">${thumbs}</div></div></div>`;
  }

  private desktopHTML() {
    const s = this.server;
    const post = this.currentPost();
    const me = s.users[s.me];
    const main =
      this.state.view === 'thread'
        ? `<div class="dc-header">${icon('forum')}<span class="dc-header__crumb">${esc(s.forum)}</span><span class="dc-header__sep">›</span><b>${esc(post.title)}</b><span class="dc-header__tags" data-t="tags:${post.id}">${this.tagsHTML(post.tags.slice(1))}</span><span class="dc-header__icons">${icon('bell')}${icon('pin')}${icon('members')}${icon('search')}</span></div>
           ${this.threadHTML()}${this.composerHTML()}`
        : `<div class="dc-header">${icon('announce')}<b>📣pengumuman</b><span class="dc-header__icons">${icon('bell')}${icon('pin')}${icon('members')}${icon('search')}</span></div>
           <div class="dc-messages"><div class="dc-welcome"><div class="dc-welcome__icon">${icon('announce')}</div><h3>Selamat datang di #📣pengumuman!</h3><p>Info resmi dari panitia TEC 2026.</p></div>${this.messageHTML(s.announcement)}</div>
           <div class="dc-composer-wrap"><div class="dc-composer dc-composer--locked">${icon('lock')} Kamu tidak punya izin mengirim pesan di channel ini.</div></div>`;
    return `
      <div class="dc dc--desktop">
        ${this.railHTML()}
        <aside class="dc-side">
          <div class="dc-server">${esc(s.name)} ${icon('chevron')}</div>
          <div class="dc-side__scroll">${this.channelListHTML()}</div>
          <div class="dc-me">${this.avatar(s.me, 32)}<div><b>${esc(me.name.split('|')[0])}</b><small>Online</small></div></div>
        </aside>
        <section class="dc-main">${main}</section>
        ${this.pickerHTML()}
      </div>`;
  }

  private mobileHTML() {
    const s = this.server;
    const post = this.currentPost();
    const status = `<div class="m-status"><b>20.14</b><span>▂▄▆ 4G ▮▮▮</span></div>`;
    if (this.state.view === 'thread') {
      return `
        <div class="dc dc--mobile">
          ${status}
          <div class="m-header">
            <span class="m-back" data-t="back">${icon('back')}</span>
            <div class="m-header__title"><b>${esc(this.shortTitle(post.title))}</b><small>${icon('forum')} ${esc(s.forum)} <span class="dc-header__tags" data-t="tags:${post.id}">${this.tagsHTML(post.tags.slice(1))}</span></small></div>
            <span class="m-header__icons">${icon('members')}</span>
          </div>
          ${this.threadHTML()}
          ${this.composerHTML()}
          ${this.pickerHTML()}
        </div>`;
    }
    return `
      <div class="dc dc--mobile">
        ${status}
        <div class="m-home">
          ${this.railHTML()}
          <div class="m-channels">
            <div class="dc-server">${esc(s.name)} ${icon('chevron')}</div>
            <div class="m-search">${icon('search')} Cari</div>
            <div class="dc-side__scroll">${this.channelListHTML()}</div>
          </div>
        </div>
        <nav class="m-tabs">
          <span class="is-active">${icon('home')}<small>Server</small></span>
          <span>${icon('chat')}<small>Pesan</small></span>
          <span>${icon('bell')}<small>Notifikasi</small></span>
          <span>${this.avatar(s.me, 22)}<small>Kamu</small></span>
        </nav>
      </div>`;
  }

  /* ---------------------------- ambient life ---------------------------- */

  private startAmbient() {
    window.clearInterval(this.ambientTimer);
    const idle = ['mlbb', 'dota2', 'general', 'magic-chess-go-go', 'pubgm', 'literally-catur'];
    this.ambientTimer = window.setInterval(() => {
      if (document.hidden) return;
      const id = idle[Math.floor(Math.random() * idle.length)];
      const ch = this.screen.querySelector<HTMLElement>(`[data-ch="${id}"]`);
      ch?.classList.toggle('is-unread');
    }, 2600);
  }

  /* ---------------------------- playback -------------------------------- */

  private async sleep(ms: number, ctl: RunControl) {
    let left = ms / ctl.speed;
    while (left > 0) {
      if (ctl.cancelled) return;
      const tick = Math.min(50, left);
      await new Promise((r) => setTimeout(r, tick));
      if (!ctl.paused) left -= tick;
    }
  }

  private find(target: string) {
    return this.canvas.querySelector<HTMLElement>(`[data-t="${CSS.escape(target)}"]`);
  }

  private centerOf(el: HTMLElement) {
    const c = this.canvas.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: (r.left + r.width / 2 - c.left) / this.scale, y: (r.top + r.height / 2 - c.top) / this.scale };
  }

  private async moveCursor(target: string, ctl: RunControl) {
    const el = this.find(target);
    if (!el) return null;
    const p = this.centerOf(el);
    if (!this.cursor.classList.contains('is-on')) {
      const { w, h } = SIZE[this.device];
      this.cursorPos = { x: w * 0.6, y: h * 0.85 };
      this.cursor.style.transition = 'none';
      this.cursor.style.transform = `translate(${this.cursorPos.x}px, ${this.cursorPos.y}px)`;
      void this.cursor.offsetWidth;
      this.cursor.classList.add('is-on');
    }
    const dist = Math.hypot(p.x - this.cursorPos.x, p.y - this.cursorPos.y);
    const dur = Math.max(350, Math.min(1000, dist * 1.4)) / ctl.speed;
    this.cursor.style.transition = `transform ${dur}ms cubic-bezier(0.5, 0, 0.2, 1)`;
    this.cursor.style.transform = `translate(${p.x}px, ${p.y}px)`;
    this.cursorPos = p;
    await this.sleep(dur * ctl.speed + 80, ctl);
    return el;
  }

  private async tapEffect(el: HTMLElement | null, ctl: RunControl) {
    this.cursor.classList.remove('is-tap');
    void this.cursor.offsetWidth;
    this.cursor.classList.add('is-tap');
    el?.classList.add('is-pressed');
    await this.sleep(260, ctl);
    el?.classList.remove('is-pressed');
  }

  /** In "try" mode: highlight the target and wait for the user's click. */
  private waitForUser(target: string, hint: string | undefined, ctl: RunControl) {
    return new Promise<void>((resolve) => {
      const el = this.find(target);
      if (!el) return resolve();
      this.cursor.classList.remove('is-on');
      el.classList.add('sim-target');
      const p = this.centerOf(el);
      const bubble = document.createElement('div');
      bubble.className = 'sim-hint';
      bubble.innerHTML = `<span></span><button type="button">${esc(ctl.labels.skip)}</button>`;
      bubble.querySelector('span')!.textContent = hint ?? ctl.labels.tapHere;
      const { w } = SIZE[this.device];
      bubble.style.left = `${Math.max(12, Math.min(w - 232, p.x - 110))}px`;
      bubble.style.top = `${p.y > 120 ? p.y - 76 : p.y + 34}px`;
      this.overlay.appendChild(bubble);
      const done = () => {
        clearInterval(poll);
        this.canvas.removeEventListener('click', onClick, true);
        el.classList.remove('sim-target');
        bubble.remove();
        resolve();
      };
      const onClick = (e: Event) => {
        const t = e.target as HTMLElement;
        if (t.closest('.sim-hint button') || t.closest(`[data-t="${CSS.escape(target)}"]`)) {
          e.preventDefault();
          done();
        }
      };
      this.canvas.addEventListener('click', onClick, true);
      const poll = window.setInterval(() => {
        if (ctl.cancelled) done();
      }, 100);
    });
  }

  private say(text: string) {
    const el = this.caption ?? this.subtitle;
    el.textContent = text;
    el.classList.toggle('is-on', Boolean(text));
  }

  private applies(step: SimStep) {
    return !step.only || step.only === this.device;
  }

  private pushMessage(m: SimMessage) {
    this.currentPost().replies.push(m);
    this.state.fresh.add(m.id);
    this.render();
  }

  async run(steps: SimStep[], ctl: RunControl) {
    const list = steps.filter((s) => this.applies(s));
    for (let i = 0; i < list.length; i++) {
      if (ctl.cancelled) return;
      ctl.onProgress?.(i / list.length);
      await this.exec(list[i], ctl);
    }
    ctl.onProgress?.(1);
  }

  private async exec(step: SimStep, ctl: RunControl) {
    const st = this.state;
    if ('wait' in step) return this.sleep(step.wait, ctl);
    if ('say' in step) return this.say(step.say);

    if ('point' in step) {
      await this.moveCursor(step.point, ctl);
      return;
    }

    if ('highlight' in step) {
      const el = this.find(step.highlight);
      el?.classList.add('sim-glow');
      await this.sleep(step.ms ?? 1400, ctl);
      el?.classList.remove('sim-glow');
      return;
    }

    if ('tap' in step || 'send' in step) {
      const target = 'tap' in step ? step.tap : 'send';
      if (step.try && ctl.mode === 'try') {
        await this.waitForUser(target, step.hint, ctl);
      } else {
        const el = await this.moveCursor(target, ctl);
        await this.tapEffect(el, ctl);
      }
      if ('send' in step) {
        const m: SimMessage = {
          id: `me-${Date.now()}`,
          author: this.server.me,
          text: st.composer ?? '',
          time: 'Hari ini 20.14',
          attachment: st.attachment ?? undefined,
        };
        st.composer = '';
        st.attachment = null;
        this.pushMessage(m);
        await this.sleep(500, ctl);
      }
      return;
    }

    if ('view' in step) {
      st.view = step.view;
      st.picker = 'none';
      const post = this.currentPost();
      if (step.view === 'thread') post.mention = false;
      this.screen.classList.add('is-switching');
      await this.sleep(140, ctl);
      this.render();
      this.screen.classList.remove('is-switching');
      await this.sleep(400, ctl);
      return;
    }

    if ('picker' in step) {
      st.picker = step.picker;
      this.render();
      await this.sleep(450, ctl);
      return;
    }

    if ('attach' in step) {
      st.attachment = step.attach;
      st.picker = 'none';
      this.render();
      await this.sleep(500, ctl);
      return;
    }

    if ('type' in step) {
      const input = () => this.find('composer');
      st.composer = st.composer ?? '';
      this.render();
      for (const ch of step.type) {
        if (ctl.cancelled) return;
        st.composer += ch;
        const el = input();
        if (el) {
          el.innerHTML = `<span class="dc-input__text">${esc(st.composer)}</span><span class="dc-caret"></span>`;
          el.scrollTop = el.scrollHeight;
        }
        await this.sleep(ch === '\n' ? 180 : 22 + Math.random() * 38, ctl);
      }
      this.render();
      return;
    }

    if ('typing' in step) {
      st.typing = step.typing;
      this.render();
      await this.sleep(step.ms ?? 1600, ctl);
      st.typing = null;
      return;
    }

    if ('msg' in step) {
      st.typing = null;
      this.pushMessage(structuredClone(step.msg));
      await this.sleep(700, ctl);
      return;
    }

    if ('react' in step) {
      const { msg, emoji, by } = step.react;
      const m = this.currentPost().replies.find((r) => r.id === msg || (msg === '$last-mine' && r.author === this.server.me));
      if (m) {
        m.reactions ??= [];
        const existing = m.reactions.find((r) => r.emoji === emoji);
        if (existing) existing.count++;
        else m.reactions.push({ emoji, count: 1, mine: by === this.server.me });
        this.render();
        const pill = this.screen.querySelector<HTMLElement>(`[data-t="react:${CSS.escape(m.id)}:${CSS.escape(emoji)}"]`);
        pill?.classList.add('is-pop');
      }
      await this.sleep(700, ctl);
      return;
    }

    if ('tags' in step) {
      const post = st.posts.find((p) => p.id === step.tags.post);
      if (post) post.tags = step.tags.tags;
      this.render();
      this.find(`tags:${step.tags.post}`)?.classList.add('is-flash');
      await this.sleep(900, ctl);
      return;
    }

    if ('online' in step) {
      const u = this.server.users[step.online];
      if (u) u.online = true;
      this.render();
      return;
    }

    if ('notify' in step) {
      const n = document.createElement('div');
      n.className = 'sim-notify';
      n.innerHTML = `<b></b><span></span>`;
      n.querySelector('b')!.textContent = step.notify.title;
      n.querySelector('span')!.textContent = step.notify.body;
      this.overlay.appendChild(n);
      await this.sleep(2600, ctl);
      n.classList.add('is-leaving');
      setTimeout(() => n.remove(), 400);
      return;
    }
  }

  stop() {
    window.clearInterval(this.ambientTimer);
  }
}
