// Mission progress, stored per browser. Storage may be unavailable (private mode), so every
// access is guarded and the site keeps working without it.

const KEY = 'tec2026:progress';
export const XP_PER_MISSION = 100;

export interface Progress {
  completed: string[];
}

export function readProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && Array.isArray(parsed.completed)) return { completed: parsed.completed.filter((s: unknown) => typeof s === 'string') };
  } catch {
    /* ignore */
  }
  return { completed: [] };
}

/** Marks a mission done. Returns true if it was newly completed. */
export function completeMission(slug: string): boolean {
  const p = readProgress();
  if (p.completed.includes(slug)) return false;
  p.completed.push(slug);
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
  document.dispatchEvent(new CustomEvent('tec:progress', { detail: p }));
  return true;
}

export function xpOf(p: Progress) {
  return p.completed.length * XP_PER_MISSION;
}

export interface ToastDetail {
  title: string;
  body: string;
  badge?: string;
}

export function showToast(detail: ToastDetail) {
  document.dispatchEvent(new CustomEvent<ToastDetail>('tec:toast', { detail }));
}
