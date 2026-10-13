// Slide-deck player: steps through slides, plays simulator scenes, autoplays like a video.
import { DiscordSim, type RunControl } from './sim';
import { completeMission, showToast } from './progress';
import type { Device, Mode, SimScene, SimServer } from '../lib/sim-types';

interface Payload {
  slug: string;
  badge: string;
  xp: number;
  server: SimServer;
  slides: { id: string; duration: number; scene: SimScene | null }[];
  labels: { play: string; pause: string; tapHere: string; skip: string; missionDone: string; badge: string };
}

const PREF_KEY = 'tec2026:deck';

function readPrefs(): { device?: Device; mode?: Mode } {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
  } catch {
    return {};
  }
}

function writePrefs(p: { device: Device; mode: Mode }) {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function initDeck(root: HTMLElement) {
  const data: Payload = JSON.parse(root.querySelector('[data-deck-json]')!.textContent || '{}');
  const caption = root.querySelector<HTMLElement>('[data-caption]');
  const sim = new DiscordSim(root.querySelector<HTMLElement>('[data-sim]')!, data.server, caption);
  const slides = [...root.querySelectorAll<HTMLElement>('[data-slide]')];
  const visuals = [...root.querySelectorAll<HTMLElement>('[data-visual]')];
  const segs = [...root.querySelectorAll<HTMLElement>('[data-seg]')];
  const playBtn = root.querySelector<HTMLButtonElement>('[data-play]')!;
  const counter = root.querySelector<HTMLElement>('[data-counter]')!;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const prefs = readPrefs();
  let device: Device = prefs.device ?? (window.matchMedia('(max-width: 900px)').matches ? 'mobile' : 'desktop');
  let mode: Mode = prefs.mode ?? 'watch';
  let index = 0;
  let playing = !reduceMotion;
  let ctl: RunControl | null = null;
  let started = false;

  root.classList.add('is-ready');
  sim.setDevice(device);

  function setPressed(attr: string, value: string) {
    root.querySelectorAll<HTMLButtonElement>(`[${attr}]`).forEach((b) => {
      b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
    });
  }

  function setPlaying(p: boolean) {
    playing = p;
    root.classList.toggle('is-paused', !p);
    playBtn.setAttribute('aria-label', p ? data.labels.pause : data.labels.play);
    if (ctl) ctl.paused = !p;
  }

  function setSegProgress(i: number, f: number) {
    segs[i]?.style.setProperty('--p', String(Math.max(0, Math.min(1, f))));
  }

  async function timer(ms: number, c: RunControl, report = true) {
    let elapsed = 0;
    while (elapsed < ms) {
      if (c.cancelled) return;
      await new Promise((r) => setTimeout(r, 100));
      if (!c.paused) elapsed += 100;
      if (report) c.onProgress?.(elapsed / ms);
    }
  }

  async function go(i: number) {
    if (ctl) ctl.cancelled = true;
    index = Math.max(0, Math.min(slides.length - 1, i));
    const slide = data.slides[index];

    slides.forEach((el, n) => el.classList.toggle('is-active', n === index));
    visuals.forEach((el, n) => el.classList.toggle('is-active', n === index));
    segs.forEach((_, n) => setSegProgress(n, n < index ? 1 : 0));
    segs.forEach((el, n) => el.setAttribute('aria-selected', String(n === index)));
    counter.textContent = String(index + 1);
    root.classList.toggle('is-sim', Boolean(slide.scene));

    const c: RunControl = {
      cancelled: false,
      paused: !playing,
      speed: 1,
      mode,
      labels: { tapHere: data.labels.tapHere, skip: data.labels.skip },
      onProgress: (f) => setSegProgress(index, f),
    };
    ctl = c;

    if (caption) {
      caption.textContent = '';
      caption.classList.remove('is-on');
    }

    if (slide.scene) {
      sim.load(slide.scene.setup);
      await sim.run(slide.scene.steps, c);
    } else {
      await timer(slide.duration, c);
    }
    if (c.cancelled) return;
    setSegProgress(index, 1);

    if (playing && index < slides.length - 1) {
      await timer(slide.scene ? 1200 : 0, c, false);
      if (!c.cancelled && playing) go(index + 1);
    } else if (index === slides.length - 1) {
      setPlaying(false);
    }
  }

  // ---- controls --------------------------------------------------------
  root.querySelector('[data-prev]')!.addEventListener('click', () => go(index - 1));
  root.querySelector('[data-next]')!.addEventListener('click', () => go(index + 1));
  root.querySelector('[data-replay]')!.addEventListener('click', () => {
    setPlaying(true);
    go(index);
  });
  playBtn.addEventListener('click', () => {
    const atEnd = index === slides.length - 1 && !playing;
    setPlaying(!playing);
    if (atEnd) go(0);
  });
  segs.forEach((el, n) => el.addEventListener('click', () => go(n)));

  root.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((b) =>
    b.addEventListener('click', () => {
      mode = b.dataset.mode as Mode;
      setPressed('data-mode', mode);
      writePrefs({ device, mode });
      setPlaying(true);
      go(index);
    }),
  );

  root.querySelectorAll<HTMLButtonElement>('[data-device]').forEach((b) =>
    b.addEventListener('click', () => {
      device = b.dataset.device as Device;
      setPressed('data-device', device);
      writePrefs({ device, mode });
      sim.setDevice(device);
      go(index);
    }),
  );

  root.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('input, textarea')) return;
    if (e.key === 'ArrowRight') go(index + 1);
    else if (e.key === 'ArrowLeft') go(index - 1);
    else return;
    e.preventDefault();
  });

  // copy template
  root.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((b) =>
    b.addEventListener('click', async () => {
      const text = b.dataset.copy ?? '';
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      const label = b.textContent;
      b.textContent = b.dataset.copied ?? '✓';
      setTimeout(() => (b.textContent = label), 1800);
    }),
  );

  // claim reward
  root.querySelectorAll<HTMLButtonElement>('[data-claim]').forEach((b) =>
    b.addEventListener('click', () => {
      completeMission(data.slug);
      showToast({ title: data.labels.missionDone, body: `+${data.xp} XP`, badge: `${data.labels.badge}: ${data.badge}` });
      b.disabled = true;
      b.textContent = '✓';
    }),
  );

  setPressed('data-mode', mode);
  setPressed('data-device', device);
  setPlaying(playing);

  // Start when the deck scrolls into view (autoplay like a video).
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      if (visible && !started) {
        started = true;
        go(0);
      }
      if (ctl && started) ctl.paused = !playing || !visible;
    },
    { threshold: 0.35 },
  );
  io.observe(root);
}
